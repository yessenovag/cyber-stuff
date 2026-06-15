import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ThreatLog = {
  id: number;
  user_id: number | null;
  message: string;
  risk_score: number;
  status: string;
  created_at: string;
};

type ThreatStats = {
  totalAttacks: number;
  averageRisk: number;
};

export default function AdminThreatDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [stats, setStats] = useState<ThreatStats>({
    totalAttacks: 0,
    averageRisk: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch("https://cybersafe-api-v3-dzf7cdd7czewged8.spaincentral-01.azurewebsites.net/api/threats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),

      fetch("https://cybersafe-api-v3-dzf7cdd7czewged8.spaincentral-01.azurewebsites.net/api/threats/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    ])
      .then(([logsData, statsData]) => {
        console.log(logsData);
        console.log(statsData);

        if (Array.isArray(logsData)) {
          setLogs(logsData);
        }

        if (
          statsData &&
          typeof statsData.totalAttacks === "number"
        ) {
          setStats(statsData);
        }
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          color: "white",
          background: "#081122",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#081122",
        color: "white",
      }}
    >
      <h1>🛡️ Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Threats
        </button>

        <button
          onClick={() => navigate("/admin/feedback")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Feedback
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#162033",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "220px",
          }}
        >
          <h3>Total Attacks</h3>
          <h2>{stats.totalAttacks}</h2>
        </div>

        <div
          style={{
            background: "#162033",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "220px",
          }}
        >
          <h3>Average Risk Score</h3>
          <h2>{stats.averageRisk}</h2>
        </div>
      </div>

      <h2>Recent Threats</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#162033",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Message</th>
            <th style={thStyle}>Risk</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.id}</td>
              <td style={tdStyle}>{log.message}</td>
              <td style={tdStyle}>{log.risk_score}</td>

              <td
                style={{
                  ...tdStyle,
                  color:
                    log.status === "BLOCKED"
                      ? "#ff6b6b"
                      : "#51cf66",
                }}
              >
                {log.status}
              </td>

              <td style={tdStyle}>{log.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #2c3a52",
  padding: "12px",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #2c3a52",
  padding: "12px",
};