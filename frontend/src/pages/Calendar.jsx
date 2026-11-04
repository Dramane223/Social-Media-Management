import Spinner from "../components/Spinner";
import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../api/axios";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 2;

const pad = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(dayKey(today));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = current.getFullYear();
  const month = current.getMonth();

  // Fetch the posts of the visible month every time it changes
  useEffect(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const from = `${dayKey(first)}T00:00:00`;
    const to = `${dayKey(last)}T23:59:59`;

    setLoading(true);
    setError("");
    api
      .get("/posts/calendar", { params: { from, to } })
      .then(({ data }) => setPosts(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [year, month]);

  // Group posts by day: "2026-12-20T09:30:00" -> "2026-12-20" (no timezone conversion)
  const postsByDay = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      const key = p.scheduledAt.slice(0, 10);
      (map[key] = map[key] || []).push(p);
    });
    return map;
  }, [posts]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToMonth = (offset) => setCurrent(new Date(year, month + offset, 1));
  const goToToday = () => {
    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(dayKey(today));
  };

  const selectedPosts = postsByDay[selected] || [];

  return (
    <div>
      <h2>Calendar</h2>
      {error && <div className="error">{error}</div>}

      <div className="cal-header">
        <button className="secondary" onClick={() => goToMonth(-1)}>← Prev</button>
        <h3>
          {current.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <div className="cal-header-right">
          <button className="secondary" onClick={goToToday}>Today</button>
          <button className="secondary" onClick={() => goToMonth(1)}>Next →</button>
        </div>
      </div>

      {loading && <Spinner label="Loading calendar..." />}

      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-dow">{d}</div>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} className="cal-cell empty" />;

          const key = dayKey(new Date(year, month, day));
          const dayPosts = postsByDay[key] || [];
          const classes = ["cal-cell"];
          if (key === dayKey(today)) classes.push("today");
          if (key === selected) classes.push("selected");

          return (
            <div key={key} className={classes.join(" ")} onClick={() => setSelected(key)}>
              <div className="cal-day">{day}</div>
              {dayPosts.slice(0, MAX_CHIPS).map((p) => (
                <div key={p.id} className={`cal-chip ${p.status.toLowerCase()}`}>
                  {p.scheduledAt.slice(11, 16)} {p.platform || "Post"}
                </div>
              ))}
              {dayPosts.length > MAX_CHIPS && (
                <div className="cal-more">+{dayPosts.length - MAX_CHIPS} more</div>
              )}
            </div>
          );
        })}
      </div>

      <h3>Posts on {selected}</h3>
      {selectedPosts.length === 0 && <p className="muted">No posts scheduled for this day.</p>}
      {selectedPosts.map((p) => (
        <div key={p.id} className="post-card">
          <div className="post-head">
            <span className="platform">
              {p.scheduledAt.slice(11, 16)} · {p.platform || "No platform"}
            </span>
            <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span>
          </div>
          <p className="post-content">{p.content}</p>
          {p.status === "PUBLISHED" && (
            <div className="metrics">
              <span>👍 {p.likes}</span>
              <span>🔁 {p.shares}</span>
              <span>👁 {p.reach}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}