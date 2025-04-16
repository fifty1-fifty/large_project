import React, { useState } from "react";
import "./ProfileDetails.css";
import { User } from "../../types";
import UserListModal from "./UserListModal";
import { useNavigate } from "react-router-dom";

interface ProfileDetailsProps {
  userInfo: User | null;
  error: string;
  navigateToEdit?: () => void;
  showFollowButton?: boolean;
  isFollowing: boolean;
  onFollowToggle?: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ 
  userInfo, 
  error, 
  navigateToEdit,
  showFollowButton,
  isFollowing,
  onFollowToggle
}) => {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

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
            <div 
              className="stat-item clickable" 
              onClick={() => setShowFollowersModal(true)}
            >
              <span className="stat-value">{userInfo.followers ? userInfo.followers.length : 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div 
              className="stat-item clickable" 
              onClick={() => setShowFollowingModal(true)}
            >
              <span className="stat-value">{userInfo.following ? userInfo.following.length : 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          <div className="profile-actions">
            {navigateToEdit && (
              <button onClick={navigateToEdit} className="edit-profile-button">
                Edit Profile
              </button>
            )}
            {showFollowButton && onFollowToggle && (
              <button 
                onClick={onFollowToggle} 
                className={`follow-button ${isFollowing ? 'following' : ''}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}

      {showFollowersModal && (
        <UserListModal
          userIds={userInfo?.followers}
          title="Followers"
          onClose={() => setShowFollowersModal(false)}
          onUserClick={handleUserClick}
        />
      )}

      {showFollowingModal && (
        <UserListModal
          userIds={userInfo?.following}
          title="Following"
          onClose={() => setShowFollowingModal(false)}
          onUserClick={handleUserClick}
        />
      )}
    </div>
  );
};

export default ProfileDetails;
