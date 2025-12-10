import { Routes, Route } from "react-router-dom";
import AdminPendingUsers from "./pages/AdminPendingUsers";
import AdminPaymentHistory from "./pages/AdminPaymentHistory";
import AdminPackages from "./pages/AdminPackages";   // <-- NEW

function App() {
  return (
    <Routes>
      {/* Admin User Verification Page */}
      <Route path="/admin/pending-users" element={<AdminPendingUsers />} />

      {/* Admin Payment History Page */}
      <Route path="/admin/payments" element={<AdminPaymentHistory />} />

      {/* Admin Package Management Page */}
      <Route path="/admin/packages" element={<AdminPackages />} />
    </Routes>
  );
}

export default App;
