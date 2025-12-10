import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/users");
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (email, newRole) => {
        try {
            await axios.patch(`http://localhost:5000/admin/users/role/${email}`, { role: newRole });
            toast.success("Role updated");
            fetchUsers();
        } catch {
            toast.error("Role update failed");
        }
    };

    const handleDelete = async (email) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/admin/users/${email}`);
            toast.success("User deleted");
            fetchUsers();
        } catch {
            toast.error("Deletion failed");
        }
    };

    return (
        <section className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-primary">👥 Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="table w-full bg-base-100">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>userId</th>
                            <th>phone</th>
                            <th>Provider</th>
                            <th>Created</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={user.email}>
                                <td>{idx + 1}</td>
                                <td>{user.name || "N/A"}</td>
                                <td>{user.email}</td>
                                <td>{user.userId}</td>
                                <td>{user.phone || "N/A"}</td>
                                <td>{user.authProvider}</td>
                                <td>{user.address || "N/A"}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        className="select select-bordered select-sm"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(user.email)} className="btn btn-error btn-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ManageUsers;
