import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import "../components/Profile/ProfileDetails.css";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const storedUser = localStorage.getItem("user_data");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const userId = user?.id;
  const token = user?.Token;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/profile/${userId}`, 
                                    headers: {
                                    Authorization: token});
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
    <ProfileDetails
      userInfo={userInfo}
      error={error}
      navigateToEdit={navigateToEdit}
    />
  );
};

export default ProfilePage;
