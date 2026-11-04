import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">SocialHub</span>
      <div className="links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/composer">Composer</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </div>
      <div className="user">
        <span>{user?.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}