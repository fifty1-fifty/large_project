import React, { useState, useEffect } from "react";
import "./EditProfileForm.css";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic?: string;
}

interface EditProfileFormProps {
  userId: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ userId }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  const [originalData, setOriginalData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId);
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data = await response.json();
        console.log('Profile data received:', data);
        
        setProfileData(data); 
        setOriginalData(data); 
      } catch (err: any) {
        console.error('Error fetching profile:', err);
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

  // Check if any profile field has changed by comparing with the original data
  const hasProfileChanged = () => {
    return (
      profileData.firstName !== originalData.firstName ||
      profileData.lastName !== originalData.lastName ||
      profileData.email !== originalData.email ||
      profileData.bio !== originalData.bio
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
        body: JSON.stringify({
          FirstName: profileData.firstName,
          LastName: profileData.lastName,
          Email: profileData.email,
          Bio: profileData.bio
        }),
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
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={profileData.firstName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={profileData.lastName} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profileData.bio} 
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
