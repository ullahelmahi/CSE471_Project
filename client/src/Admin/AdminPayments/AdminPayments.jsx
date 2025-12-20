import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PAYMENTS
  ========================= */
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/admin/payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPayments(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  /* =========================
     APPROVE PAYMENT
  ========================= */
  const approvePayment = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Payment?",
      text: "This will activate the subscription",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/admin/payments/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Approved", "Payment approved successfully", "success");
      fetchPayments();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Approval failed",
        "error"
      );
    }
  };

  /* =========================
     REJECT PAYMENT
  ========================= */
  const rejectPayment = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Payment?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/admin/payments/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Rejected", "Payment rejected", "success");
      fetchPayments();
    } catch (err) {
      Swal.fire("Error", "Rejection failed", "error");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading payments…</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        💳 Manage Payments
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-100">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>

                <td className="text-xs">{p.userId}</td>

                <td>
                  <p className="font-semibold">{p.planName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </td>

                <td>৳{p.amount}</td>

                <td>
                  {p.paymentMethod === "bkash" ||
                  p.paymentMethod === "bkash-demo" ? (
                    <span className="badge badge-info">bKash (Demo)</span>
                  ) : (
                    <span className="badge badge-warning">Cash</span>
                  )}
                </td>

                <td className="text-xs">
                  {p.transactionId || "—"}
                </td>

                <td>
                  <span
                    className={`badge ${
                      p.paymentStatus === "paid"
                        ? "badge-success"
                        : p.paymentStatus === "pending"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>

                <td>
                  {p.paymentStatus === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approvePayment(p._id)}
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectPayment(p._id)}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center text-gray-500 p-6">
            No payments found.
          </p>
        )}
      </div>
    </section>
  );
};

export default AdminPayments;