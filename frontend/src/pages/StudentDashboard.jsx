
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  LogOut,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints/my");
      const data = response.data;

      const complaintList = Array.isArray(data)
        ? data
        : Array.isArray(data.complaints)
        ? data.complaints
        : Array.isArray(data.data)
        ? data.data
        : [];

      // Show newest complaints first.
      complaintList.sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });

      setComplaints(complaintList);
    } catch (err) {
      console.error("Error fetching complaints:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load complaints. Please try again."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString();
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h2>College Complaint Management</h2>
          <p>Student Portal</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="dashboard-container">
        <section className="welcome-section">
          <div>
            <h1>
              Welcome, {user?.name || "Student"}!
            </h1>

            <p>
              Track and manage your college complaints from your dashboard.
            </p>
          </div>

          <Link
            to="/submit-complaint"
            className="primary-button"
          >
            <PlusCircle size={19} />
            Submit Complaint
          </Link>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FileText size={25} />
            </div>

            <div>
              <p>Total Complaints</p>
              <h2>{loading ? "..." : complaints.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock size={25} />
            </div>

            <div>
              <p>Pending</p>
              <h2>{loading ? "..." : pending}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <AlertCircle size={25} />
            </div>

            <div>
              <p>In Progress</p>
              <h2>{loading ? "..." : inProgress}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle size={25} />
            </div>

            <div>
              <p>Resolved</p>
              <h2>{loading ? "..." : resolved}</h2>
            </div>
          </div>
        </section>

        <section className="complaints-section">
          <div className="section-heading">
            <div>
              <h2>Recent Complaints</h2>
              <p>View the latest complaints you submitted.</p>
            </div>

            <Link
              to="/my-complaints"
              className="view-all-link"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="empty-message">
              Loading complaints...
            </p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <FileText size={42} />

              <h3>No complaints yet</h3>

              <p>
                You have not submitted any complaints.
              </p>

              <Link
                to="/submit-complaint"
                className="primary-button"
              >
                Submit Your First Complaint
              </Link>
            </div>
          ) : (
            <div className="complaints-table-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id}>
                      <td>{complaint.title || "Untitled"}</td>

                      <td>{complaint.category || "N/A"}</td>

                      <td>{formatDate(complaint.createdAt)}</td>

                      <td>
                        <span
                          className={`status-badge ${(
                            complaint.status || "Pending"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/complaints/${complaint._id}`}
                          className="details-link"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
