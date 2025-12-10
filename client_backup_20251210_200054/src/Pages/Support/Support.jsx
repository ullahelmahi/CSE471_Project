import React, { useState } from "react";

const Support = () => {
    const [formType, setFormType] = useState("complaint");

    return (
        <section className="bg-base-100 text-slate-800 px-6 py-16 mt-12">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">🛎️ Support Center</h1>
                    <p className="text-gray-600 mt-2">Let us help you with your concerns or service needs.</p>
                </div>

                {/* Toggle Between Complaint / Service Request */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setFormType("complaint")}
                        className={`btn ${formType === "complaint" ? "btn-primary" : "btn-primary hover:shadow-2xl"}`}
                    >
                        Submit Complaint
                    </button>
                    <button
                        onClick={() => setFormType("service")}
                        className={`btn ${formType === "service" ? "btn-secondary" : " btn-secondary"}`}
                    >
                        Request Service
                    </button>
                </div>

                {/* Complaint Form */}
                {formType === "complaint" && (
                    <form className="bg-base-200 p-6 rounded-xl space-y-4 shadow">
                        <h2 className="text-xl font-semibold text-primary mb-2">Complaint Form</h2>
                        <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
                        <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
                        <select className="select select-bordered w-full">
                            <option disabled selected>Select Complaint Type</option>
                            <option>Slow Internet</option>
                            <option>No Connection</option>
                            <option>Billing Issue</option>
                            <option>Other</option>
                        </select>
                        <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="Describe your issue..."></textarea>
                        <button type="submit" className="btn btn-primary w-full">Submit Complaint</button>
                    </form>
                )}

                {/* Service Request Form */}
                {formType === "service" && (
                    <form className="bg-base-200 p-6 rounded-xl space-y-4 shadow">
                        <h2 className="text-xl font-semibold text-secondary mb-2">Service Request Form</h2>
                        <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
                        <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
                        <input type="text" placeholder="Phone Number" className="input input-bordered w-full" />
                        <select className="select select-bordered w-full">
                            <option disabled selected>Select Service Type</option>
                            <option>Technician Visit</option>
                            <option>New Router Setup</option>
                            <option>Line Check / Signal Boost</option>
                            <option>Other</option>
                        </select>
                        <input type="date" className="input input-bordered w-full" />
                        <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="Additional details..."></textarea>
                        <button type="submit" className="btn btn-secondary w-full">Submit Request</button>
                    </form>
                )}

                {/* Contact Note */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    Having trouble? Call our 24/7 helpline at <strong>+880 1234-567890</strong> or email <strong>support@citynet.com</strong>.
                </div>

            </div>
        </section>
    );
};

export default Support;
