
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  FileText,
  Upload,
} from "lucide-react";

import api from "../services/api";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError("");

    if (!file) {
      setAttachment(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select an image or PDF file.");
      e.target.value = "";
      setAttachment(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB.");
      e.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a complaint category.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("description", form.description.trim());

      if (attachment) {
        formData.append("attachment", attachment);
      }

      // Axios automatically sets the multipart boundary.
      await api.post("/complaints", formData);

      alert("Complaint submitted successfully!");

      navigate("/my-complaints");
    } catch (err) {
      console.error("Submit complaint error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="complaint-form-page">
      <div className="form-topbar">
        <Link to="/dashboard">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>

      <div className="complaint-form-card">
        <div className="form-icon">
          <FileText size={30} />
        </div>

        <h1>Submit a Complaint</h1>

        <p className="form-description">
          Please provide accurate details about your complaint.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Complaint Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter complaint title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Complaint Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Classroom">Classroom</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Hostel">Hostel</option>
            <option value="Library">Library</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Faculty">Faculty</option>
            <option value="Transportation">Transportation</option>
            <option value="Canteen">Canteen</option>
            <option value="Electrical">Electrical</option>
            <option value="Other">Other</option>
          </select>

          <label>Complaint Description</label>

          <textarea
            name="description"
            placeholder="Explain your complaint in detail..."
            rows="6"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Attachment (Optional)</label>

          <div className="file-upload">
            <Upload size={20} />

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
            />
          </div>

          {attachment && (
            <p className="selected-file">
              Selected file: {attachment.name}
            </p>
          )}

          <button
            className="primary-btn"
            type="submit"
            disabled={submitting}
          >
            <Send size={18} />
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitComplaint;
