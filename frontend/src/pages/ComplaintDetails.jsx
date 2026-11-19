
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Clock,
  FileText,
  Paperclip,
} from "lucide-react";

import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaint = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/complaints/${id}`);

      const data = response.data;
      const complaintData =
        data.complaint || data.data || data;

      setComplaint(complaintData);
    } catch (err) {
      console.error("Complaint details error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load complaint details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "N/A"
      : parsedDate.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading">
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="details-error">
        <h2>{error || "Complaint not found"}</h2>

        <Link to="/my-complaints">
          Back to My Complaints
        </Link>
      </div>
    );
  }

  const history = Array.isArray(complaint.history)
    ? complaint.history
    : [];

  const attachment = complaint.attachment;

  const attachmentUrl =
    typeof attachment === "string"
      ? attachment.startsWith("http")
        ? attachment
        : `${api.defaults.baseURL.replace(/\/api\/?$/, "")}/${attachment.replace(/^\/+/, "")}`
      : attachment?.url || null;

  const isImage =
    typeof attachment === "string"
      ? /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment)
      : /\.(jpg|jpeg|png|gif|webp)$/i.test(
          attachment?.url || ""
        );

  return (
    <div className="complaint-details-page">
      <header className="details-header">
        <h1>Complaint Details</h1>

        <Link to="/my-complaints" className="back-link">
          <ArrowLeft size={17} />
          Back to My Complaints
        </Link>
      </header>

      <main className="details-container">
        <section className="details-card">
          <div className="details-title-row">
            <div>
              <h2>{complaint.title || "Untitled Complaint"}</h2>

              <p>
                Submitted on: {formatDate(complaint.createdAt)}
              </p>
            </div>

            <StatusBadge status={complaint.status} />
          </div>

          <div className="details-information">
            <div>
              <span>Category</span>
              <strong>{complaint.category || "N/A"}</strong>
            </div>

            <div>
              <span>Current Status</span>
              <strong>{complaint.status || "Pending"}</strong>
            </div>
          </div>

          <div className="details-description">
            <h3>
              <FileText size={19} />
              Description
            </h3>

            <p>
              {complaint.description ||
                "No description provided."}
            </p>
          </div>

          {attachmentUrl && (
            <div className="details-attachment">
              <h3>
                <Paperclip size={19} />
                Attached File
              </h3>

              {isImage && (
                <img
                  src={attachmentUrl}
                  alt="Complaint attachment"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                  }}
                />
              )}

              <a
                href={attachmentUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Attachment
              </a>
            </div>
          )}

          <div className="admin-remarks">
            <h3>Admin Remarks</h3>

            <p>
              {complaint.adminRemarks ||
                "No remarks have been added by the admin yet."}
            </p>
          </div>
        </section>

        <section className="history-card">
          <h2>
            <Clock size={21} />
            Complaint History
          </h2>

          {history.length === 0 ? (
            <p className="no-history">
              No additional history available yet.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div
                  className="history-item"
                  key={item._id || index}
                >
                  <div className="history-dot"></div>

                  <div className="history-content">
                    <h3>
                      {item.status || "Complaint updated"}
                    </h3>

                    <p>
                      {item.note ||
                        "Status history updated."}
                    </p>

                    <span>
                      {formatDate(item.at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ComplaintDetails;
