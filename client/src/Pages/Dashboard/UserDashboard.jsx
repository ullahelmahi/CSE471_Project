import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import EachPackage from "../Home/Packages/EachPackage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showPlan, setShowPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===============================
  // AUTH GUARD
  // ===============================
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // ===============================
  // LOAD DASHBOARD DATA
  // ===============================
  useEffect(() => {
    if (!user?._id) return;

    const loadDashboard = async () => {
      try {
        const [subsRes, supportRes, packagesRes] = await Promise.all([
          API.get(`/subscriptions/${String(user._id)}`),
          API.get(`/support-requests/user/${String(user._id)}`),
          API.get(`/packages`)
        ]);

        setSubscriptions(Array.isArray(subsRes.data) ? subsRes.data : []);
        setSupportRequests(Array.isArray(supportRes.data) ? supportRes.data : []);
        setPackages(Array.isArray(packagesRes.data) ? packagesRes.data : []);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // ===============================
  // LOADING STATES
  // ===============================
  if (authLoading || loading) {
    return <div className="p-10 text-center">Loading dashboard…</div>;
  }

  if (!user) {
    return <div className="p-10 text-center">Redirecting…</div>;
  }

  // ===============================
  // ACTIVE SUBSCRIPTION
  // ===============================
    const activePlan = subscriptions
    .filter(s => s.status === "active")
    .sort(
        (a, b) =>
        new Date(b.subscriptionDate) - new Date(a.subscriptionDate)
    )[0];
  // Match subscription → real package from DB
  const planDetails = activePlan
    ? packages.find(
        p =>
          String(p._id) === String(activePlan.planId) ||
          String(p.planId) === String(activePlan.planId)
      )
    : null;

  // ===============================
  // REAL VALIDITY CALCULATION
  // ===============================
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

  // ===============================
  // REVIEW HANDLER
  // ===============================
  const handleReview = async () => {
    const { value: form } = await Swal.fire({
      title: "Leave a Review",
      html: `
        <textarea id="reviewText" class="swal2-textarea" placeholder="Write your review"></textarea>
        <select id="rating" class="swal2-select">
          <option value="">Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★</option>
          <option value="3">★★★</option>
          <option value="2">★★</option>
          <option value="1">★</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const review = document.getElementById("reviewText").value;
        const rating = document.getElementById("rating").value;
        if (!review || !rating) {
          Swal.showValidationMessage("Both review and rating are required");
        }
        return { review, rating };
      },
      showCancelButton: true
    });

    if (!form) return;

    try {
      await API.post("/reviews", {
        userId: user._id,
        name: user.name,
        message: form.review,
        rating: Number(form.rating),
        createdAt: new Date()
      });

      Swal.fire("Thank you!", "Your review was submitted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit review.", "error");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <section className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      {/* ================= SUBSCRIPTION ================= */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Current Subscription</h2>

          {activePlan && planDetails ? (
            <>
              <p><strong>Plan:</strong> {planDetails.name}</p>
              <p><strong>Price:</strong> ৳{planDetails.price}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-success">Active</span>
              </p>

              <p>
                <strong>Days Left:</strong>{" "}
                <span className="badge badge-info">{daysLeft} days</span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowPlan(!showPlan)}
                >
                  {showPlan ? "Hide Plan Details" : "View Plan Details"}
                </button>

                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleReview}
                >
                  Leave Review
                </button>
              </div>

              {showPlan && (
                <div className="mt-6">
                  <EachPackage item={planDetails} onSelect={() => {}} />
                </div>
              )}
            </>
          ) : (
            <p className="text-warning">No active subscription found.</p>
          )}
        </div>
      </div>

      {/* ================= SUPPORT REQUESTS ================= */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Support Requests</h2>

          {supportRequests.length === 0 ? (
            <p>No support requests submitted.</p>
          ) : (
            <div className="space-y-4">
              {supportRequests.map(req => (
                <div
                  key={req._id}
                  className="border rounded p-4 bg-base-100"
                >
                  <p><strong>Type:</strong> {req.type}</p>
                  <p><strong>Message:</strong> {req.supportMessage}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge badge-outline">
                      {req.status}
                    </span>
                  </p>

                  {req.adminComments && (
                    <div className="mt-3 p-3 bg-green-100 border-l-4 border-green-600 text-gray-900 rounded">
                      <strong className="block mb-1">Admin Reply:</strong>
                      <p className="text-sm">{req.adminComments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;