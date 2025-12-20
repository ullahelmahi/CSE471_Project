import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";

const AdminAssignTechnician = () => {
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD TASKS + TECHNICIANS
  ====================== */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [taskRes, techRes] = await Promise.all([
        API.get("/admin/pending-tasks"),
        API.get("/admin/technicians"),
      ]);

      setTasks(taskRes.data || []);
      setTechnicians(techRes.data.filter(t => t.available));
    } catch {
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     ASSIGN TECHNICIAN
  ====================== */
  const assign = async (task, technicianId) => {
    try {
      await API.post("/admin/assign-technician", {
        userId: task.userId,
        technicianId,
        taskType: task.taskType,
        relatedId: task.relatedId,
      });

      Swal.fire("Assigned", "Technician assigned successfully", "success");
      loadData();
    } catch (err) {
      Swal.fire(
        "Failed",
        err.response?.data?.message || "Assignment failed",
        "error"
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading tasks…</div>;
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🛠️ Assign Technicians</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-400">No pending tasks.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="bg-base-200 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">
                    {task.taskType === "service"
                      ? `Service Request – ${task.name}`
                      : `Installation – ${task.plan}`}
                  </p>

                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      task.taskType === "installation"
                        ? "bg-blue-600 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {task.taskType === "installation" ? "INSTALLATION" : "SERVICE"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  User ID: {task.userId}
                </p>
              </div>

              <select
                className="select select-bordered select-sm"
                defaultValue=""
                onChange={(e) => assign(task, e.target.value)}
              >
                <option value="" disabled>
                  Select Technician
                </option>
                {technicians.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.area})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminAssignTechnician;