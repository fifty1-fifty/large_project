import React from 'react';
import './FriendProfile.css';

interface FriendProfileProps {
  friendInfo: any;
  error: string;
  isFollowing: boolean;
  followButton: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ friendInfo, error, isFollowing, followButton}) => {
    return (
        <div className="profile-page container">
      <h1 className="profile-heading"></h1>
      {error && <div className="error-message">Error: {error}</div>}
      {friendInfo ? (
        <>
          <div className="profile-header">
            <h3>
              {friendInfo.firstName} {friendInfo.lastName}
            </h3>
            <p>
              <strong>Bio:</strong> {friendInfo.bio}
            </p>
          </div>

          <div className="followers-following">
            <div className="followers">
              <h4>Followers</h4>
              <p>{friendInfo.followers ? friendInfo.followers.length : 0}</p>
              {friendInfo.followers && friendInfo.followers.length > 0 && (
                <div className="followers-list">
                  {friendInfo.followers.map((follower: string, index: number) => (
                    <span key={index}>{follower}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="following">
              <h4>Following</h4>
              <p>{friendInfo.following ? friendInfo.following.length : 0}</p>
              {friendInfo.following && friendInfo.following.length > 0 && (
                <div className="following-list">
                  {friendInfo.following.map((following: string, index: number) => (
                    <span key={index}>{following}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="edit-profile-container">
            <button onClick={followButton} className="profile-edit-button">
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    );
};

export default FriendProfile;