import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

const ManagePackages = () => {
    const [packages, setPackages] = useState([]);
    const [editingPackage, setEditingPackage] = useState(null);

    const [formData, setFormData] = useState({
        planId: "",
        name: "",
        speed: "",
        price: "",
        billingCycle: "monthly",
        validityDays: "",
        description: "",
        features: "",
        discount: 0,
        isPromotional: false,
        available: true,
        image: ""
    });

    /* =========================
       FETCH PACKAGES
    ========================= */
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await API.get("/packages");
            setPackages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load packages", err);
        }
    };

    /* =========================
       FORM HANDLING
    ========================= */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    /* =========================
       ADD / UPDATE PACKAGE
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Unauthorized", "Admin login required", "error");
            return;
        }

        const payload = {
            ...formData,
            speed: Number(formData.speed),
            price: Number(formData.price),
            validityDays: Number(formData.validityDays),
            discount: Number(formData.discount),
            features: formData.features
                .split(",")
                .map(f => f.trim())
                .filter(Boolean)
        };

        try {
            if (editingPackage) {
                await API.patch(
                `/packages/${editingPackage._id}`,
                payload
                );
                Swal.fire("Updated!", "Package updated successfully.", "success");
            } else {
                await API.post("/packages", payload);
                Swal.fire("Added!", "New package added successfully.", "success");
            }

            resetForm();
            fetchPackages();

        } catch (err) {
            console.error("Save failed", err);
            Swal.fire("Error", "Operation failed.", "error");
        }
    };

    const resetForm = () => {
        setEditingPackage(null);
        setFormData({
            planId: "",
            name: "",
            speed: "",
            price: "",
            billingCycle: "monthly",
            validityDays: "",
            description: "",
            features: "",
            discount: 0,
            isPromotional: false,
            available: true,
            image: ""
        });
    };

    /* =========================
       EDIT PACKAGE (PREFILL)
    ========================= */
    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            planId: pkg.planId || "",
            name: pkg.name || "",
            speed: pkg.speed || "",
            price: pkg.price || "",
            billingCycle: pkg.billingCycle || "monthly",
            validityDays: pkg.validityDays || "",
            description: pkg.description || "",
            features: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
            discount: pkg.discount || 0,
            isPromotional: pkg.isPromotional || false,
            available: pkg.available ?? true,
            image: pkg.image || ""
        });
    };

    /* =========================
       DELETE PACKAGE (FIXED)
    ========================= */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Package?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");

            await API.delete(`/packages/${id}`);

            Swal.fire("Deleted!", "Package removed successfully.", "success");
            fetchPackages();
        } catch (err) {
            console.error("Delete failed:", err);
            Swal.fire("Error", "Deletion failed.", "error");
        }
    };

    /* =========================
       UI
    ========================= */
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Manage ISP Packages</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-4 rounded-lg">

                <input name="name" value={formData.name} onChange={handleChange} placeholder="Package Name" className="input input-bordered" required />

                <input name="planId" value={formData.planId} onChange={handleChange} placeholder="Plan ID" className="input input-bordered" required />

                <input name="speed" value={formData.speed} onChange={handleChange} placeholder="Speed (Mbps)" type="number" className="input input-bordered" required />

                <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (৳)" type="number" className="input input-bordered" required />

                <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="select select-bordered">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <input name="validityDays" value={formData.validityDays} onChange={handleChange} placeholder="Validity Days" type="number" className="input input-bordered" required />

                <input name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount (%)" type="number" className="input input-bordered" />

                <input name="features" value={formData.features} onChange={handleChange} placeholder="Features (comma separated)" className="input input-bordered" />

                <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="input input-bordered col-span-full" required />

                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="input input-bordered col-span-full" />

                <label className="flex gap-2 items-center">
                    <input type="checkbox" name="isPromotional" checked={formData.isPromotional} onChange={handleChange} className="checkbox" />
                    Promotional
                </label>

                <label className="flex gap-2 items-center">
                    <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="checkbox" />
                    Available
                </label>

                <button type="submit" className="btn btn-primary col-span-full">
                    {editingPackage ? "Update Package" : "Add Package"}
                </button>
            </form>

            {/* TABLE */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">All Packages</h3>
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Plan ID</th>
                            <th>Name</th>
                            <th>Speed</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg._id}>
                                <td>{pkg.planId}</td>
                                <td>{pkg.name}</td>
                                <td>{pkg.speed}</td>
                                <td>{pkg.price} ৳</td>
                                <td>
                                    <button onClick={() => handleEdit(pkg)} className="btn btn-xs btn-warning mr-2">Edit</button>
                                    <button onClick={() => handleDelete(pkg._id)} className="btn btn-xs btn-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePackages;