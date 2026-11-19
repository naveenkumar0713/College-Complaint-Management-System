
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ManageComplaints from "./pages/ManageComplaints";
import AdminProfile from "./pages/AdminProfile";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        Loading application...
      </div>
    );
  }

  const homePath = user
    ? user.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={homePath} replace />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to={homePath} replace />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to={homePath} replace />
              : <Register />
          }
        />

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<ManageComplaints />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
