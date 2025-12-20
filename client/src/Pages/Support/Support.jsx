import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import LocationPicker from "./LocationPicker";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState("complaint");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      Swal.fire(
        "Access Denied",
        "Admins cannot access the Support Center",
        "warning"
      );
      navigate("/admin");
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("Login required", "Please login to submit support request", "warning");
      return;
    }

    if (user.role === "admin") {
      Swal.fire("Admins cannot submit support requests", "", "info");
      return;
    }

    const form = e.target;

    const supportMessage = message.trim();

    if (!supportMessage) {
        Swal.fire("Message required", "Please describe your issue", "warning");
        return;
    }

    if (type === "service" && !location) {
        Swal.fire(
            "Location required",
            "Please use the map to select your location",
            "warning"
    );
    return;
    }

    const payload = {
        userId: user._id,
        name: form.name.value,
        email: form.email.value,
        type,
        issueType: form.issueType.value,
        supportMessage,
        location: location || null,
    };

    try {
      await API.post("/support-requests", payload);

      Swal.fire("Submitted", "Your request has been sent", "success");

      form.reset();
      setMessage("");        
      setLocation(null);    
      setType("complaint");  
    } catch (err) {
      Swal.fire("Error", "Submission failed", "error");
    }
  };

  return (
    <section className="bg-base-100 px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary">
          🛎️ Support Center
        </h1>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setType("complaint")}
            className={`btn ${type === "complaint" ? "btn-primary" : "btn-outline"}`}
          >
            Complaint
          </button>
          <button
            onClick={() => setType("service")}
            className={`btn ${type === "service" ? "btn-secondary" : "btn-outline"}`}
          >
            Service Request
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-base-200 p-6 rounded-xl space-y-4 shadow"
        >
          <input
            name="name"
            defaultValue={user?.name}
            required
            className="input input-bordered w-full"
            placeholder="Your Name"
          />

          <input
            name="email"
            defaultValue={user?.email}
            required
            type="email"
            className="input input-bordered w-full"
            placeholder="Your Email"
          />

          <select
            name="issueType"
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Issue Type</option>
            {type === "complaint" ? (
              <>
                <option>Slow Internet</option>
                <option>No Connection</option>
                <option>Billing Issue</option>
                <option>Other</option>
              </>
            ) : (
              <>
                <option>Technician Visit</option>
                <option>Router Setup</option>
                <option>Line Check</option>
                <option>Other</option>
              </>
            )}
          </select>

          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="textarea textarea-bordered w-full"
            placeholder="Describe your issue"
          />
          {type === "service" && (
            <div className="space-y-2">
                <p className="font-semibold">Pin your location</p>
                <LocationPicker setLocation={setLocation} />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Support;