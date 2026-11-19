
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.studentId.trim()) {
      setError("Please enter your student ID.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const registrationData = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        studentId: form.studentId.trim(),
      };

      await register(registrationData);

      alert("Registration successful! Please login.");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-icon">
          <GraduationCap size={38} />
        </div>

        <h1>Student Registration</h1>

        <p className="auth-subtitle">
          Create your student account
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <div className="input-group">
            <User size={18} />

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <label>Email Address</label>

          <div className="input-group">
            <Mail size={18} />

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <label>Student ID</label>

          <div className="input-group">
            <Hash size={18} />

            <input
              type="text"
              name="studentId"
              placeholder="Enter student ID"
              value={form.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <label>Department</label>

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">
              Computer Science
            </option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Electronics">
              Electronics
            </option>
            <option value="Mechanical">
              Mechanical
            </option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Other">Other</option>
          </select>

          <label>Password</label>

          <div className="input-group">
            <Lock size={18} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <button
            className="primary-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
