import { useEffect, useState } from "react";

function AdminPendingUsers() {
  const [users, setUsers] = useState([]);

  // Fetch pending users
  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users/pending");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const verifyUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/verify`, {
      method: "PUT"
    });
    loadUsers(); // refresh list
  };

  const suspendUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/suspend`, {
      method: "PUT"
    });
    loadUsers();
  };

  const reactivateUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/reactivate`, {
      method: "PUT"
    });
    loadUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pending Users</h1>

      {users.length === 0 ? <p>No pending users</p> : null}

      {users.map(user => (
        <div key={user._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px"
        }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button onClick={() => verifyUser(user._id)}>Verify</button>
          <button onClick={() => suspendUser(user._id)} style={{ marginLeft: "10px" }}>Suspend</button>
          <button onClick={() => reactivateUser(user._id)} style={{ marginLeft: "10px" }}>Reactivate</button>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingUsers;
