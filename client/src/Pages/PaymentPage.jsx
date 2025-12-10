import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProvider";

const PaymentPage = () => {
    const { user } = useContext(AuthContext);
    const [unpaidPlans, setUnpaidPlans] = useState([]);

    useEffect(() => {
        if (user?.uid) {
            axios.get(`http://localhost:5000/subscriptions/${user.uid}`)
                .then(res => {
                    const unpaid = res.data.filter(sub => sub.paymentStatus !== "paid");
                    setUnpaidPlans(unpaid);
                })
                .catch(err => console.error("Failed to fetch subscriptions:", err));
        }
    }, [user]);

    const handlePayment = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:5000/subscriptions/${id}/payment`);
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success", "Payment completed!", "success");
                setUnpaidPlans(prev => prev.filter(sub => sub._id !== id));
            }
        } catch (err) {
            Swal.fire("Error", "Failed to process payment", "error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Unpaid Subscriptions</h2>
            {unpaidPlans.length === 0 ? (
                <p>You have no unpaid subscriptions.</p>
            ) : (
                <div className="grid gap-4">
                    {unpaidPlans.map(plan => (
                        <div key={plan._id} className="card bg-base-100 shadow-md p-4">
                            <p><strong>Plan:</strong> {plan.planName}</p>
                            <p><strong>Subscribed On:</strong> {new Date(plan.subscriptionDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className="text-red-500">Unpaid</span></p>
                            <button
                                onClick={() => handlePayment(plan._id)}
                                className="btn btn-success mt-3"
                            >
                                Pay Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
