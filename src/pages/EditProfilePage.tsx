import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../components/Profile/EditProfileForm";
import "../components/Profile/EditProfileForm.css";

interface ProfileData {
  FirstName: string;
  LastName: string;
  Email: string;
  Bio: string;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Bio: "",
  });
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null);
      setProfileData(user);
      setOriginalProfile(user);
    }
  }, []);

  useEffect(() => {
    if (!userId || originalProfile) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data: ProfileData = await response.json();
        setProfileData(data);
        setOriginalProfile(data);

        localStorage.setItem("user_data", JSON.stringify({ ...data, id: userId }));
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const hasProfileChanged = () => JSON.stringify(profileData) !== JSON.stringify(originalProfile);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!hasProfileChanged()) {
      setError("No changes detected.");
      return;
    }

    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setSuccessMessage("Profile updated successfully!");
      setOriginalProfile(profileData);

      setTimeout(() => navigate("/profile", { state: { updated: true } }), 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <EditProfileForm
      profileData={profileData}
      error={error}
      successMessage={successMessage}
      handleChange={handleChange}
      submitHandler={submitHandler}
      hasProfileChanged={hasProfileChanged}
    />
  );
};

export default EditProfilePage;
