import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ServiceFeedbackModal = ({ service, onClose, onSuccess }) => {
  const [satisfaction, setSatisfaction] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!satisfaction) {
      return toast.error("Please select satisfaction level");
    }

    setLoading(true);
    try {
      await API.post("/service-feedback", {
        supportRequestId: service._id, 
        technicianId: service.technicianId,
        satisfaction,
        feedbackText,
        });

      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Thank you for your valuable feedback.",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        onSuccess();
        onClose();
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Service Feedback</h3>

        <select
          className="select select-bordered w-full mb-3"
          value={satisfaction}
          onChange={(e) => setSatisfaction(e.target.value)}
        >
          <option value="">Select satisfaction</option>
          <option value="satisfied">😊 Satisfied</option>
          <option value="neutral">😐 Neutral</option>
          <option value="not_satisfied">😞 Not Satisfied</option>
        </select>

        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          placeholder="Write your feedback (optional)"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={submitFeedback}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeedbackModal;