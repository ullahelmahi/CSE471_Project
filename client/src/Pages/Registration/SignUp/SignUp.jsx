import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../../services/api";
import MapPicker from "../../Support/MapPicker";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================
     INPUT HANDLER
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ PHONE: numeric + max 11 digits
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 11) return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ======================
     AUTO ADDRESS FROM MAP
  ====================== */
  const handleAddressFromMap = (address) => {
    setForm(prev => ({ ...prev, address }));
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.phone.length !== 11) {
      return toast.error("Phone number must be exactly 11 digits");
    }

    if (!location) {
      return toast.error("Please select your location on map");
    }

    setLoading(true);

    try {
      await API.post("/users", {
        ...form,
        location,
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Create Account
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-base-200 p-6 rounded-lg"
      >
        <input
          name="name"
          placeholder="Full Name"
          className="input input-bordered w-full"
          required
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          required
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone (11 digits)"
          className="input input-bordered w-full"
          required
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          className="textarea textarea-bordered w-full"
          required
          value={form.address}
          onChange={handleChange}
        />

        {/* MAP */}
        <div>
          <p className="font-semibold mb-2">
            📍 Select Your Location
          </p>

          <MapPicker
            onSelect={setLocation}
            onAddressSelect={handleAddressFromMap}
          />

          {!location && (
            <p className="text-sm text-red-400 mt-1">
              Location is required
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
};

export default SignUp;
