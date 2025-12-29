import { createBrowserRouter } from "react-router-dom";
import MainOutlet from "../Layout/MainOutlet";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoute from "./AdminRoute";

/* PUBLIC PAGES */
import Home from "../Pages/Home/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Packages from "../Pages/Home/Packages/Packages";
import Reviews from "../Pages/Home/Reviews/Reviews";
import Ftp from "../Pages/FTP/Ftp";
import Notice from "../Pages/Notice/Notice";
import Support from "../Pages/Support/Support";

/* AUTH */
import LogIn from "../Pages/Registration/LogIn/LogIn";
import SignUp from "../Pages/Registration/SignUp/SignUp";

/* USER */
import UserDashboard from "../Pages/Dashboard/UserDashboard";
import PaymentPage from "../Pages/PaymentPage";

/* ADMIN */
import AdminDashboard from "../Admin/AdminDashboard/AdminDashboard";
import AdminSupportManager from "../Admin/AdminSupportManager/AdminSupportManager";
import ManageUsers from "../Admin/ManageUsers/ManageUsers";
import ManagePackages from "../Admin/ManagePackages";
import AdminPayments from "../Admin/AdminPayments/AdminPayments";
import AdminAssignTechnician from "../Admin/AdminAssignTechnician/AdminAssignTechnician";
import AdminServiceFeedback from "../Admin/AdminServiceFeedback/AdminServiceFeedback";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainOutlet />,
    errorElement: (
      <div className="p-10 text-center text-red-500">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>Route failed to render.</p>
      </div>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutUs /> },
      { path: "packages", element: <Packages /> },
      { path: "reviews", element: <Reviews /> },
      { path: "ftp", element: <Ftp /> },
      { path: "notice", element: <Notice /> },
      { path: "support", element: <Support /> },

      { path: "login", element: <LogIn /> },
      { path: "register", element: <SignUp /> },

      {
        path: "dashboard",
        element: (
          <PrivateRoutes>
            <UserDashboard />
          </PrivateRoutes>
        ),
      },

      {
        path: "payment",
        element: (
          <PrivateRoutes>
            <PaymentPage />
          </PrivateRoutes>
        ),
      },

      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <ManageUsers /> },
          { path: "manage-users", element: <ManageUsers /> },
          { path: "manage-packages", element: <ManagePackages /> },
          { path: "support-status", element: <AdminSupportManager /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "assign-technician", element: <AdminAssignTechnician /> },
          { path: "service-feedback", element: <AdminServiceFeedback /> }
        ],
      },
    ],
  },
]);
