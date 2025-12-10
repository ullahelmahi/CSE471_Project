import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminSupportManager = () => {
    const [requests, setRequests] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});
    const [adminMessages, setAdminMessages] = useState({});

    // Fetch all support requests
    useEffect(() => {
        fetch("http://localhost:5000/support-requests")
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);
                // Initialize status and message fields
                const statusMap = {};
                const messageMap = {};
                data.forEach((req) => {
                    statusMap[req._id] = req.status || "pending";
                    messageMap[req._id] = req.adminComments || "";
                });
                setStatusUpdates(statusMap);
                setAdminMessages(messageMap);
            })
            .catch((err) => console.error("Failed to load requests", err));
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setStatusUpdates({ ...statusUpdates, [id]: newStatus });
    };

    const handleCommentChange = (id, message) => {
        setAdminMessages({ ...adminMessages, [id]: message });
    };

    const handleUpdate = async (id) => {
        const updatedStatus = statusUpdates[id];
        const updatedMessage = updatedStatus === "solved" ? adminMessages[id] : "";

        const response = await fetch(`http://localhost:5000/support-requests/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: updatedStatus,
                adminComments: updatedMessage,
            }),
        });

        if (response.ok) {
            toast.success("Support request updated successfully.");
        } else {
            toast.error("Update failed");
            // console.error("Update failed");
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Admin Support Manager</h2>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req._id} className="border rounded p-4 shadow bg-white">
                        <p><strong>Name:</strong> {req.name}</p>
                        <p><strong>Email:</strong> {req.email}</p>
                        <p><strong>Type:</strong> {req.type}</p>
                        <p><strong>Issue:</strong> {req.issueType}</p>
                        <p><strong>Message:</strong> {req.supportMessage}</p>

                        <div className="mt-2">
                            <label className="mr-2 font-medium">Status:</label>
                            <select
                                value={statusUpdates[req._id]}
                                onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="solved">Solved</option>
                            </select>
                        </div>

                        {statusUpdates[req._id] === "solved" && (
                            <div className="mt-3">
                                <label className="block font-medium">Admin Message:</label>
                                <textarea
                                    rows={3}
                                    className="w-full mt-1 border rounded p-2"
                                    value={adminMessages[req._id]}
                                    onChange={(e) => handleCommentChange(req._id, e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            onClick={() => handleUpdate(req._id)}
                        >
                            Update
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSupportManager;
