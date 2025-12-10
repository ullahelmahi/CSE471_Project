import React, { createContext, useEffect, useState } from 'react';
import API from '../services/api';

// shape: { user, login, logout }
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    // If a token exists we set Authorization header automatically by API interceptor.
    // Optionally you could call /auth/me here if you implement it on server.
  }, []);

  function login(token, userObj) {
    if (token) localStorage.setItem('token', token);
    if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj || null);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = { user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
