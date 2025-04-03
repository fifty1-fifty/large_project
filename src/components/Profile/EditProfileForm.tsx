import React, { useState, useEffect } from "react";
import "./EditProfileForm.css";

interface ProfileData {
  FirstName: string;
  LastName: string;
  Email: string;
  Bio: string;
}

interface EditProfileFormProps {
  userId: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ userId }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Bio: "",
  });

  const [originalData, setOriginalData] = useState<ProfileData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data: ProfileData = await response.json();
        setProfileData(data); // Populate form with fetched data
        setOriginalData(data); // Store original data for comparison
      } catch (err: any) {
        setError(err.message); // Handle errors (e.g., API issues)
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  // Check if any profile field has changed by comparing with the original data
  const hasProfileChanged = () => {
    return (
      profileData.FirstName !== originalData.FirstName ||
      profileData.LastName !== originalData.LastName ||
      profileData.Email !== originalData.Email ||
      profileData.Bio !== originalData.Bio
    );
  };

  // Handle form submission (update the profile)
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully!");
      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setTimeout(() => window.location.href = "/profile", 1000); // Redirect after success
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
        <div className="form-group">
          <label htmlFor="FirstName">First Name</label>
          <input
            type="text"
            id="FirstName"
            value={profileData.FirstName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="LastName">Last Name</label>
          <input
            type="text"
            id="LastName"
            value={profileData.LastName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            value={profileData.Email}
            onChange={handleChange}
          />
        </div>

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

export default EditProfileForm;
