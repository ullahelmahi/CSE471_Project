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

  /* ======================
     NAV LINKS (REUSED)
  ====================== */
  const navLinks = (
    <>
      <li><NavLink to="/" className={navClass}>Home</NavLink></li>
      <li><NavLink to="/about" className={navClass}>About Us</NavLink></li>
      <li><NavLink to="/packages" className={navClass}>Packages</NavLink></li>
      <li><NavLink to="/reviews" className={navClass}>Reviews</NavLink></li>
      <li><NavLink to="/ftp" className={navClass}>FTP</NavLink></li>
      <li><NavLink to="/notice" className={navClass}>Notice</NavLink></li>
      {user?.role !== "admin" && (
        <li><NavLink to="/support" className={navClass}>Support</NavLink></li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow px-4 md:px-6 sticky top-0 z-50">

      {/* LEFT */}
      <div className="navbar-start">
        {/* MOBILE MENU */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            {/* Hamburger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          {/* MOBILE DROPDOWN */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-56"
          >
            {navLinks}

            {/* MOBILE AUTH */}
            {!user && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}

            {user && (
              <>
                {user.role === "user" && (
                  <li>
                    <button onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </button>
                  </li>
                )}

                {user.role === "admin" && (
                  <li>
                    <Link to="/admin">Admin Dashboard</Link>
                  </li>
                )}

                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-primary ml-2">
          CityNet
        </Link>
      </div>

      {/* CENTER – DESKTOP ONLY */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-6">
          {navLinks}
        </ul>
      </div>

      {/* RIGHT – DESKTOP AUTH */}
      <div className="navbar-end gap-3 hidden lg:flex">
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
            {user.role === "user" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-ghost btn-sm"
              >
                {user.name || "My Dashboard"}
              </button>
            )}

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