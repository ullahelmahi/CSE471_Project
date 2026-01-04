const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   MONGODB
====================== */
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jrp51rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/* ======================
   AUTH
====================== */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_default";

/* ======================
   AUTH MIDDLEWARE
====================== */
const verifyJWT = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send({ message: "Unauthorized" });

  const token = auth.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });
    req.decoded = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await client
    .db("cityNetISP")
    .collection("users")
    .findOne({ email });

  if (!user || user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden" });
  }
  next();
};

/* ======================
   MAIN SERVER
====================== */
async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const db = client.db("cityNetISP");

    const users = db.collection("users");
    const packages = db.collection("packages");
    const reviews = db.collection("reviews");
    const subscriptions = db.collection("userplans");
    const supportRequests = db.collection("supportRequests");
    const payments = db.collection("payments");
    const technicians = db.collection("technicians");
    const technicianAssignments = db.collection("technicianAssignments");
    const serviceFeedbacks = db.collection("serviceFeedbacks");
    // Ensure one feedback per service per user (DB-level safety)
    await serviceFeedbacks.createIndex(
      { supportRequestId: 1, userId: 1 },
      { unique: true }
    );

    /* ======================
       AUTH
    ====================== */

    app.post("/users", async (req, res) => {
      const { name, email, password, phone, address, location } = req.body;

      if (!name || !email || !password || !phone || !address || !location) {
        return res.status(400).send({ message: "All fields required" });
      }
      if (!/^\d{11}$/.test(phone)) {
        return res
          .status(400)
          .send({ message: "Phone number must be exactly 11 digits" });
      }

      const existing = await users.findOne({ email });
      if (existing) {
        return res.status(409).send({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userDoc = {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        location, // { lat, lng }
        role: "user",
        createdAt: new Date(),
      };

  await users.insertOne(userDoc);
  res.status(201).send({ success: true });
});


    app.post("/auth/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await users.findOne({ email });
      if (!user) return res.status(401).send({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send({ message: "Invalid credentials" });

      const token = jwt.sign(
        { email: user.email, role: user.role, id: user._id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.send({
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });

    // ======================
    // ADMIN: UPDATE SUBSCRIPTION STATUS
    // ======================
    app.get("/admin/users", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await users.aggregate([
        {
          $addFields: {
            userIdStr: { $toString: "$_id" }   // 🔑 FIX
          }
        },
        {
          $lookup: {
            from: "userplans",
            localField: "userIdStr",
            foreignField: "userId",
            as: "subscriptions",
          }
        },
        {
          $addFields: {
            latestSubscription: {
              $first: {
                $sortArray: {
                  input: "$subscriptions",
                  sortBy: { subscriptionDate: -1 }
                }
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            role: 1,
            phone: 1,
            address: 1,
            location: 1,
            createdAt: 1,

            planName: {
              $ifNull: ["$latestSubscription.planName", "None"]
            },

            planStatus: {
              $ifNull: ["$latestSubscription.status", "inactive"]
            },

            subscriptionId: "$latestSubscription._id",

            paymentMethod: {
              $ifNull: ["$latestSubscription.paymentMethod", "N/A"]
            },

            paymentStatus: {
              $ifNull: ["$latestSubscription.paymentStatus", "N/A"]
            },

            validityLeft: {
              $cond: [
                { $ifNull: ["$latestSubscription.subscriptionDate", false] },
                {
                  $ceil: {
                    $divide: [
                      {
                        $subtract: [
                          {
                            $add: [
                              "$latestSubscription.subscriptionDate",
                              { $multiply: [30, 24, 60, 60, 1000] }
                            ]
                          },
                          new Date()
                        ]
                      },
                      86400000
                    ]
                  }
                },
                null
              ]
            }
          }
        }
      ]).toArray();

      res.send(result);
    });

    app.patch(
      "/admin/subscription/:id/status",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
          return res.status(400).send({ message: "Invalid status" });
        }

        const subscription = await subscriptions.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!subscription) {
          return res.status(404).send({ message: "Subscription not found" });
        }

        // RULE: active → inactive ONLY if validity expired
        if (
          subscription.status === "active" &&
          status === "inactive"
        ) {
          const expiry =
            new Date(subscription.subscriptionDate).getTime() +
            30 * 24 * 60 * 60 * 1000;

          if (Date.now() < expiry) {
            return res.status(403).send({
              message: "Cannot deactivate active plan before validity expires",
            });
          }
        }

        await subscriptions.updateOne(
          { _id: subscription._id },
          { $set: { status } }
        );

        res.send({ success: true });
      }
    );

    
    app.patch(
      "/admin/users/role/:email",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
          return res.status(400).send({ message: "Invalid role" });
        }

        const result = await users.updateOne(
          { email: req.params.email },
          { $set: { role } }
        );

        res.send(result);
      }
    );

    app.delete(
      "/admin/users/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const userId = req.params.id;

        // Check active subscription
        const activePlan = await subscriptions.findOne({
          userId,
          status: "active",
        });

        if (activePlan) {
          return res.status(403).send({
            message: "Cannot delete user with active subscription",
          });
        }

        await users.deleteOne({ _id: new ObjectId(userId) });
        await subscriptions.deleteMany({ userId });

        res.send({ success: true });
      }
    );


    /* ======================
       PACKAGES
    ====================== */
    app.get("/packages", async (req, res) => {
      const result = await packages.find().toArray();
      res.send(result);
    });
    /* ======================
      PACKAGES (ADMIN)
    ====================== */

    // ADD PACKAGE
    app.post("/packages", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const pkg = {
          ...req.body,
          createdAt: new Date()
        };

        const result = await packages.insertOne(pkg);
        res.status(201).send(result);
      } catch (err) {
        console.error("Add package failed:", err);
        res.status(500).send({ message: "Failed to add package" });
      }
    });

    // UPDATE PACKAGE
    app.patch("/packages/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        const updateDoc = {
          $set: {
            ...req.body,
            lastUpdated: new Date()
          }
        };

        const result = await packages.updateOne(
          { _id: new ObjectId(id) },
          updateDoc
        );

        res.send(result);
      } catch (err) {
        console.error("Update package failed:", err);
        res.status(500).send({ message: "Failed to update package" });
      }
    });

    // DELETE PACKAGE
    app.delete("/packages/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        const result = await packages.deleteOne({
          _id: new ObjectId(id)
        });

        res.send(result);
      } catch (err) {
        console.error("Delete package failed:", err);
        res.status(500).send({ message: "Failed to delete package" });
      }
    });

    /* ======================
       REVIEWS
    ====================== */
    app.get("/reviews", async (req, res) => {
      const result = await reviews.find().sort({ createdAt: -1 }).toArray();
      res.send(result);
    });

    app.post("/reviews", verifyJWT, async (req, res) => {
      const {
        planId,
        planName,
        rating,
        message,
        anonymous,
        userName
      } = req.body;

      const userId = String(req.decoded.id);

      if (!planId || !rating || !message) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      // 1️⃣ Check active subscription
      const activeSubscription = await subscriptions.findOne({
        userId,
        planId,
        status: "active",
      });

      if (!activeSubscription) {
        return res.status(403).send({
          message: "You can only review your active subscription",
        });
      }

      // 2️⃣ One review per subscription
      const existingReview = await reviews.findOne({ userId, planId });
      if (existingReview) {
        return res.status(409).send({
          message: "You have already reviewed this plan",
        });
      }

      // 3️⃣ Name handling (CRITICAL FIX)
      let finalName = "Anonymous";

      if (!anonymous && userName) {
        // Mask only first name: M*** Khan
        const parts = userName.trim().split(" ");
        const first = parts[0];
        const maskedFirst = first[0] + "***";
        const rest = parts.slice(1).join(" ");
        finalName = rest ? `${maskedFirst} ${rest}` : maskedFirst;
      }

      // 4️⃣ Save review
      const review = {
        userId,
        userName: finalName,
        anonymous: Boolean(anonymous),
        planId,
        planName,
        rating: Number(rating),
        message: message.trim(),
        createdAt: new Date(),
      };

      await reviews.insertOne(review);

      res.status(201).send({ success: true });
    });
    /* ======================
       SUBSCRIPTIONS 
       ✔ userId ALWAYS STRING
       ✔ One active plan per user
    ====================== */
    app.get("/subscriptions/check", async (req, res) => {
      const { userId, planId } = req.query;

      const existing = await subscriptions.findOne({
        userId: String(userId),
        planId,
      });

      res.send({ exists: !!existing });
    });

    app.post("/subscriptions", async (req, res) => {
      const { userId, planId, planName, price } = req.body;

      if (!userId || !planId) {
        return res.status(400).send({ message: "Missing fields" });
      }

      // deactivate old plans
      await subscriptions.updateMany(
        { userId: String(userId) },
        { $set: { status: "inactive" } }
      );

      const subscription = {
        userId: String(userId), 
        planId,
        planName,
        price,
        status: "active",
        subscriptionDate: new Date(),
      };

      const result = await subscriptions.insertOne(subscription);
      res.send(result);
    });

    app.get("/subscriptions/:userId", async (req, res) => {
      const result = await subscriptions
        .find({ userId: String(req.params.userId) }) 
        .sort({ subscriptionDate: -1 })
        .toArray();

      res.send(result);
    });

    /* ======================
       PAYMENTS
    ====================== */
    app.post("/payments", verifyJWT, async (req, res) => {
      const {
        planId,
        planName,
        amount,
        paymentMethod,
        bkashNumber,
        transactionId,
      } = req.body;
      // calculate price from DB
      const pkg = await packages.findOne({ planId });

      if (!pkg) {
        return res.status(404).send({ message: "Package not found" });
      }

      const originalPrice = Number(pkg.price);
      const discount = Number(pkg.discount || 0);

      const finalAmount =
        discount > 0
          ? Math.round(originalPrice - (originalPrice * discount) / 100)
          : originalPrice;

      const userId = String(req.decoded.id);

      if (!planId || !paymentMethod) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      if (paymentMethod === "bkash") {
        if (!bkashNumber || !transactionId) {
          return res.status(400).send({
            message: "bKash number and transaction ID required",
          });
        }
      }

      const payment = {
        userId,
        planId,
        planName,
        amount: finalAmount,
        originalPrice,
        discount,
        paymentMethod, // cash | bkash
        bkashNumber: paymentMethod === "bkash" ? bkashNumber : null,
        transactionId: paymentMethod === "bkash" ? transactionId : null,
        paymentStatus:
          paymentMethod === "bkash" ? "paid" : "pending",
        isDemo: paymentMethod === "bkash",
        createdAt: new Date(),
        verifiedAt: paymentMethod === "bkash" ? new Date() : null,
      };

      await payments.insertOne(payment);

      // ✅ AUTO-ACTIVATE FOR DUMMY BKASH
      if (paymentMethod === "bkash") {
        await subscriptions.updateMany(
          { userId },
          { $set: { status: "inactive" } }
        );

        const previousSubs = await subscriptions.countDocuments({ userId });

        await subscriptions.insertOne({
          userId,
          planId,
          planName,
          price: finalAmount,
          originalPrice,
          discount,
          status: "active",
          subscriptionDate: new Date(),
          paymentMethod: "bkash-demo",
          paymentStatus: "paid",
          technicianAssigned: false,
          isFirstTime: previousSubs === 0, 
        });
      }

      res.status(201).send({ success: true });
    });
    /* ======================
       Technician (ADMIN)
    ====================== */  
    app.post("/admin/technicians", verifyJWT, verifyAdmin, async (req, res) => {
      const { name, phone, area } = req.body;

      if (!name || !phone) {
        return res.status(400).send({ message: "Missing fields" });
      }

      const tech = {
        name,
        phone,
        area,
        available: true,
        createdAt: new Date(),
      };

      await db.collection("technicians").insertOne(tech);
      res.send({ success: true });
    });

    app.get("/admin/technicians", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await db
        .collection("technicians")
        .find()
        .toArray();

      res.send(result);
    });

    app.post(
      "/admin/assign-technician",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const { userId, technicianId, taskType, relatedId } = req.body;

        if (!userId || !technicianId || !taskType || !relatedId) {
          return res.status(400).send({ message: "Missing fields" });
        }

        // prevent duplicate active assignment
        const existing = await technicianAssignments.findOne({
          relatedId: new ObjectId(relatedId),
          taskType,
          status: { $in: ["assigned", "in-progress"] },
        });

        if (existing) {
          return res
            .status(409)
            .send({ message: "Technician already assigned" });
        }

        const assignment = {
          userId,
          technicianId: new ObjectId(technicianId),
          taskType, // installation | service
          relatedId: new ObjectId(relatedId),
          status: "assigned",
          scheduledDate: new Date(),
          createdAt: new Date(),
          completedAt: null,
        };

        await technicianAssignments.insertOne(assignment);

        // mark technician busy
        await technicians.updateOne(
          { _id: new ObjectId(technicianId) },
          { $set: { available: false } }
        );

        // update source record
        if (taskType === "installation") {
          await subscriptions.updateOne(
            { _id: new ObjectId(relatedId) },
            { $set: { technicianAssigned: true } }
          );
        }

        if (taskType === "service") {
          await supportRequests.updateOne(
            { _id: new ObjectId(relatedId) },
            { $set: { technicianAssigned: true } }
          );
        }

        res.send({ success: true });
      }
    );
    app.get("/my-technician/:userId", verifyJWT, async (req, res) => {
      const assignment = await technicianAssignments
        .aggregate([
          { $match: { userId: req.params.userId } },
          {
            $lookup: {
              from: "technicians",
              localField: "technicianId",
              foreignField: "_id",
              as: "technician",
            },
          },
          { $unwind: "$technician" },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ])
        .toArray();

      res.send(assignment[0] || null);
    });

    app.patch(
      "/admin/assignment/:id/complete",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const assignment = await technicianAssignments.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!assignment) {
          return res.status(404).send({ message: "Assignment not found" });
        }

        // 1️⃣ Mark assignment completed
        await technicianAssignments.updateOne(
          { _id: assignment._id },
          {
            $set: {
              status: "completed",
              completedAt: new Date(),
            },
          }
        );

        // 2️⃣ Free technician
        await technicians.updateOne(
          { _id: assignment.technicianId },
          { $set: { available: true } }
        );

        // 3️⃣ HANDLE INSTALLATION COMPLETION ✅
        if (assignment.taskType === "installation") {
          await subscriptions.updateOne(
            { _id: assignment.relatedId },
            {
              $set: {
                technicianAssigned: false,
                isFirstTime: false, 
              },
            }
          );
        }

        // 4️⃣ HANDLE SERVICE COMPLETION ✅
        if (assignment.taskType === "service") {
          await supportRequests.updateOne(
            { _id: assignment.relatedId },
            {
              $set: {
                technicianAssigned: false,
              },
            }
          );
        }

        res.send({ success: true });
      }
    );
    app.patch(
      "/admin/installation/:subscriptionId/complete",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const subscriptionId = new ObjectId(req.params.subscriptionId);

        const assignment = await technicianAssignments.findOne({
          relatedId: subscriptionId,
          taskType: "installation",
          status: { $ne: "completed" },
        });

        if (!assignment) {
          return res.status(404).send({ message: "Assignment not found" });
        }

        // mark assignment completed
        await technicianAssignments.updateOne(
          { _id: assignment._id },
          {
            $set: {
              status: "completed",
              completedAt: new Date(),
            },
          }
        );

        // free technician
        await technicians.updateOne(
          { _id: assignment.technicianId },
          { $set: { available: true } }
        );

        // update subscription
        await subscriptions.updateOne(
          { _id: subscriptionId },
          {
            $set: {
              technicianAssigned: false,
              isFirstTime: false,
            },
          }
        );

        res.send({ success: true });
      }
    );


    app.get("/admin/pending-tasks", verifyJWT, verifyAdmin, async (req, res) => {
      const tasks = [];

      /* ===== SERVICE TASKS ===== */
      const services = await supportRequests.find({
        status: { $ne: "solved" },
        technicianAssigned: { $ne: true },
      }).toArray();

      services.forEach(r => {
        tasks.push({
          taskType: "service",
          relatedId: r._id,
          userId: r.userId,
          name: r.name,
          issue: r.issueType,
        });
      });

      /* ===== INSTALLATION TASKS ===== */
      const installs = await subscriptions.find({
        isFirstTime: true,
        status: "active",
      }).toArray();

      for (const s of installs) {
        tasks.push({
          taskType: "installation",
          relatedId: s._id,
          userId: s.userId,
          plan: s.planName,
        });
      }

      res.send(tasks);
    });

    /* ======================
       service-feedback
    ====================== */ 
    app.post("/service-feedback", verifyJWT, async (req, res) => {
      const {
        supportRequestId,
        technicianId,
        satisfaction,
        feedbackText,
      } = req.body;

      if (!supportRequestId || !technicianId || !satisfaction) {
        return res.status(400).send({ message: "Missing fields" });
      }

      // Allow feedback ONLY after service is completed
      const assignment = await technicianAssignments.findOne({
        relatedId: new ObjectId(supportRequestId),
        taskType: "service",
        status: "completed",
      });

      if (!assignment) {
        return res.status(403).send({
          message: "Service not completed yet",
        });
      }

      // 🔐 ENSURE the feedback is given by the SAME USER who requested the service
      if (assignment.userId !== req.decoded.id) {
        return res.status(403).send({
          message: "You are not allowed to give feedback for this service",
        });
      }

      const allowed = ["satisfied", "neutral", "not_satisfied"];
      if (!allowed.includes(satisfaction)) {
        return res.status(400).send({ message: "Invalid satisfaction value" });
      }

      // 🔒 ONE FEEDBACK PER SERVICE
      const alreadyGiven = await serviceFeedbacks.findOne({
        supportRequestId: new ObjectId(supportRequestId),
        userId: req.decoded.id,
      });

      if (alreadyGiven) {
        return res.status(409).send({ message: "Feedback already submitted" });
      }

      const technician = await technicians.findOne({
        _id: new ObjectId(technicianId),
      });

      const user = await users.findOne({
        _id: new ObjectId(req.decoded.id),
      });

      const feedbackDoc = {
        userId: req.decoded.id,
        userName: user?.name || "Unknown",
        userLocation: user?.address || "N/A",

        technicianId: technician._id,
        technicianName: technician.name,

        supportRequestId: new ObjectId(supportRequestId),

        satisfaction,
        feedbackText: feedbackText || "",
        serviceCompletedAt: assignment.completedAt,

        createdAt: new Date(),
      };

      await serviceFeedbacks.insertOne(feedbackDoc);

      res.send({ success: true });
    });

    app.get("/service-feedback/check/:serviceId", verifyJWT, async (req, res) => {
      const exists = await serviceFeedbacks.findOne({
        supportRequestId: new ObjectId(req.params.serviceId),
        userId: req.decoded.id,
      });

      res.send({ exists: !!exists });
    });

    app.get(
      "/admin/service-feedback",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const result = await serviceFeedbacks
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        res.send(result);
      }
    );

    /* ======================
       PAYMENTS(ADMIN)
    ====================== */    
    app.get(
      "/admin/payments",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const result = await payments
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        res.send(result);
      }
    );

    app.patch(
      "/admin/payments/:id/approve",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const payment = await payments.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!payment) {
          return res.status(404).send({ message: "Payment not found" });
        }

        if (payment.paymentStatus === "paid") {
          return res.status(400).send({ message: "Already approved" });
        }

        // Mark payment as PAID
        await payments.updateOne(
          { _id: payment._id },
          {
            $set: {
              paymentStatus: "paid",
              verifiedAt: new Date(),
            },
          }
        );

        // Activate subscription
        await subscriptions.updateMany(
          { userId: payment.userId },
          { $set: { status: "inactive" } }
        );

        const previousSubs = await subscriptions.countDocuments({
          userId: payment.userId,
        });

        await subscriptions.insertOne({
          userId: payment.userId,
          planId: payment.planId,
          planName: payment.planName,
          price: payment.amount,
          status: "active",
          subscriptionDate: new Date(),
          paymentMethod: "cash",
          paymentStatus: "paid",

          // 🔑 REQUIRED FOR ASSIGN TECHNICIAN
          technicianAssigned: false,
          isFirstTime: previousSubs === 0,
        });

        res.send({ success: true });
      }
    );

    app.patch(
      "/admin/payments/:id/reject",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        await payments.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              paymentStatus: "rejected",
              verifiedAt: new Date(),
            },
          }
        );

        res.send({ success: true });
      }
    );
    /* ======================
       SUPPORT (USER)
    ====================== */
    app.post("/support-requests", async (req, res) => {
      const {
        userId,
        name,
        email,
        type,
        issueType,
        supportMessage,
        location,
      } = req.body;

      if (!userId || !type || !issueType) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      if (!supportMessage || supportMessage.trim() === "") {
        return res.status(400).send({ message: "Support message required" });
      }

      if (type === "service" && !location) {
        return res.status(400).send({ message: "Location required for service request" });
      }

      const doc = {
        userId: String(userId),
        name,
        email,
        type,
        issueType,
        supportMessage: supportMessage.trim(),
        location: location || null,
        status: "pending",
        createdAt: new Date(),
      };

      const result = await supportRequests.insertOne(doc);
      res.status(201).send(result);
    });

        app.get("/support-requests/user/:userId", async (req, res) => {
          const result = await supportRequests
            .find({ userId: String(req.params.userId) }) 
            .sort({ createdAt: -1 })
            .toArray();

          res.send(result);
        });

    /* ======================
       SUPPORT (ADMIN)
    ====================== */
    app.get("/support-requests", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await supportRequests.find().toArray();
      res.send(result);
    });

    app.put(
      "/support-requests/:id",
      verifyJWT,
      verifyAdmin,
      async (req, res) => {
        const { status, adminComments } = req.body;
        const requestId = req.params.id;

        // update support request
        await supportRequests.updateOne(
          { _id: new ObjectId(requestId) },
          {
            $set: {
              status,
              adminComments,
              lastUpdated: new Date(),
            },
          }
        );

        // 🔑 IF SOLVED → COMPLETE ASSIGNMENT (SERVICE + INSTALLATION)
        if (status === "solved") {
          const assignment = await technicianAssignments.findOne({
            relatedId: new ObjectId(requestId),
            status: { $ne: "completed" },
          });

          if (assignment) {
            // mark assignment completed
            await technicianAssignments.updateOne(
              { _id: assignment._id },
              {
                $set: {
                  status: "completed",
                  completedAt: new Date(),
                },
              }
            );

            // free technician
            await technicians.updateOne(
              { _id: assignment.technicianId },
              { $set: { available: true } }
            );

            // 🔧 installation cleanup
            if (assignment.taskType === "installation") {
              await subscriptions.updateOne(
                { _id: assignment.relatedId },
                {
                  $set: {
                    technicianAssigned: false,
                    isFirstTime: false,
                  },
                }
              );
            }

            // 🧰 service cleanup
            if (assignment.taskType === "service") {
              await supportRequests.updateOne(
                { _id: assignment.relatedId },
                { $set: { technicianAssigned: false } }
              );
            }
          }
        }

        res.send({ success: true });
      }
    );

    console.log("🚀 CityNet backend READY");
  } catch (err) {
    console.error(err);
  }
}

run();

/* ======================
   ROOT
====================== */
app.get("/", (req, res) => {
  res.send("CityNet API is running");
});

app.listen(port, () => {
  console.log(`🌐 Server running on port ${port}`);
});