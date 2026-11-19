
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  Search,
  PlusCircle,
} from "lucide-react";

import api from "../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints/my");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.complaints)
        ? data.complaints
        : Array.isArray(data.data)
        ? data.data
        : [];

      // Sort newest complaints first.
      list.sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });

      setComplaints(list);
    } catch (err) {
      console.error("Fetch complaints error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (complaint.title || "").toLowerCase().includes(searchText) ||
      (complaint.category || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString();
  };

  return (
    <div className="my-complaints-page">
      <header className="my-complaints-header">
        <div>
          <h2>College Complaint Management</h2>
          <p>Student Portal</p>
        </div>

        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={18} />
          Dashboard
        </Link>
      </header>

      <main className="my-complaints-container">
        <div className="my-complaints-title">
          <div>
            <h1>My Complaints</h1>
            <p>
              View and track all your submitted complaints.
            </p>
          </div>

          <Link
            to="/submit-complaint"
            className="primary-button"
          >
            <PlusCircle size={18} />
            New Complaint
          </Link>
        </div>

        <div className="complaints-summary">
          <div>
            <span>Total Complaints</span>
            <h2>{complaints.length}</h2>
          </div>

          <div>
            <span>Pending</span>
            <h2>{pending}</h2>
          </div>

          <div>
            <span>In Progress</span>
            <h2>{inProgress}</h2>
          </div>

          <div>
            <span>Resolved</span>
            <h2>{resolved}</h2>
          </div>
        </div>

        <section className="my-complaints-card">
          <div className="complaints-filter">
            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search by title or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="complaints-loading">
              Loading complaints...
            </p>
          ) : error ? (
            <p className="complaints-error">{error}</p>
          ) : filteredComplaints.length === 0 ? (
            <div className="no-complaints">
              <FileText size={45} />

              <h3>No complaints found</h3>

              <p>
                {complaints.length === 0
                  ? "You have not submitted any complaints yet."
                  : "Try changing your search or status filter."}
              </p>

              {complaints.length === 0 && (
                <Link
                  to="/submit-complaint"
                  className="primary-button"
                >
                  Submit Complaint
                </Link>
              )}
            </div>
          ) : (
            <div className="my-complaints-table-wrapper">
              <table className="my-complaints-table">
                <thead>
                  <tr>
                    <th>Complaint Title</th>
                    <th>Category</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="complaint-title-cell">
                        {complaint.title || "Untitled"}
                      </td>

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
                          View Details
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

export default MyComplaints;
