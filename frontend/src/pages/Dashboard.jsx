import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h2>Welcome, {user?.username} 👋</h2>
      <p className="muted">Here is what you can do:</p>

      <div className="grid">
        <Link to="/composer" className="tile">
          <h3>✍️ Composer</h3>
          <p>Write a post, save it as a draft or schedule it.</p>
        </Link>
        <Link to="/calendar" className="tile">
          <h3>📅 Calendar</h3>
          <p>See your scheduled posts by date.</p>
        </Link>
        <Link to="/analytics" className="tile">
          <h3>📊 Analytics</h3>
          <p>Track likes, shares and reach.</p>
        </Link>
      </div>
    </div>
  );
}