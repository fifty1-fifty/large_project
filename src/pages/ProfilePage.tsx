import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Read user data from localStorage once and extract the user ID
  const storedUser = localStorage.getItem("user_data");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const userId = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return; // If there's no user ID, do nothing.

    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const profileData = await response.json();
        setUserInfo(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]); // Depend on userId instead of the full user object

  const navigateToEdit = () => {
    navigate("/edit");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page container mt-5">
      <h1 className="text-center mb-4">User Profile</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {userInfo ? (
        <div className="profile-info text-center">
          <div>
            {userInfo.profilePic && (
              <img
                src={userInfo.profilePic}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "150px", height: "150px" }}
              />
            )}
          </div>
          <h3>{userInfo.firstName} {userInfo.lastName}</h3>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Bio:</strong> {userInfo.bio}</p>
          <button
            onClick={navigateToEdit}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
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
