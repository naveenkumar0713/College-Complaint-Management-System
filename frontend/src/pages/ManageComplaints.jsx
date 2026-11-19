
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  ClipboardList,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

function ManageComplaints() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [editData, setEditData] = useState({
    status: "Pending",
    adminRemarks: "",
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/complaints");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.complaints)
        ? data.complaints
        : Array.isArray(data.data)
        ? data.data
        : [];

      setComplaints(list);
    } catch (error) {
      console.error("Fetch complaints error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openUpdateForm = (complaint) => {
    setUpdatingId(complaint._id);

    setEditData({
      status: complaint.status || "Pending",
      adminRemarks: complaint.adminRemarks || "",
    });

    setMessage("");
  };

  const updateComplaint = async () => {
    if (!updatingId || saving) return;

    try {
      setSaving(true);
      setMessage("");

      await api.patch(`/complaints/${updatingId}`, {
        status: editData.status,
        adminRemarks: editData.adminRemarks,
      });

      setUpdatingId(null);
      setMessage("Complaint updated successfully.");

      await fetchComplaints();
    } catch (error) {
      console.error("Update complaint error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (complaint.title || "").toLowerCase().includes(searchText) ||
      (complaint.category || "").toLowerCase().includes(searchText) ||
      (
        complaint.student?.name ||
        complaint.studentName ||
        ""
      ).toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "N/A"
      : parsedDate.toLocaleDateString();
  };

  return (
    <div className="manage-complaints-page">
      <header className="manage-header">
        <div>
          <h1>Manage Complaints</h1>
          <p>View and manage student complaints</p>
        </div>

        <div className="manage-header-actions">
          <button
            onClick={fetchComplaints}
            className="refresh-button"
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="manage-container">
        <Link to="/admin" className="back-link">
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {message && (
          <div className="manage-message">
            {message}
          </div>
        )}

        <section className="manage-card">
          <div className="manage-card-heading">
            <div>
              <h2>
                <ClipboardList size={21} />
                All Complaints
              </h2>

              <p>
                {filteredComplaints.length} complaints found
              </p>
            </div>
          </div>

          <div className="manage-filters">
            <div className="manage-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search by title, category or student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="manage-loading">
              Loading complaints...
            </p>
          ) : filteredComplaints.length === 0 ? (
            <div className="manage-empty">
              <ClipboardList size={40} />
              <h3>No complaints found</h3>
              <p>
                There are no complaints matching your search.
              </p>
            </div>
          ) : (
            <div className="manage-table-wrapper">
              <table className="manage-table">
                <thead>
                  <tr>
                    <th>Complaint</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>
                        <strong>
                          {complaint.title || "Untitled"}
                        </strong>
                      </td>

                      <td>
                        {complaint.student?.name ||
                          complaint.studentName ||
                          "Student"}
                      </td>

                      <td>
                        {complaint.category || "N/A"}
                      </td>

                      <td>
                        {formatDate(
                          complaint.createdAt || complaint.date
                        )}
                      </td>

                      <td>
                        <StatusBadge status={complaint.status} />
                      </td>

                      <td>
                        <button
                          className="manage-update-button"
                          onClick={() => openUpdateForm(complaint)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {updatingId && (
          <section className="update-complaint-card">
            <h2>Update Complaint Status</h2>

            <label>Complaint Status</label>

            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label>Admin Remarks</label>

            <textarea
              rows="4"
              placeholder="Enter remarks for the student..."
              value={editData.adminRemarks}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  adminRemarks: e.target.value,
                })
              }
            />

            <div className="update-form-actions">
              <button
                className="save-update-button"
                onClick={updateComplaint}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="cancel-update-button"
                onClick={() => setUpdatingId(null)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ManageComplaints;
