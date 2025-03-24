// ProfileInfo.tsx
import React from "react";
import "./ProfileInfo.css"; 

interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ firstName, lastName, email }) => {
  return (
    <div className="profile-info-card">
      <div className="profile-info-section">
        <strong className="profile-info-label">First Name:</strong>
        <p className="profile-info-value">{firstName}</p>
      </div>
      <div className="profile-info-section">
        <strong className="profile-info-label">Last Name:</strong>
        <p className="profile-info-value">{lastName}</p>
      </div>
      <div className="profile-info-section">
        <strong className="profile-info-label">Email:</strong>
        <p className="profile-info-value">{email}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
