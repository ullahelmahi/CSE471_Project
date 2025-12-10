import { useEffect, useState } from "react";
import axios from "axios";
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

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await axios.get("http://localhost:5000/packages");
            setPackages(res.data);
        } catch (err) {
            console.error("Failed to load packages", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            features: formData.features.split(",").map(f => f.trim())
        };

        try {
            if (editingPackage) {
                await axios.patch(`http://localhost:5000/packages/${editingPackage._id}`, payload);
                Swal.fire("Updated!", "Package updated successfully.", "success");
            } else {
                await axios.post("http://localhost:5000/packages", payload);
                Swal.fire("Added!", "New package added.", "success");
            }
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
            setEditingPackage(null);
            fetchPackages();
        } catch (err) {
            console.error("Save failed", err);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            ...pkg,
            features: pkg.features.join(", ")
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Package?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/packages/${id}`);
                fetchPackages();
                Swal.fire("Deleted!", "The package has been removed.", "success");
            } catch (err) {
                Swal.fire("Error", "Deletion failed.", "error");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Manage ISP Packages</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-4 rounded-lg">

                <label>
                    <span className="label-text">Package Name: </span>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Plan Name" className="input input-bordered" required />
                </label>

                <label>
                    <span className="label-text">Plan ID: </span>
                    <input name="planId" value={formData.planId} onChange={handleChange} placeholder="Plan ID" className="input input-bordered" required />
                </label>

                
                <label>
                    <span className="label-text">Speed: </span>
                    <input name="speed" value={formData.speed} onChange={handleChange} placeholder="Speed (Mbps)" type="number" className="input input-bordered" required />   
                </label>

                <label>
                    <span className="label-text">Price: </span>
                    <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (৳)" type="number" className="input input-bordered" required />
                </label>

                <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} className="select select-bordered">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <label>
                    <span className="label-text">Validity Days: </span>
                    <input name="validityDays" value={formData.validityDays} onChange={handleChange} placeholder="Validity Days" type="number" className="input input-bordered" required />
                </label>

                
                <label>
                    <span className="label-text">Discount: </span>
                    <input name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount (%)" type="number" className="input input-bordered" required />
                </label>

                <label>
                    <span className="label-text">Features: </span>
                    <input name="features" value={formData.features} onChange={handleChange} placeholder="Features (comma-separated)" className="input input-bordered" required />
                </label>
            
                <label>
                    <span className="label-text">Description: </span>
                    <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="input input-bordered" required />
                </label>

                <label>
                    <span className="label-text">Image URL: </span>

                    <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="input input-bordered" required />

                </label>

                <label className="label cursor-pointer flex gap-2">
                    <input name="isPromotional" type="checkbox" checked={formData.isPromotional} onChange={handleChange} className="checkbox" />
                    <span className="label-text">Is Promotional?</span>
                </label>
                <label className="label cursor-pointer flex gap-2">
                    <input name="available" type="checkbox" checked={formData.available} onChange={handleChange} className="checkbox" />
                    <span className="label-text">Available?</span>
                </label>

                <button type="submit" className="btn btn-primary col-span-full">
                    {editingPackage ? "Update Package" : "Add Package"}
                </button>
            </form>

            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">All Packages</h3>
                <div className="overflow-x-auto">
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
                            {packages.map((pkg) => (
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
        </div>
    );
};

export default ManagePackages;
