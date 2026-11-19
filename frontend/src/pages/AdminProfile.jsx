
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { User, Mail, Shield, Lock } from "lucide-react";

function AdminProfile() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Admin Profile</h1>
              <p>View your account information.</p>
            </div>
          </div>

          <div className="profile-grid">
            <section className="profile-card">
              <div className="profile-avatar">
                <User size={45} />
              </div>

              <h2>{user?.name || "Administrator"}</h2>
              <p>{user?.email || "No email available"}</p>

              <span className="profile-role">
                <Shield size={15} />
                Administrator
              </span>

              <div className="profile-info">
                <p>
                  <strong>Account Role:</strong>{" "}
                  {user?.role || "admin"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {user?.email || "Not available"}
                </p>
              </div>
            </section>

            <section className="profile-card">
              <h2>Account Information</h2>

              <div className="form-group">
                <label>Full Name</label>

                <div className="profile-input">
                  <User size={18} />
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <div className="profile-input">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Type</label>

                <div className="profile-input">
                  <Shield size={18} />
                  <input
                    type="text"
                    value="Administrator"
                    disabled
                  />
                </div>
              </div>
            </section>

            <section className="profile-card">
              <h2>Security Information</h2>

              <div className="profile-avatar">
                <Lock size={40} />
              </div>

              <p>
                Your account is protected using password
                authentication and JWT login security.
              </p>

              <p>
                Password changes are currently unavailable
                because the backend does not have a password
                change endpoint.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminProfile;
