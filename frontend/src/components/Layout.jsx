
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-layout">
        <Sidebar role={user?.role} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
