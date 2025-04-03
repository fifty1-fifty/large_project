import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Profile.css";  // Import the Profile.css file

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
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={submitHandler} className="profile-form">
        {[{ label: "First Name", key: "FirstName" }, { label: "Last Name", key: "LastName" }, { label: "Email", key: "Email" }].map(({ label, key }) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{label}</label>
            <input
              type={key === "Email" ? "email" : "text"}
              id={key}
              value={profileData[key as keyof ProfileData] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="Bio">Bio</label>
          <textarea
            id="Bio"
            value={profileData.Bio}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="update-profile-button"
          disabled={!hasProfileChanged()}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
