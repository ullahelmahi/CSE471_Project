import { useEffect, useState, useContext } from "react";
import EachPackage from "./EachPackage";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* =========================
     LOAD PACKAGES
  ========================= */
  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await API.get("/packages");
        setPackages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load packages", err);
        Swal.fire("Error", "Failed to load packages", "error");
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  /* =========================
     SELECT PLAN → PAYMENT
  ========================= */
  const selectPlan = async (pkg) => {
    if (!user?._id) {
      const res = await Swal.fire({
        title: "Login required",
        text: "Please login to subscribe",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
      });

      if (res.isConfirmed) navigate("/login");
      return;
    }

    const confirm = await Swal.fire({
      title: `Subscribe to ${pkg.name}?`,
      text: `Price: ৳${pkg.price}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
    });

    if (!confirm.isConfirmed) return;

    /* ✅ STORE PLAN FOR PAYMENT PAGE */
    localStorage.setItem("selectedPlan", JSON.stringify(pkg));

    /* ✅ GO TO PAYMENT PAGE */
    navigate("/payment");
  };

  if (loading) return <div className="p-8">Loading packages…</div>;
  if (packages.length === 0) return <div className="p-8">No packages found.</div>;

  return (
    <section className="p-6">
      <h2 className="text-4xl font-semibold text-center mb-8">
        Available Internet Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <EachPackage
            key={pkg._id}
            item={pkg}
            onSelect={() => selectPlan(pkg)}
          />
        ))}
      </div>
    </section>
  );
};

export default Packages;