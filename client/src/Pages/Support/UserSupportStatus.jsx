import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const UserSupportStatus = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    async function loadRequests() {
      try {
        const res = await API.get(
          `/support-requests/user/${user._id}`
        );
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch support requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading support requests…
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Your Support Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">
          You have not submitted any support requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border rounded-lg p-4 shadow bg-base-100"
            >
              <p>
                <strong>Type:</strong> {req.type}
              </p>

              {req.issueType && (
                <p>
                  <strong>Issue:</strong> {req.issueType}
                </p>
              )}

              <p>
                <strong>Message:</strong> {req.supportMessage}
              </p>

              <p className="mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ml-2 ${
                    req.status === "solved"
                      ? "badge-success"
                      : req.status === "in-progress"
                      ? "badge-info"
                      : "badge-warning"
                  }`}
                >
                  {req.status}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Submitted on{" "}
                {req.createdAt
                  ? new Date(req.createdAt).toLocaleString()
                  : "—"}
              </p>

              {/* Admin Reply */}
              {req.adminComments && (
                <div className="mt-3 p-3 bg-green-100 border-l-4 border-green-600 rounded text-gray-900">
                  <strong className="block mb-1">
                    Admin Reply:
                  </strong>
                  <p className="text-sm">
                    {req.adminComments}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSupportStatus;