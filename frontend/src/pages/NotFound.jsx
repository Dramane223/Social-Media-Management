import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>404</h2>
      <p className="muted">This page does not exist.</p>
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}