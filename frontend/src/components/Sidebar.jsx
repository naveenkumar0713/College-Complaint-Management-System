
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Settings,
  UserCircle
} from "lucide-react";

function Sidebar({ role = "student" }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        {role === "admin" ? "Admin Panel" : "Student Panel"}
      </div>

      <nav className="sidebar-menu">
        {role === "student" ? (
          <>
            <NavLink to="/dashboard">
              <LayoutDashboard size={19} />
              Dashboard
            </NavLink>

            <NavLink to="/submit-complaint">
              <FilePlus size={19} />
              Submit Complaint
            </NavLink>

            <NavLink to="/my-complaints">
              <ClipboardList size={19} />
              My Complaints
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/admin">
              <LayoutDashboard size={19} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/complaints">
              <Settings size={19} />
              Manage Complaints
            </NavLink>

            <NavLink to="/admin/profile">
              <UserCircle size={19} />
              Admin Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
