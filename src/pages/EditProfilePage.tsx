import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define ProfileData with optional password and confirmPassword fields
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic: string;
  password?: string;  // Make password optional
  confirmPassword?: string;  // Make confirmPassword optional
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePic: "default.png",
    password: "",  // Initialize password as an empty string
    confirmPassword: "",  // Initialize confirmPassword as an empty string
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user ID from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null);
    }
  }, []);

  // Fetch user profile data when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data: Omit<ProfileData, "password" | "confirmPassword"> = await response.json();

        setProfileData({
          ...data,
          password: "",  // Clear password fields on load
          confirmPassword: "",
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle profile update submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { password, confirmPassword, ...updateData } = profileData;
      if (password) updateData.password = password;

      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update localStorage with the new profile data after a successful update
      const updatedProfile = {
        ...updateData,
        id: userId,
        password: "",  // Make sure password is not stored in localStorage
        confirmPassword: "",  // Make sure confirmPassword is not stored in localStorage
      };

      localStorage.setItem("user_data", JSON.stringify(updatedProfile));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile", { state: { updated: true } }), 1000);
    } catch (err: any) {
      setError(err.message);
    }

    setProfileData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
      {successMessage && <div style={{ color: "green", marginBottom: "15px" }}>{successMessage}</div>}

      <form onSubmit={submitHandler}>
        {["firstName", "lastName", "email"].map((field) => (
          <div key={field} className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              value={profileData[field as keyof ProfileData] || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {["password", "confirmPassword"].map((field) => (
          <div key={field} className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor={field}>{field === "password" ? "New Password" : "Confirm Password"}</label>
            <input
              type="password"
              id={field}
              value={profileData[field as keyof ProfileData] || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
