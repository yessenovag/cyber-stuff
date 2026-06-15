import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ADMIN_EMAIL = "admin1@gmail.com";    // ← твой email
const ADMIN_PASSWORD = "CyberSafe2026!"; // ← придумай пароль для админа

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin/feedback");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>🛡 Admin Panel</h1>
        <p className="auth-subtitle">CyberSafe administration</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary full">
            Enter Admin Panel
          </button>
        </form>
      </motion.div>
    </div>
  );
}