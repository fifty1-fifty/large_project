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
  const [formData, setFormData] = useState<FormData>(new FormData());
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

        setOriginalData(data); 
        const newFormData = new FormData();
        newFormData.set("FirstName", data.FirstName);
        newFormData.set("LastName", data.LastName);
        newFormData.set("Email", data.Email);
        newFormData.set("Bio", data.Bio);

        setFormData(newFormData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updatedFormData = new FormData(formData);
    updatedFormData.set(id, value);
    setFormData(updatedFormData);
  };

  // Check if any profile field has changed
  const hasProfileChanged = () => {
    return (
      formData.get("FirstName") !== originalData.FirstName ||
      formData.get("LastName") !== originalData.LastName ||
      formData.get("Email") !== originalData.Email ||
      formData.get("Bio") !== originalData.Bio
    );
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        body: formData, 
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully!");

      // Update local storage
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          FirstName: formData.get("FirstName"),
          LastName: formData.get("LastName"),
          Email: formData.get("Email"),
          Bio: formData.get("Bio"),
          id: userId,
        })
      );

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
            value={formData.get("FirstName")?.toString() || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="LastName">Last Name</label>
          <input
            type="text"
            id="LastName"
            value={formData.get("LastName")?.toString() || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            value={formData.get("Email")?.toString() || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Bio">Bio</label>
          <textarea
            id="Bio"
            value={formData.get("Bio")?.toString() || ""}
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
