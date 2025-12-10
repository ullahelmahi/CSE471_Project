import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const UserSupportStatus = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (user?.uid) {
            fetch(`http://localhost:5000/support-requests/user/${user.uid}`)
                .then(res => res.json())
                .then(data => setRequests(data))
                .catch(err => console.error("Error fetching support requests:", err));
        }
    }, [user]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Support Requests</h2>
            {requests.length === 0 ? (
                <p>No support requests found.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req._id} className="border rounded p-4 shadow-md bg-white">
                            <p><strong>Type:</strong> {req.type}</p>
                            <p><strong>Issue:</strong> {req.issueType || "—"}</p>
                            <p><strong>Message:</strong> {req.supportMessage}</p>

                            <p><strong>Status:</strong>
                                <span
                                    className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold
                                            ${req.status === 'solved' ? 'badge badge-success badge-outline' :
                                            req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                req.status ? 'bg-yellow-100 text-yellow-700' : ''}`}>
                                    {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : 'Unknown'}
                                </span>
                            </p>

                            <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleString()}</p>
                            {req.status === "solved" && req.adminComments && (
                                <div className="mt-2 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                                    <strong>Admin Comments:</strong>
                                    <p className="mt-1 text-gray-800">{req.adminComments}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSupportStatus;
