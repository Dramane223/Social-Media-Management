import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import api, { getErrorMessage } from "../api/axios";

const STATUS_COLORS = { Drafts: "#94a3b8", Scheduled: "#f59e0b", Published: "#22c55e" };

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, topRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/top-posts", { params: { limit: 5 } }),
      ]);
      setSummary(summaryRes.data);
      setTopPosts(topRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !summary) return <Spinner label="Loading analytics..." />;

  if (error && !summary) {
    return (
      <div>
        <h2>Analytics</h2>
        <div className="error">{error}</div>
        <button onClick={load}>Retry</button>
      </div>
    );
  }

  const statusData = [
    { name: "Drafts", value: summary.drafts },
    { name: "Scheduled", value: summary.scheduled },
    { name: "Published", value: summary.published },
  ].filter((s) => s.value > 0);

  const stats = [
    { label: "Total posts", value: summary.totalPosts, icon: "📝" },
    { label: "Published", value: summary.published, icon: "✅" },
    { label: "Scheduled", value: summary.scheduled, icon: "🕒" },
    { label: "Drafts", value: summary.drafts, icon: "📄" },
    { label: "Likes", value: summary.totalLikes, icon: "👍" },
    { label: "Shares", value: summary.totalShares, icon: "🔁" },
    { label: "Reach", value: summary.totalReach, icon: "👁" },
    { label: "Engagement", value: `${summary.engagementRate}%`, icon: "📈" },
  ];

  return (
    <div>
      <div className="page-head">
        <h2>Analytics</h2>
        <button className="secondary" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value.toLocaleString?.() ?? s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {summary.totalPosts === 0 ? (
        <p className="muted">No data yet. Create and publish posts in the Composer to see analytics.</p>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Engagement by platform</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={summary.byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#2563eb" name="Likes" />
                  <Bar dataKey="shares" fill="#f59e0b" name="Shares" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Posts by status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {statusData.map((s) => (
                      <Cell key={s.name} fill={STATUS_COLORS[s.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card wide">
              <h3>Reach by platform</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={summary.byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="reach" fill="#22c55e" name="Reach" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3>Top posts</h3>
          {topPosts.length === 0 ? (
            <p className="muted">Publish a post to see your top performers.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Platform</th>
                    <th>👍</th>
                    <th>🔁</th>
                    <th>👁</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((p) => (
                    <tr key={p.id}>
                      <td className="cell-content">{p.content}</td>
                      <td>{p.platform || "-"}</td>
                      <td>{p.likes}</td>
                      <td>{p.shares}</td>
                      <td>{p.reach}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}