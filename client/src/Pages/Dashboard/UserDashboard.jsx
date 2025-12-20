import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import EachPackage from "../Home/Packages/EachPackage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
     REVIEW
  ====================== */
  const handleReview = async () => {
    const { value } = await Swal.fire({
      title: "✨ Share Your Experience",
      background: "#111827",
      color: "#ffffff",
      html: `
        <textarea
          id="reviewText"
          placeholder="Write your experience..."
          style="width:100%;min-height:120px;padding:12px;border:2px solid #a855f7;background:#f3f4f6;color:#000"
        ></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit Review",
      preConfirm: () => {
        const message =
          document.getElementById("reviewText").value.trim();
        if (!message) {
          Swal.showValidationMessage("Review required");
        }
        return message;
      },
    });

    if (!value) return;

    try {
      await API.post("/reviews", {
        planId: activePlan.planId,
        planName: activePlan.planName,
        rating: 5,
        message: value,
        anonymous: true,
      });

      Swal.fire("Thank you!", "Review submitted", "success");
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
                    <p className="font-semibold mb-1">
                      Technician Details
                    </p>
                    <p>
                      <strong>Name:</strong>{" "}
                      {technician.technician?.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {technician.technician?.phone}
                    </p>
                    <p>
                      <strong>Area:</strong>{" "}
                      {technician.technician?.area}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400 mt-3">
                    The technician will contact you before visiting.
                  </p>
                </>
              ) : (
                <p className="text-gray-400">
                  No technician assigned yet.
                </p>
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
    </section>
  );
};

export default UserDashboard;