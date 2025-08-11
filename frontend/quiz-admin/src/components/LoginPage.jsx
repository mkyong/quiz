import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login(username, password);
    if (res.ok) {
      navigate("/admin");
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-black">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow max-w-sm w-full">
        <h2 className="text-2xl mb-4 font-bold dark:text-neutral-100">Admin Login</h2>
        {error && <div className="mb-3 quiz-error-box">{error}</div>}
        <input
          className="mb-3 block w-full p-2 rounded border"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="mb-3 block w-full p-2 rounded border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
