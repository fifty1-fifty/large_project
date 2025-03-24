// ProfilePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/Profile/ProfileInfo"; 
import "./index.css"; 

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_data") || "{}");

  return (
    <div>
      <div>
        <h2>Profile</h2>
      </div>

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
  );
};

export default ProfilePage;
