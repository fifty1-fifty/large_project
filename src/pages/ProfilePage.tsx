import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Read user data from localStorage once and extract the user ID
  const storedUser = localStorage.getItem("user_data");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const userId = user?.id;

  const navigate = useNavigate();

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
  }, [userId]);

  const navigateToEdit = () => {
    navigate("/edit");
  };

  return (
    <div
      className="profile-page container"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {userInfo ? (
        <div className="profile-header" style={{ textAlign: "left" }}>
          {userInfo.profilePic && (
            <img
              src={userInfo.profilePic}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            />
          )}
          <h3 style={{ margin: "0 0 10px 0" }}>
            {userInfo.firstName} {userInfo.lastName}
          </h3>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Bio:</strong> {userInfo.bio}
          </p>
          {/* Optional Edit button */}
          <button
            onClick={navigateToEdit}
            style={{
              marginTop: "20px",
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
      ) : (
        <div>No profile information available</div>
      )}
    </div>
  );
};

export default ProfilePage;
