import { useEffect, useState } from "react";

function AdminPaymentHistory() {
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    const res = await fetch("http://localhost:5000/api/admin/payments");
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment History</h1>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        payments.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>User:</strong> {p.userId?.name} ({p.userId?.email})</p>
            <p><strong>Package:</strong> {p.packageId?.name}</p>
            <p><strong>Amount:</strong> {p.amount}</p>
            <p><strong>Method:</strong> {p.method}</p>
            <p><strong>Status:</strong> {p.status}</p>
            <p><strong>Date:</strong> {new Date(p.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPaymentHistory;
