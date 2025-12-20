import React, { createContext, useEffect, useState } from "react";
import API from "../services/api";

// shape: { user, login, logout, createUser }
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // token handled by API interceptor
  }, []);

  function login(token, userObj) {
    if (token) localStorage.setItem("token", token);
    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj || null);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  
  async function createUser(payload) {
    /*
      payload example:
      {
        name,
        email,
        password,
        phone,
        address,
        location
      }
    */
    const res = await API.post("/users", payload);
    return res.data;
  }

  const value = { user, login, logout, createUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;