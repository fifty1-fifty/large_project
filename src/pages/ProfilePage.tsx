// ProfilePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/Profile/ProfileInfo";
import Background from "../components/Background"; // Import Background component

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_data") || "{}");

  return (
    <div>
      {/* Background component */}
      <Background />

      {/* Main Profile content */}
      <div className="profile-content">
        <h2>Profile</h2>

        {/* Profile Info Component */}
        <ProfileInfo
          firstName={user.firstName || ""}
          lastName={user.lastName || ""}
          email={user.email || ""}
        />

        {/* Edit Profile Button */}
        <div>
          <button onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
