import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/Profile/ProfileInfo"; 

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_data") || "{}");

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Profile</h2>

              {/* Profile Info Component */}
              <ProfileInfo
                firstName={user.firstName || ""}
                lastName={user.lastName || ""}
                email={user.email || ""}
              />

              {/* Edit Profile Button */}
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={() => navigate("/edit-profile")}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
