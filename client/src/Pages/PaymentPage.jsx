import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();



  // 🔹 Load selected plan
  useEffect(() => {
    const stored = localStorage.getItem("selectedPlan");
    if (!stored) {
      Swal.fire("No plan selected", "", "warning");
      navigate("/packages");
      return;
    }

    const { planId } = JSON.parse(stored);

    API.get("/packages").then(res => {
      const found = res.data.find(p => p.planId === planId);
      if (!found) {
        Swal.fire("Plan not found", "", "error");
        navigate("/packages");
      } else {
        setPkg(found);
      }
    });
  }, [navigate]);

  if (!pkg) return null;

  // 🔹 UI calculation ONLY
  const discountAmount =
    pkg.discount > 0
      ? Math.round((pkg.price * pkg.discount) / 100)
      : 0;

  const finalAmount = pkg.price - discountAmount;

  const handleConfirm = async () => {
    if (!method) {
      return Swal.fire("Select payment method", "", "warning");
    }

    if (method === "bkash") {
      if (!/^\d{11}$/.test(bkashNumber) || !transactionId) {
        return Swal.fire(
          "Payment failed",
          "bKash number and transaction ID required",
          "error"
        );
      }
    }

    setLoading(true);

    try {
      await API.post("/payments", {
        planId: pkg.planId,
        planName: pkg.name,
        amount: finalAmount,
        paymentMethod: method,
        bkashNumber,
        transactionId,
      });

      Swal.fire("Success", "Payment submitted", "success");
      localStorage.removeItem("selectedPlan");
      navigate("/dashboard");
    } catch (err) {
      Swal.fire(
        "Payment failed",
        err.response?.data?.message || "Try again",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Payment</h2>

      <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <p><b>Plan:</b> {pkg.name}</p>

        <p>
          <b>Price:</b> ৳{pkg.price}
        </p>

        {pkg.discount > 0 && (
          <p className="text-green-400">
            <b>Discount:</b> {pkg.discount}% (−৳{discountAmount})
          </p>
        )}

        <p className="text-lg font-semibold">
          Payable Amount: ৳{finalAmount}
        </p>

        <select
          className="select select-bordered w-full"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash (Admin Approval)</option>
          <option value="bkash">Dummy bKash</option>
        </select>

        {method === "bkash" && (
        <div className="space-y-3 bg-base-300 p-4 rounded-lg">
            {/* Instructions */}
            <div className="text-sm text-blue-400">
            <p className="font-semibold">Dummy bKash Instructions</p>
            <p>
                Make Payment <b>৳{finalAmount}</b> to:
            </p>
            <p className="text-lg font-bold text-white">
                📱 {DEMO_BKASH_NUMBER}
            </p>
            <p>
                Reference: <b>{user?.name}</b>
            </p>
            <p className="text-xs text-gray-400">
                (Demo only – no real money required)
            </p>
            </div>

            {/* User inputs */}
            <input
            className="input input-bordered w-full"
            placeholder="Your bKash Number (11 digits)"
            value={bkashNumber}
            onChange={e => setBkashNumber(e.target.value)}
            />

            <input
            className="input input-bordered w-full"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
            />
        </div>
        )}

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </section>
  );
};


export default PaymentPage;
