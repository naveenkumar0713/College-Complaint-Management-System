
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ClipboardList,
  LogOut,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    students: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      // Read statistics from the backend response
      const data = response.data.stats;

      setStats({
        totalComplaints: data.total ?? 0,
        pending: data.pending ?? 0,
        inProgress: data.inProgress ?? 0,
        resolved: data.resolved ?? 0,
        rejected: data.rejected ?? 0,
        students: data.students ?? 0,
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-page">
      <header className="admin-header">
        <div className="admin-brand">
          <LayoutDashboard size={25} />

          <div>
            <h2>College Complaint Management</h2>
            <p>Administration Portal</p>
          </div>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="admin-container">
        <section className="admin-welcome">
          <div>
            <span className="admin-label">ADMINISTRATOR</span>

            <h1>Welcome, {user?.name || "Admin"}!</h1>

            <p>
              Monitor student complaints and manage their resolution.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={fetchDashboard}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </section>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon total-icon">
              <FileText size={25} />
            </div>
            <div>
              <p>Total Complaints</p>
              <h2>{loading ? "..." : stats.totalComplaints}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon pending-icon">
              <Clock size={25} />
            </div>
            <div>
              <p>Pending</p>
              <h2>{loading ? "..." : stats.pending}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon progress-icon">
              <ClipboardList size={25} />
            </div>
            <div>
              <p>In Progress</p>
              <h2>{loading ? "..." : stats.inProgress}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon resolved-icon">
              <CheckCircle size={25} />
            </div>
            <div>
              <p>Resolved</p>
              <h2>{loading ? "..." : stats.resolved}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon rejected-icon">
              <XCircle size={25} />
            </div>
            <div>
              <p>Rejected</p>
              <h2>{loading ? "..." : stats.rejected}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon students-icon">
              <Users size={25} />
            </div>
            <div>
              <p>Total Students</p>
              <h2>{loading ? "..." : stats.students}</h2>
            </div>
          </div>
        </section>

        <section className="admin-actions-section">
          <div>
            <h2>Complaint Management</h2>
            <p>
              Review submitted complaints and update their status.
            </p>
          </div>

          <Link
            to="/admin/complaints"
            className="admin-manage-button"
          >
            <ClipboardList size={19} />
            Manage Complaints
          </Link>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
