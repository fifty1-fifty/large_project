import React from "react";
import "./ProfileDetails.css";
import { User } from "../../types";

interface ProfileDetailsProps {
  userInfo: User;
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
            <div className="profile-pic">
              {userInfo.profilePic ? (
                <img src={userInfo.profilePic} alt="Profile" />
              ) : (
                <div className="default-pic">
                  {userInfo.firstName[0]}{userInfo.lastName[0]}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="profile-email">{userInfo.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{userInfo.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{userInfo.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat">
              <span className="stat-value">{userInfo.Collection?.length || 0}</span>
              <span className="stat-label">Movies</span>
            </div>
          </div>

          {userInfo.bio && (
            <div className="profile-bio">
              <p>{userInfo.bio}</p>
            </div>
          )}

          <div className="profile-actions">
            <button onClick={navigateToEdit} className="edit-button">
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
