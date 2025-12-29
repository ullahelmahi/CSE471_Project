import { useEffect, useState } from "react";
import API from "../../services/api";

const AdminServiceFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    API.get("/admin/service-feedback").then(res => {
      setFeedbacks(res.data || []);
    });
  }, []);

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📝 Service Feedback</h2>

      <div className="space-y-4">
        {feedbacks.map(f => (
          <div
            key={f._id}
            className={`p-4 rounded-xl shadow border-l-4 ${
              f.satisfaction === "satisfied"
                ? "border-green-500"
                : f.satisfaction === "neutral"
                ? "border-gray-400"
                : "border-red-500"
            }`}
          >
            <h3 className="font-semibold">{f.userName}</h3>
            <p className="text-sm text-gray-500">{f.userLocation}</p>

            <p className="mt-1">
              <strong>Technician:</strong> {f.technicianName}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(f.createdAt).toLocaleString()}
            </p>

            <p className="mt-2">{f.feedbackText || "No written feedback"}</p>

            <span
              className={`badge mt-2 ${
                f.satisfaction === "satisfied"
                  ? "badge-success"
                  : f.satisfaction === "neutral"
                  ? "badge-neutral"
                  : "badge-error"
              }`}
            >
              {f.satisfaction.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminServiceFeedback;