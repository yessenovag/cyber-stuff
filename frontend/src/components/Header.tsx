import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">CyberSafe</div>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register" className="btn-outline">Register</Link>
      </nav>
    </header>
  );
}
