import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';  // <-- NEW

const NavBar = () => {
    const { user, logout } = useContext(AuthContext);

    const navOptions = (
        <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/service">Services</Link></li>
            <li><Link to="/packages">Packages</Link></li>
            <li><Link to="/ftp">FTP</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/support">Support</Link></li>
        </>
    );

    return (
        <div className="navbar bg-base-200 fixed top-0 left-0 w-full z-50 shadow-md py-4 px-4 md:px-8 rounded-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {navOptions}
                    </ul>
                </div>
                <span className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">CityNet</span>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navOptions}
                </ul>
            </div>

            <div className="navbar-end">
                {/* 🔥 NEW login/logout logic */}
                {!user ? (
                    <>
                        <Link to="/login" className="btn btn-primary mr-2">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-outline">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="mr-3 font-semibold">{user.name || user.email}</span>
                        <Link to="/dashboard" className="btn btn-outline mr-2">Dashboard</Link>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;