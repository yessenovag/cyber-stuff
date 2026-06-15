import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Profile from "./pages/Profile";
import AdminFeedback from "./pages/AdminFeedback";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      {/* Redirect example (optional) */}
      <Route path="/home" element={<Navigate to="/" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/AIChat" element={<AIChat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />
      <Route path="/admin" element={<AdminLogin />} />
    </Routes>
  );
}

