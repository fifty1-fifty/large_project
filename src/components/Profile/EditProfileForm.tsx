import React from "react";
import "./EditProfileForm.css";

interface ProfileData {
  FirstName: string;
  LastName: string;
  Email: string;
  Bio: string;
}

interface EditProfileFormProps {
  profileData: ProfileData;
  error: string | null;
  successMessage: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  hasProfileChanged: () => boolean;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profileData,
  error,
  successMessage,
  handleChange,
  submitHandler,
  hasProfileChanged,
}) => {
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

export default EditProfileForm;
