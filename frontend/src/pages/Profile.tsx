import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiPost } from "../services/api";

export default function Profile() {
  const { user, token, logout } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!user) {
    return <div className="card"><h3>Loading profile...</h3></div>;
  }

  const handleEmailChange = async () => {
    try {
      await apiPost("/auth/change-email", { email }, token || "");
      setMessage("✅ Email updated successfully");
    } catch (err: any) {
      setMessage(err.message || "Failed to update email");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await apiPost(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        token || ""
      );
      setMessage("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.message || "Failed to update password");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>
        <p className="profile-email">{user.email}</p>

        {message && <p className="profile-message">{message}</p>}

        {/* EMAIL CHANGE */}
        <div className="profile-section">
          <h3>Change Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleEmailChange} className="btn-primary">
            Update Email
          </button>
        </div>

        {/* PASSWORD CHANGE */}
        <div className="profile-section">
          <h3>Change Password</h3>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={handlePasswordChange} className="btn-primary">
            Update Password
          </button>
        </div>

        {/* LOGOUT */}
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}


