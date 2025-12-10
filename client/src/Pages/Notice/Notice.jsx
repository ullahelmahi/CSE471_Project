import React from "react";

const announcements = [
    {
        id: 1,
        title: "⚠️ Scheduled Maintenance - April 20",
        message:
            "Our network will undergo maintenance from 12:00 AM to 4:00 AM on April 20. Service may be interrupted during this time. We apologize for the inconvenience.",
        type: "warning",
        date: "2025-04-14",
    },
    {
        id: 2,
        title: "🎉 New Plan Launched: Super Saver 25 Mbps",
        message:
            "Check out our brand new Super Saver plan with 25 Mbps speed at only ৳699/month. Limited-time offer for new and existing users!",
        type: "info",
        date: "2025-04-12",
    },
    {
        id: 3,
        title: "✅ System Upgrade Completed",
        message:
            "We’ve successfully completed our backend upgrade to provide you with faster and more secure service. Thanks for your patience!",
        type: "success",
        date: "2025-04-10",
    }
];

const Notice = () => {
    return (
        <section className="bg-base-100 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-primary mb-6">📢 Announcements</h2>

                <div className="space-y-6">
                    {announcements.map((item) => (
                        <div
                            key={item.id}
                            className={`alert shadow-md ${item.type === "warning"
                                    ? "alert-warning"
                                    : item.type === "success"
                                        ? "alert-success"
                                        : "alert-info"
                                }`}
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-800">{item.message}</p>
                                <p className="text-xs text-gray-500 mt-1">📅 {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Notice;
