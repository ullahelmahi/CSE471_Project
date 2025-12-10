const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Payment = require("../models/Payment");
const Package = require("../models/Package"); // <-- added in Step 9


// =============================
// USER MANAGEMENT ROUTES
// =============================

// Get all pending users
router.get("/users/pending", async (req, res) => {
  const users = await User.find({ status: "pending" });
  res.json(users);
});

// Verify user
router.put("/users/:id/verify", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "active" });
  res.json({ message: "User verified successfully" });
});

// Suspend user
router.put("/users/:id/suspend", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "suspended" });
  res.json({ message: "User suspended" });
});

// Reactivate user
router.put("/users/:id/reactivate", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "active" });
  res.json({ message: "User reactivated" });
});


// =============================
// PAYMENT HISTORY ROUTES
// =============================

// Get all payments
router.get("/payments", async (req, res) => {
  const payments = await Payment.find()
    .populate("userId", "name email")
    .populate("packageId", "name price");

  res.json(payments);
});

// Get payments for a specific user
router.get("/payments/user/:userId", async (req, res) => {
  const payments = await Payment.find({ userId: req.params.userId })
    .populate("packageId", "name price");

  res.json(payments);
});


// =============================
// PACKAGE MANAGEMENT ROUTES
// =============================

// Add a new package
router.post("/packages", async (req, res) => {
  const newPackage = await Package.create(req.body);
  res.json(newPackage);
});

// Update a package
router.put("/packages/:id", async (req, res) => {
  const updatedPackage = await Package.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedPackage);
});

// Soft delete a package
router.delete("/packages/:id", async (req, res) => {
  await Package.findByIdAndUpdate(req.params.id, { status: "deleted" });
  res.json({ message: "Package deleted" });
});

// Get all active packages
router.get("/packages", async (req, res) => {
  const packages = await Package.find({ status: "active" });
  res.json(packages);
});


module.exports = router;
