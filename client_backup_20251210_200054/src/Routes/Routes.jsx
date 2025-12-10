import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import Home from "../Pages/Home/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Service from "../Pages/Home/Service/Service";
import Packages from "../Pages/Home/Packages/Packages";
import FTP from "../Pages/FTP/Ftp";
import Reviews from "../Pages/Home/Reviews/Reviews";

/* Auth Pages */
import LogIn from "../Pages/Registration/LogIn/LogIn";
import SignUp from "../Pages/Registration/SignUp/SignUp";

/* Newly added pages */
import TechnicianSchedule from "../Pages/TechnicianSchedule";
import SubscriptionPage from "../Pages/SubscriptionPage";

/* Private route wrapper */
import PrivateRoutes from "./PrivateRoutes";

/* Fallback Not Found */
const NotFound = () => (
  <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
    <h1>404 — Page Not Found</h1>
    <a href="/" style={{ color: "#4da6ff" }}>Go back home</a>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/service" element={<Service />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/ftp" element={<FTP />} />
      <Route path="/reviews" element={<Reviews />} />

      {/* Auth */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* Module 1 & 2 */}
      <Route path="/schedule" element={<PrivateRoutes><TechnicianSchedule /></PrivateRoutes>} />
      <Route path="/subscription" element={<PrivateRoutes><SubscriptionPage /></PrivateRoutes>} />

      {/* Redirect common aliases */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}