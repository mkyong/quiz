import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("quizUser");
    if (u) setUser(JSON.parse(u));
  }, []);

  async function login(username, password) {
    try {
      const { data } = await axios.post("/api/auth/login", { username, password });
      setUser(data);
      localStorage.setItem("quizUser", JSON.stringify(data));
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      return { ok: false, error: msg };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("quizUser");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}