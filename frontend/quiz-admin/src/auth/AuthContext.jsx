import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On load, check localStorage
  useEffect(() => {
    const u = localStorage.getItem("quizUser");
    if (u) setUser(JSON.parse(u));
  }, []);

  function login(username, password) {
    // Replace this logic with real backend check!
    if (username === "admin" && password === "password") {
      setUser({ username });
      localStorage.setItem("quizUser", JSON.stringify({ username }));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("quizUser");
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}