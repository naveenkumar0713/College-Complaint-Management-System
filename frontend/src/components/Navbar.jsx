
import { Link, useNavigate } from "react-router-dom";
import { LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
   navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <GraduationCap size={27} />
        <span>College CMS</span>
      </Link>

      <div className="navbar-user">
        {user && (
          <>
            <span>{user.name}</span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
