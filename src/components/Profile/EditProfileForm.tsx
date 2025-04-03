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
        setProfileData(data); 
        setOriginalData(data); 
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  // Check if any profile field has changed
  const hasProfileChanged = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("FirstName", profileData.FirstName);
      formData.append("LastName", profileData.LastName);
      formData.append("Email", profileData.Email);
      formData.append("Bio", profileData.Bio);

      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully!");

      // Update local storage
      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setTimeout(() => window.location.href = "/profile", 1000);
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
