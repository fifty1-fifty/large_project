import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Profile";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const storedUser = localStorage.getItem("user_data");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const userId = user?.id;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const profileData = await response.json();
        setUserInfo(profileData);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [userId, location]);

  const navigateToEdit = () => {
    navigate("/edit");
  };

  return (
    <div className="profile-page container">
      <h1 className="profile-heading">Profile</h1>
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
            <button
              onClick={navigateToEdit}
              className="profile-edit-button"
            >
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

export default ProfilePage;
