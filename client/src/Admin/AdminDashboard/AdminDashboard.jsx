import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "btn btn-primary btn-sm w-full"
      : "btn btn-outline btn-sm w-full";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="bg-base-200 p-4 space-y-3 md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <NavLink to="/admin/manage-users" className={linkClass}>
          Manage Users
        </NavLink>

        <NavLink to="/admin/manage-packages" className={linkClass}>
          Manage Packages
        </NavLink>

        <NavLink to="/admin/support-status" className={linkClass}>
          Support Requests
        </NavLink>

        <NavLink to="/admin/payments" className={linkClass}>
          Payments
        </NavLink>

        <NavLink to="/admin/assign-technician" className={linkClass}>
          Assign Technician
        </NavLink>

        <NavLink to="/admin/service-feedback" className={({ isActive }) => `btn w-full ${isActive ? "btn-primary" : "btn-outline"}`}>
          Service Feedback
        </NavLink>

        
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="md:col-span-4 p-6 bg-base-100">
        {/* 👇 THIS IS THE MOST IMPORTANT LINE */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;