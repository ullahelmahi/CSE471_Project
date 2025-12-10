// AdminDashboard.jsx (Main Layout Page for Admin)
import { Link, Outlet } from "react-router-dom";
import { use, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const AdminDashboard = () => {
    const { user, logOut } = useContext(AuthContext);
    const [adminUser, setAdminUser] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/users/${user?.email}`)
            .then(response => response.json())
            .then(data => setAdminUser(data))
            .catch(error => console.log(error));
    }, [user?.email]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                // Logged out
            })
            .catch(error => console.log(error));
    };



    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <nav className="bg-base-100 shadow flex justify-between items-center px-8 py-4">
                <Link to="/admin" className="text-2xl font-bold text-primary">CityNet</Link>

                {/* Center navigation links */}
                <div className="flex gap-6">
                    <Link to="/admin/manage-users" className="btn btn-sm btn-ghost">Manage Users</Link>
                    <Link to="/admin/support-status" className="btn btn-sm btn-ghost">Support Status</Link>
                    <Link to="/admin/manage-packages" className="btn btn-sm btn-ghost">Manage Packages</Link>
                    <Link to="/admin/manage-subscriptions" className="btn btn-sm btn-ghost">Manage Subscriptions</Link>
                </div>

                {/* Admin Info */}
                <div className="text-right">
                    <p className="font-semibold">{adminUser.name || "Admin"}</p>
                    <span className="badge badge-secondary text-xs">Admin</span>
                </div>

                {/* Sign Out Button */}
                <div>
                    <button onClick={handleLogOut} className="btn btn-sm btn-primary ml-4">Sign Out</button>
                </div>

            </nav>

            {/* Dynamic content */}
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <p className="mb-6">Welcome to the admin dashboard. Here you can manage users, view support requests, and manage packages.</p>

                {/* Outlet for nested routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
