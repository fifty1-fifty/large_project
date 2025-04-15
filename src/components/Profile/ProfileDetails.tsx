import React from "react";
import "./ProfileDetails.css";
import { User } from "../../types";

interface ProfileDetailsProps {
  userInfo: User | null;
  error: string;
  navigateToEdit: () => void;
  onCollectionClick: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userInfo, error, navigateToEdit, onCollectionClick }) => {
  return (
    <div className="profile-details">
      {error && <div className="error-message">Error: {error}</div>}
      {userInfo ? (
        <div className="profile-content">
          <div className="profile-header">
            <h2 className="profile-name">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            {userInfo.bio && <p className="profile-bio">{userInfo.bio}</p>}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userInfo.followers ? userInfo.followers.length : 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userInfo.following ? userInfo.following.length : 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={navigateToEdit} className="edit-profile-button">
              Edit Profile
            </button>
            <button onClick={onCollectionClick} className="collection-button">
              My Collection
            </button>
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default ProfileDetails;
