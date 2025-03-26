import React, { useEffect, useState } from "react";
import { buildPath } from "../utils";
import ProfileInfo from "../components/Profile/ProfileInfo"; // Import ProfileInfo component

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null); // Holds user's profile info
  const [error, setError] = useState<string>("");
  const user = JSON.parse(localStorage.getItem("user_data") || "{}"); // Get current user info from localStorage

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(buildPath(`/api/profile/${user.id}`));
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const profileData = await response.json();
        setUserInfo(profileData);
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  // Error handling
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Welcome to Your Profile</h1>

      {/* Profile Info Component */}
      <ProfileInfo
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        email={userInfo.email}
        bio={userInfo.bio || "No bio available"}
        profilePic={userInfo.profilePic}
      />

      {/* Additional Profile Content */}
      <div className="followers-following">
        <div>
          <h3>Followers ({userInfo.followers.length})</h3>
          <ul>
            {userInfo.followers.map((follower: any, index: number) => (
              <li key={index}>{follower}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Following ({userInfo.following.length})</h3>
          <ul>
            {userInfo.following.map((following: any, index: number) => (
              <li key={index}>{following}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
