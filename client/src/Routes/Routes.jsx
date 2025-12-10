import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainOutlet from "../Layout/Mainoutlet";
import Home from "../Pages/Home/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Notice from "../Pages/Notice/Notice";
import Support from "../Pages/Support/Support";

// Auth pages
import LogIn from "../Pages/Registration/LogIn/LogIn";
import SignUp from "../Pages/Registration/SignUp/SignUp";

// Module-3 flag
const ENABLE_MODULE3 = (import.meta.env.VITE_ENABLE_MODULE3 === 'true');

let children = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <AboutUs /> },
  { path: "/notice", element: <Notice /> },
  { path: "/support", element: <Support /> },

  // AUTH
  { path: "/login", element: <LogIn /> },
  { path: "/signup", element: <SignUp /> },
];

// 🔥 SERVICES REMOVED
// 🔥 FTP REMOVED
// You still have the files, but users cannot visit them.

// Add Module 3 pages only if enabled
if (ENABLE_MODULE3) {
  // Add module-3 routes here if needed
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainOutlet />,
    children
  }
]);
