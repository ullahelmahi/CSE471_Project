import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [showAdmins, setShowAdmins] = useState(true);

  /* =========================
     FETCH USERS (ADMIN)
  ========================= */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/users");

      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================
     ROLE CHANGE
  ========================= */
  const handleRoleChange = async (email, role) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(`/admin/users/role/${email}`, { role });

      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  /* =========================
     STATUS CHANGE
  ========================= */
  const handleStatusChange = async (subscriptionId, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/subscription/${subscriptionId}/status`,
        { status }
      );

      toast.success("Plan status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* =========================
     DELETE USER (SAFE)
  ========================= */
  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Delete user?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/admin/users/${userId}`);

      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* =========================
     SPLIT USERS
  ========================= */
  const admins = users.filter(u => u.role === "admin");
  const normalUsers = users.filter(u => u.role === "user");

  /* =========================
     TABLE RENDER
  ========================= */
  const renderTable = (list, title) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-purple-400">
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Contact</th>
              <th>Plan</th>
              <th>Validity</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>

                <td>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>

                <td className="text-sm">
                  📞 {u.phone || "N/A"} <br />
                  📍 {u.address || "N/A"}
                </td>

                <td>{u.planName || "None"}</td>

                <td>
                  {u.validityLeft !== null
                    ? `${u.validityLeft} days`
                    : "—"}
                </td>

                <td className="text-sm">
                  {u.paymentMethod || "N/A"} <br />
                  {u.paymentStatus || "N/A"}
                </td>

                {/* STATUS */}
                <td>
                  {u.subscriptionId ? (
                    <select
                      className={`select select-xs ${
                        u.planStatus === "active"
                          ? "select-success"
                          : "select-error"
                      }`}
                      value={u.planStatus}
                      disabled={
                        u.planStatus === "active" && u.validityLeft > 0
                      }
                      title={
                        u.planStatus === "active" && u.validityLeft > 0
                          ? "Cannot deactivate before validity expires"
                          : ""
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          u.subscriptionId,
                          e.target.value
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    "—"
                  )}
                </td>

                {/* ROLE */}
                <td>
                  <select
                    className="select select-bordered select-xs"
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u.email, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* DELETE */}
                <td>
                  {!u.subscriptionId || u.planStatus === "inactive" ? (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No records found.
          </p>
        )}
      </div>
    </div>
  );

  /* =========================
     UI
  ========================= */
  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary">
        👥 Manage Users
      </h2>

      {/* USERS */}
      <button
        className="btn btn-sm btn-outline mb-3"
        onClick={() => setShowUsers(!showUsers)}
      >
        {showUsers ? "Hide Users" : "Show Users"}
      </button>

      {showUsers && renderTable(normalUsers, "👤 Users")}

      {/* ADMINS */}
      <button
        className="btn btn-sm btn-outline mb-3"
        onClick={() => setShowAdmins(!showAdmins)}
      >
        {showAdmins ? "Hide Admins" : "Show Admins"}
      </button>

      {showAdmins && renderTable(admins, "🛡️ Admins")}
    </section>
  );
};

export default ManageUsers;