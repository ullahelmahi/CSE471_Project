import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import EachPackage from "../Home/Packages/EachPackage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ServiceFeedbackModal from "./ServiceFeedbackModal";

const UserDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ======================
     STATE
  ====================== */
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [technician, setTechnician] = useState(null);

  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [serviceFeedbackGiven, setServiceFeedbackGiven] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // 🔽 HIDE / SHOW STATES
  const [showSubscription, setShowSubscription] = useState(true);
  const [showTechnician, setShowTechnician] = useState(true);
  const [showSupport, setShowSupport] = useState(true);
  const [showPlan, setShowPlan] = useState(false);

  /* ======================
     AUTH GUARD
  ====================== */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  /* ======================
     LOAD DASHBOARD DATA
  ====================== */
  useEffect(() => {
    if (!user?._id) return;

    const loadData = async () => {
      try {
        const [subsRes, pkgRes, supportRes, reviewRes, techRes] =
          await Promise.all([
            API.get(`/subscriptions/${user._id}`),
            API.get("/packages"),
            API.get(`/support-requests/user/${user._id}`),
            API.get("/reviews"),
            API.get(`/my-technician/${user._id}`).catch(() => null),
          ]);

        setSubscriptions(subsRes.data || []);
        setPackages(pkgRes.data || []);
        setSupportRequests(supportRes.data || []);
        setTechnician(techRes?.data || null);
        // 🔍 Check feedback only for SERVICE tasks
        if (techRes?.data && techRes.data.taskType === "service") {
          try {
            const feedbackCheck = await API.get(
              `/service-feedback/check/${techRes.data.relatedId}`
            );
            setServiceFeedbackGiven(feedbackCheck.data.exists);
          } catch {
            setServiceFeedbackGiven(false);
          }
        } else {
          setServiceFeedbackGiven(false);
        }

        const active = subsRes.data.find((s) => s.status === "active");
        const reviewed = reviewRes.data.some(
          (r) => r.userId === user._id && r.planId === active?.planId
        );
        setHasReviewed(reviewed);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-10 text-center">Loading dashboard…</div>;
  }

  /* ======================
     ACTIVE PLAN
  ====================== */
  const activePlan = subscriptions
    .filter((s) => s.status === "active")
    .sort(
      (a, b) =>
        new Date(b.subscriptionDate) - new Date(a.subscriptionDate)
    )[0];

  const planDetails = activePlan
    ? packages.find((p) => p.planId === activePlan.planId)
    : null;

  const daysLeft =
    activePlan && planDetails
      ? Math.max(
          0,
          Math.ceil(
            (
              new Date(activePlan.subscriptionDate).getTime() +
              planDetails.validityDays * 24 * 60 * 60 * 1000 -
              Date.now()
            ) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  /* ======================
    REVIEW (PLAN ONLY)
  ====================== */
  const handleReview = async () => {
    const { value } = await Swal.fire({
      title: "✨ Share Your Experience",
      background: "#111827",
      color: "#ffffff",

      html: `
        <!-- STAR RATING -->
        <div style="text-align:center;margin-bottom:12px;">
          <div id="starRating" style="font-size:26px;cursor:pointer;">
            ${[1,2,3,4,5]
              .map(
                n =>
                  `<span data-value="${n}" style="color:#9ca3af;margin:0 4px;">★</span>`
              )
              .join("")}
          </div>
        </div>

        <!-- REVIEW TEXT -->
        <textarea
          id="reviewText"
          placeholder="Write your experience..."
          style="
            width:100%;
            min-height:120px;
            padding:12px;
            border:2px solid #6366f1;
            background:#f3f4f6;
            color:#000;
            border-radius:8px;
            margin-bottom:12px;
          "
        ></textarea>

        <!-- ANONYMOUS TOGGLE -->
        <label style="display:flex;align-items:center;gap:8px;font-size:14px;">
          <input type="checkbox" id="anonymousToggle" checked />
          Submit as Anonymous
        </label>
      `,

      showCancelButton: true,
      confirmButtonText: "Submit Review",

      didOpen: () => {
        let selectedRating = 0;
        const stars = document.querySelectorAll("#starRating span");

        stars.forEach(star => {
          star.addEventListener("click", () => {
            selectedRating = Number(star.dataset.value);
            stars.forEach(s => {
              s.style.color =
                Number(s.dataset.value) <= selectedRating
                  ? "#facc15"
                  : "#9ca3af";
            });
            document.getElementById("starRating").dataset.rating =
              selectedRating;
          });
        });
      },

      preConfirm: () => {
        const rating = Number(
          document.getElementById("starRating").dataset.rating || 0
        );
        const message = document.getElementById("reviewText").value.trim();
        const anonymous =
          document.getElementById("anonymousToggle").checked;

        if (!rating) {
          Swal.showValidationMessage("Please select a star rating");
          return;
        }

        if (!message) {
          Swal.showValidationMessage("Review message is required");
          return;
        }

        return { rating, message, anonymous };
      },
    });

    if (!value) return;

    try {
      await API.post("/reviews", {
        planId: activePlan.planId,
        planName: activePlan.planName,
        rating: value.rating,
        message: value.message,
        anonymous: value.anonymous,
        userName: user.name, // ✅ AUTO FROM AUTH CONTEXT
      });

      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Thanks for sharing your valuable review.",
        confirmButtonColor: "#6366f1",
      });

      setHasReviewed(true);
    } catch (err) {
      Swal.fire("Error", "Failed to submit review", "error");
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      {/* ======================
         SUBSCRIPTION
      ====================== */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Current Subscription</h2>
            <button
              className="btn btn-xs btn-outline"
              onClick={() =>
                setShowSubscription(!showSubscription)
              }
            >
              {showSubscription ? "Hide" : "Show"}
            </button>
          </div>

          {showSubscription && (
            <>
              {activePlan && planDetails ? (
                <>
                  <p>
                    <strong>Plan:</strong> {planDetails.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ৳{planDetails.price}
                  </p>
                  <p>
                    <strong>Days Left:</strong> {daysLeft}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setShowPlan(!showPlan)}
                    >
                      {showPlan ? "Hide Plan" : "View Plan"}
                    </button>

                    {!hasReviewed && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleReview}
                      >
                        Leave Review
                      </button>
                    )}
                    {hasReviewed && (
                      <span className="badge badge-success">
                        Review Submitted
                      </span>
                    )}
                  </div>

                  {showPlan && (
                    <div className="mt-6">
                      <EachPackage
                        item={planDetails}
                        onSelect={() => {}}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-warning">
                  No active subscription
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ======================
        TECHNICIAN
      ====================== */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">👨‍🔧 Technician Assigned</h2>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => setShowTechnician(!showTechnician)}
            >
              {showTechnician ? "Hide" : "Show"}
            </button>
          </div>

          {showTechnician && (
            <>
              {technician ? (
                <>
                  <p>
                    <strong>Task:</strong>{" "}
                    {technician.taskType === "installation"
                      ? "Internet Installation"
                      : "Service Support"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge badge-warning ml-2">
                      {technician.status}
                    </span>
                  </p>

                  <div className="mt-3 p-3 bg-base-100 rounded">
                    <p className="font-semibold mb-1">Technician Details</p>
                    <p>
                      <strong>Name:</strong>{" "}
                      {technician.technician?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {technician.technician?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Area:</strong>{" "}
                      {technician.technician?.area || "N/A"}
                    </p>
                  </div>

                  {/* SERVICE FEEDBACK BUTTON */}
                  {technician.taskType === "service" &&
                    technician.status === "completed" &&
                    !serviceFeedbackGiven && (
                      <button
                        className="btn btn-sm btn-primary mt-4"
                        onClick={() => setShowFeedbackModal(true)}
                      >
                        Give Feedback
                      </button>
                    )}

                  {serviceFeedbackGiven &&
                    technician.taskType === "service" && (
                      <span className="badge badge-success mt-4">
                        Feedback Submitted
                      </span>
                    )}
                </>
              ) : (
                <p className="text-gray-400">No technician assigned yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ======================
         SUPPORT
      ====================== */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Support Requests</h2>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => setShowSupport(!showSupport)}
            >
              {showSupport ? "Hide" : "Show"}
            </button>
          </div>

          {showSupport && (
            <>
              {supportRequests.length === 0 ? (
                <p>No support requests.</p>
              ) : (
                supportRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-3 border rounded bg-base-100 mt-2"
                  >
                    <p>
                      <strong>Type:</strong> {req.type}
                    </p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>
                    <p>{req.supportMessage}</p>

                    {req.adminComments && (
                      <div className="mt-2 bg-green-100 p-2 rounded text-gray-900">
                        <strong>Admin:</strong>{" "}
                        {req.adminComments}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    {showFeedbackModal &&
      technician?.relatedId &&
      technician?.technician?._id && (
        <ServiceFeedbackModal
          service={{
            _id: technician.relatedId,
            technicianId: technician.technician._id,
          }}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={() => {
            setServiceFeedbackGiven(true);
            setShowFeedbackModal(false);
          }}
        />
    )}
    </section>
  );
};

export default UserDashboard;