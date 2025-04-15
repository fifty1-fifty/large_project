import React from "react";
import "./ProfilePage.css";

// Define the interface for ProfileInfoProps
interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic?: string; // Optional profile picture
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ firstName, lastName, email, bio, profilePic }) => {
  return (
    <div className="profile-info-container">
      {/* Profile Picture */}
      <div className="profile-pic-container">
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="profile-pic" />
        ) : (
          <div className="default-pic">No profile picture</div>
        )}
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <h2 className="profile-name">
          {firstName} {lastName}
        </h2>

        <div className="profile-info-item">
          <strong>Email:</strong>
          <p>{email}</p>
        </div>

        <div className="profile-info-item">
          <strong>Bio:</strong>
          <p>{bio || "No bio available"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
