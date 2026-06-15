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
    fetch("http://localhost:4000/api/feedback/all", {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          console.error(data);
          setFeedbacks([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load feedback");
        setLoading(false);
      });
  }, [token]);

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) /
          feedbacks.length
        ).toFixed(1)
      : "0";

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((f) => f.rating === rating).length,
  }));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⭐ User Feedback Dashboard</h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            className="admin-logout"
            onClick={() => navigate("/admin/dashboard")}
          >
            Threats
          </button>

          <button
            className="admin-logout"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-stats">
        <div className="stat-card big">
          <div className="stat-number">{avgRating}</div>

          <div className="stat-label">
            Average Rating
          </div>

          <div className="stat-stars">
            {"★".repeat(Math.round(Number(avgRating)))}
            {"☆".repeat(
              5 - Math.round(Number(avgRating))
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {feedbacks.length}
          </div>

          <div className="stat-label">
            Total Reviews
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {
              feedbacks.filter(
                (f) => f.rating >= 4
              ).length
            }
          </div>

          <div className="stat-label">
            Positive Reviews
          </div>
        </div>

        <div className="stat-card breakdown">
          <div
            className="stat-label"
            style={{ marginBottom: 12 }}
          >
            Rating Breakdown
          </div>

          {ratingCounts.map(
            ({ rating, count }) => (
              <div
                key={rating}
                className="breakdown-row"
              >
                <span className="breakdown-stars">
                  {"★".repeat(rating)}
                </span>

                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{
                      width:
                        feedbacks.length > 0
                          ? `${
                              (count /
                                feedbacks.length) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

                <span className="breakdown-count">
                  {count}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="admin-loading">
          <p>Loading feedback...</p>
        </div>
      ) : error ? (
        <div className="admin-error">
          {error}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="admin-empty">
          No feedback found
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="feedback-card"
            >
              <div className="feedback-card-header">
                <div className="feedback-user">
                  <div className="feedback-avatar">
                    {(f.email || "?")[0].toUpperCase()}
                  </div>

                  <div>
                    <div className="feedback-email">
                      {f.email || "Anonymous"}
                    </div>

                    <div className="feedback-date">
                      {new Date(
                        f.created_at
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="feedback-rating">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        className={
                          star <= f.rating
                            ? "star-filled"
                            : "star-empty"
                        }
                      >
                        ★
                      </span>
                    )
                  )}
                </div>
              </div>

              {f.comment && (
                <div className="feedback-comment">
                  "{f.comment}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}