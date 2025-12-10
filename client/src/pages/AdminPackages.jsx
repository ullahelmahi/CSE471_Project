import { useEffect, useState } from "react";

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    speed: "",
    price: "",
    duration: "",
    description: "",
  });

  // Load packages
  const loadPackages = async () => {
    const res = await fetch("http://localhost:5000/api/admin/packages");
    const data = await res.json();
    setPackages(data);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new package
  const addPackage = async () => {
    await fetch("http://localhost:5000/api/admin/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // Reset form
    setForm({ name: "", speed: "", price: "", duration: "", description: "" });

    loadPackages();
  };

  // Update package
  const updatePackage = async (id) => {
    const newName = prompt("Enter new package name:");
    if (!newName) return;

    await fetch(`http://localhost:5000/api/admin/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    loadPackages();
  };

  // Delete package
  const deletePackage = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    await fetch(`http://localhost:5000/api/admin/packages/${id}`, {
      method: "DELETE",
    });

    loadPackages();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ISP Packages</h1>

      {/* Add Package Form */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Add New Package</h3>
        <input name="name" placeholder="Package Name" value={form.name} onChange={handleChange} /> <br/>
        <input name="speed" placeholder="Speed (e.g. 20 Mbps)" value={form.speed} onChange={handleChange} /> <br/>
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} /> <br/>
        <input name="duration" placeholder="Duration (days)" value={form.duration} onChange={handleChange} /> <br/>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /> <br/>
        <button onClick={addPackage}>Add Package</button>
      </div>

      {/* List Packages */}
      <h2>Existing Packages</h2>

      {packages.length === 0 ? (
        <p>No packages available.</p>
      ) : (
        packages.map((pkg) => (
          <div
            key={pkg._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Name:</strong> {pkg.name}</p>
            <p><strong>Speed:</strong> {pkg.speed}</p>
            <p><strong>Price:</strong> {pkg.price}</p>
            <p><strong>Duration:</strong> {pkg.duration} days</p>
            <p><strong>Description:</strong> {pkg.description}</p>

            <button onClick={() => updatePackage(pkg._id)}>Edit</button>
            <button onClick={() => deletePackage(pkg._id)} style={{ marginLeft: "10px" }}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPackages;
