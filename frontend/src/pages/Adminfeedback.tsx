import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminFeedback.css";

type FeedbackItem = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  email: string;
};

export default function AdminFeedback() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Проверяем что вошли через AdminLogin
    const isAdmin = sessionStorage.getItem("admin_auth");
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    fetch("http://localhost:4000/api/feedback/all", {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "x-admin-key": "cybersafe-admin-2026",
      },
    })
      .then(r => r.json())
      .then(data => {
        setFeedbacks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load feedback");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : "—";

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedbacks.filter(f => f.rating === r).length,
  }));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⭐ User Feedback</h1>
        <span className="admin-count">{feedbacks.length} reviews</span>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        <div className="stat-card big">
          <div className="stat-number">{avgRating}</div>
          <div className="stat-label">Average Rating</div>
          <div className="stat-stars">
            {"★".repeat(Math.round(Number(avgRating) || 0))}
            {"☆".repeat(5 - Math.round(Number(avgRating) || 0))}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{feedbacks.length}</div>
          <div className="stat-label">Total Reviews</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {feedbacks.filter(f => f.rating >= 4).length}
          </div>
          <div className="stat-label">Positive (4-5 ★)</div>
        </div>

        <div className="stat-card breakdown">
          <div className="stat-label" style={{ marginBottom: 12 }}>Rating Breakdown</div>
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="breakdown-row">
              <span className="breakdown-stars">{"★".repeat(rating)}</span>
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill"
                  style={{
                    width: feedbacks.length
                      ? `${(count / feedbacks.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <span className="breakdown-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEEDBACK LIST */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading feedback...</p>
        </div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="admin-empty">No feedback yet</div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map(f => (
            <div key={f.id} className="feedback-card">
              <div className="feedback-card-header">
                <div className="feedback-user">
                  <div className="feedback-avatar">
                    {(f.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="feedback-email">{f.email || "Anonymous"}</div>
                    <div className="feedback-date">
                      {new Date(f.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className="feedback-rating">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={s <= f.rating ? "star-filled" : "star-empty"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {f.comment && (
                <div className="feedback-comment">"{f.comment}"</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}