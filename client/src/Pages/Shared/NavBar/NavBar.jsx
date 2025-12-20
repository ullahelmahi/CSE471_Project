import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "hover:text-primary";

  return (
    <div className="navbar bg-base-100 shadow px-6">
      {/* LEFT */}
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-primary">
          CityNet
        </Link>
      </div>

      {/* CENTER – RESTORED PUBLIC NAV */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6">
          <li><NavLink to="/" className={navClass}>Home</NavLink></li>
          <li><NavLink to="/about" className={navClass}>About Us</NavLink></li>
          <li><NavLink to="/packages" className={navClass}>Packages</NavLink></li>
          <li><NavLink to="/reviews" className={navClass}>Reviews</NavLink></li>
          <li><NavLink to="/ftp" className={navClass}>FTP</NavLink></li>
          <li><NavLink to="/notice" className={navClass}>Notice</NavLink></li>
          {user?.role !== "admin" && (
              <li><Link to="/support">Support</Link></li>
            )}
        </ul>
      </div>

      {/* RIGHT – AUTH & DASHBOARD */}
      <div className="navbar-end gap-3">
        {!user && (
          <>
            <Link to="/login" className="btn btn-outline btn-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {/* USER → USER DASHBOARD */}
            {user.role === "user" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-ghost btn-sm"
              >
                {user.name || "My Dashboard"}
              </button>
            )}

            {/* ADMIN → ADMIN DASHBOARD */}
            {user.role === "admin" && (
              <Link to="/admin" className="btn btn-secondary btn-sm">
                Admin Dashboard
              </Link>
            )}

            <button onClick={handleLogout} className="btn btn-error btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;