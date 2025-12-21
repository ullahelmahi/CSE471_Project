import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LocationViewer from "./LocationViewer";
import Swal from "sweetalert2";
import API from "../../services/api";

const STATUS_ORDER = {
  pending: 1,
  "in-progress": 2,
  solved: 3,
};

const AdminSupportManager = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [adminMessages, setAdminMessages] = useState({});
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH SUPPORT + INSTALLATION
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [supportRes, taskRes, usersRes] = await Promise.all([
          API.get("/support-requests"),
          API.get("/admin/pending-tasks"),
          API.get("/admin/users"),
        ]);

        const supportList = Array.isArray(supportRes.data)
          ? supportRes.data
          : [];
        const taskList = Array.isArray(taskRes.data)
          ? taskRes.data
          : [];
        const usersList = Array.isArray(usersRes.data)
          ? usersRes.data
          : [];

        const userMap = {};
        usersList.forEach(u => {
          userMap[u._id] = u;
        });

        const installationAsSupport = taskList
          .filter(t => t.taskType === "installation")
          .map(t => {
            const user = userMap[t.userId] || {};
            return {
              _id: t.relatedId,
              userId: t.userId,
              name: user.name || "Unknown",
              email: user.email || "N/A",
              phone: user.phone || "N/A",
              location: user.location || null,
              type: "installation",
              supportMessage: `Plan: ${t.plan}`,
              status: "pending",
              technicianAssigned: false,
              isVirtual: true,
            };
          });

        const merged = [...installationAsSupport, ...supportList];

        merged.sort(
          (a, b) =>
            STATUS_ORDER[a.status || "pending"] -
            STATUS_ORDER[b.status || "pending"]
        );

        setRequests(merged);

        const statusMap = {};
        const messageMap = {};
        merged.forEach(req => {
          statusMap[req._id] = req.status || "pending";
          messageMap[req._id] = req.adminComments || "";
        });

        setStatusUpdates(statusMap);
        setAdminMessages(messageMap);
      } catch {
        toast.error("Failed to load support requests");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleStatusChange = (id, value) => {
    setStatusUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleMessageChange = (id, value) => {
    setAdminMessages(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (req) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    const newStatus = statusUpdates[req._id];
    const adminComments =
      newStatus === "solved" ? adminMessages[req._id] : "";

    if (newStatus === "solved" && req.technicianAssigned) {
      const result = await Swal.fire({
        title: "Confirm Completion",
        text:
          "This will mark the task as solved and free the technician. Continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, mark as solved",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;
    }

    try {
      const res = await API.put(`/support-requests/${req._id}`, {
        status: newStatus,
        adminComments,
      });

      if (!res.ok) throw new Error();

      setRequests(prev =>
        prev.map(r =>
          r._id === req._id
            ? { ...r, status: newStatus, adminComments }
            : r
        )
      );

      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <div className="p-6 text-center">Loading support requests…</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Admin Support Manager
      </h2>

      {requests.length === 0 ? (
        <p>No support requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map(req => {
            const currentStatus = statusUpdates[req._id];
            const isFinalized = req.status === "solved";

            return (
              <div key={req._id} className="p-6 rounded-xl shadow bg-base-200">
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Email:</strong> {req.email}</p>
                {req.phone && <p><strong>Phone:</strong> {req.phone}</p>}

                <p className="mt-1">
                  <strong>Type:</strong>{" "}
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded font-semibold ${
                      req.type === "installation"
                        ? "bg-blue-600 text-white"
                        : req.type === "service"
                        ? "bg-yellow-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {req.type.toUpperCase()}
                  </span>
                </p>
                {/* ISSUE TYPE */}
                {req.issueType && (
                  <p className="mt-1">
                    <strong>Issue Type:</strong>{" "}
                    <span className="badge badge-info ml-2">
                      {req.issueType}
                    </span>
                  </p>
                )}

                {req.technicianAssigned && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-600 text-white">
                    Technician Assigned
                  </span>
                )}

                <p className="mt-2">
                  <strong>Message:</strong> {req.supportMessage}
                </p>

                {req.location && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Customer Location</p>
                    <LocationViewer location={req.location} />
                  </div>
                )}

                {/* STATUS */}
                {(req.type === "service" || req.type === "complaint") && (
                  <div className="mt-4">
                    <label className="font-semibold block mb-1">Status</label>
                    <select
                      value={currentStatus}
                      disabled={isFinalized}
                      onChange={e =>
                        handleStatusChange(req._id, e.target.value)
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="solved">Solved</option>
                    </select>
                  </div>
                )}

                {/* ADMIN MESSAGE (SERVICE ONLY) */}
                {currentStatus === "solved" &&
                  !isFinalized &&
                  req.type === "service" && (
                    <textarea
                      rows={3}
                      className="textarea textarea-bordered w-full mt-4"
                      placeholder="Admin reply..."
                      value={adminMessages[req._id]}
                      onChange={e =>
                        handleMessageChange(req._id, e.target.value)
                      }
                    />
                  )}

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 mt-4">
                  {(req.type === "service" || req.type === "complaint") && (
                    <button
                      onClick={() => handleUpdate(req)}
                      disabled={isFinalized}
                      className={`btn btn-sm ${
                        isFinalized
                          ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                          : currentStatus === "solved"
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                    >
                      {isFinalized ? "Done" : "Update"}
                    </button>
                  )}

                  {/* ASSIGN TECHNICIAN */}
                    {req.type !== "complaint" && req.status !== "solved" && (
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() =>
                          navigate("/admin/assign-technician", {
                            state: {
                              taskType:
                                req.type === "installation"
                                  ? "installation"
                                  : "service",
                              relatedId: req._id,
                              userId: req.userId,
                            },
                          })
                        }
                      >
                        Assign Technician
                      </button>
                    )}
                  {/* INSTALLATION ONLY */}
                  {req.type === "installation" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={async () => {
                        const confirm = await Swal.fire({
                          title: "Complete Installation?",
                          text: "This will mark installation as completed and free the technician.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, complete",
                        });

                        if (!confirm.isConfirmed) return;

                        try {
                          const token = localStorage.getItem("token");

                          const res = await API.patch(`/admin/installation/${req._id}/complete`, {
                            relatedId: req._id,
                            taskType: "installation",
                          });

                          if (!res.ok) throw new Error();

                          toast.success("Installation marked complete");

                          // optional UI refresh
                          setRequests(prev =>
                            prev.filter(r => r._id !== req._id)
                          );
                        } catch {
                          toast.error("Failed to complete installation");
                        }
                      }}
                    >
                      Mark Installation Complete
                    </button>
                  )}



                </div>


              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSupportManager;