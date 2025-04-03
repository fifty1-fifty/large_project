import React from "react";
import "./ProfileDetails.css";

interface ProfileDetailsProps {
  userInfo: any;
  error: string;
  navigateToEdit: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userInfo, error, navigateToEdit }) => {
  return (
    <div className="profile-page container">
      <h1 className="profile-heading"></h1>
      {error && <div className="error-message">Error: {error}</div>}
      {userInfo ? (
        <>
          <div className="profile-header">
            <h3>
              {userInfo.firstName} {userInfo.lastName}
            </h3>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Bio:</strong> {userInfo.bio}
            </p>
          </div>

          <div className="followers-following">
            <div className="followers">
              <h4>Followers</h4>
              <p>{userInfo.followers ? userInfo.followers.length : 0}</p>
              {userInfo.followers && userInfo.followers.length > 0 && (
                <div className="followers-list">
                  {userInfo.followers.map((follower: string, index: number) => (
                    <span key={index}>{follower}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="following">
              <h4>Following</h4>
              <p>{userInfo.following ? userInfo.following.length : 0}</p>
              {userInfo.following && userInfo.following.length > 0 && (
                <div className="following-list">
                  {userInfo.following.map((following: string, index: number) => (
                    <span key={index}>{following}</span>
                  ))}
                </div>
              )}
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
