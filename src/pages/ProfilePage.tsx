import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    function loadProfile() {
      const storedUser = localStorage.getItem("user_data");
      const user = storedUser ? JSON.parse(storedUser) : null;
      setUserInfo(user);
    }

    loadProfile(); 

    async function fetchProfile() {
      try {
        const storedUser = localStorage.getItem("user_data");
        const user = storedUser ? JSON.parse(storedUser) : {};
        const userId = user?.id;

        if (!userId) return; // Prevent API call if no user

        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const profileData = await response.json();
        setUserInfo(profileData);

        localStorage.setItem("user_data", JSON.stringify(profileData));
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, []); 

  
  const navigateToEdit = () => {
    navigate("/edit");
  };

  return (
    <div className="profile-page container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}></h1>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {userInfo ? (
        <>
          <div className="profile-header" style={{ textAlign: "center" }}>
            <img
              src={userInfo.profilePic || "default.png"}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h3>{userInfo.firstName} {userInfo.lastName}</h3>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Bio:</strong> {userInfo.bio || "No bio yet"}</p>
          </div>

          <div
            className="followers-following"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "50px",
              gap: "50px",
            }}
          >
            <div className="followers" style={{ textAlign: "center" }}>
              <h4>Followers</h4>
              <p>{userInfo.followers ? userInfo.followers.length : 0}</p>
            </div>
            <div className="following" style={{ textAlign: "center" }}>
              <h4>Following</h4>
              <p>{userInfo.following ? userInfo.following.length : 0}</p>
            </div>
          </div>

    
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={navigateToEdit}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Edit Profile
            </button>
          </div>
        </>
      ) : (
        <div>No profile information available</div>
      )}
    </div>
  );
};

export default ProfilePage;
