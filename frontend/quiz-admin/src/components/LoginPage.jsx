import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");      // what to show
  const [shakeTick, setShakeTick] = useState(0); // forces re-run
  const { login } = useAuth();
  const navigate = useNavigate();

  const shakeRef = useRef(null);

  useEffect(() => {
    if (!shakeRef.current || shakeTick === 0) return;
    const el = shakeRef.current;
    el.classList.remove("shake");
    // force reflow to restart the CSS animation
    void el.offsetWidth;
    el.classList.add("shake");
  }, [shakeTick]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login(username, password);
    if (res.ok) {
      navigate("/admin");
    } else {
      setError(res.error);       // can be the same string repeatedly
      setShakeTick(t => t + 1);  // always increments → effect runs every time
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-black">
      <form onSubmit={handleSubmit} className="quiz-box p-8 rounded-2xl shadow max-w-sm w-full">
        <h2 className="text-2xl mb-4 quiz-title">Admin Login</h2>

        {error && (
          <div
            ref={shakeRef}
            className="mb-3 quiz-error-box"
            role="alert"
            aria-live="assertive"
            onAnimationEnd={() => shakeRef.current?.classList.remove("shake")}
          >
            {error}
          </div>
        )}

        <input
          className="mb-3 quiz-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="mb-3 quiz-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="w-full quiz-btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;