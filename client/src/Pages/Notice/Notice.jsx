import React from "react";

const announcements = [
  {
    id: 1,
    title: "⚠️ Scheduled Network Maintenance",
    message:
      "CityNet will perform routine network maintenance on December 25 from 1:00 AM to 5:00 AM. Temporary service interruptions may occur during this period.",
    type: "warning",
    date: "22 December 2025",
  },
  {
    id: 2,
    title: "🚀 Network Performance Upgrade Completed",
    message:
      "Our core network infrastructure has been successfully upgraded to improve speed, stability, and overall service quality for all users.",
    type: "success",
    date: "21 December 2025",
  },
  {
    id: 3,
    title: "📢 New Customer Support Workflow Live",
    message:
      "We have introduced an improved support and technician assignment system to ensure faster issue resolution and better customer experience.",
    type: "info",
    date: "20 December 2025",
  },
];

const Notice = () => {
  return (
    <section className="bg-base-100 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">
          📢 Announcements
        </h2>

        <div className="space-y-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`alert shadow-md ${
                item.type === "warning"
                  ? "alert-warning"
                  : item.type === "success"
                  ? "alert-success"
                  : "alert-info"
              }`}
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-800 mt-1">
                  {item.message}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  📅 {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notice;