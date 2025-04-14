import React from "react";
import "./ProfileDetails.css";
import { User } from "../../types";

interface ProfileDetailsProps {
  userInfo: User | null;
  error: string;
  navigateToEdit: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userInfo, error, navigateToEdit }) => {
  return (
    <div className="profile-page">
      <h1 className="profile-heading"></h1>
      {error && <div className="error-message">Error: {error}</div>}
      {userInfo ? (
        <>
          <div className="profile-header">
            <h3>
              {userInfo.firstName} {userInfo.lastName}
            </h3>
            <p>
              {userInfo.email}
            </p>
            <p>
              {userInfo.bio}
            </p>
          </div>

          <div className="followers-following">
            <div className="followers">
              <h4>Followers</h4>
              <p>{userInfo.followers ? userInfo.followers.length : 0}</p>
            </div>
            <div className="following">
              <h4>Following</h4>
              <p>{userInfo.following ? userInfo.following.length : 0}</p>
            </div>
          </div>

          <div className="edit-profile-container">
            <button onClick={navigateToEdit} className="profile-edit-button">
              Edit Profile
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileDetails;
