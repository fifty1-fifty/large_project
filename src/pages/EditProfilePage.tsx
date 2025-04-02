import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePic: string;
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
  });

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
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

        const data: ProfileData = await response.json();
        setProfileData(data);
        setOriginalProfile(data); // Store original profile for change detection
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes (updates state only)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  // Check if profile data has changed
  const hasProfileChanged = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfile);
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Prevent submission if nothing has changed
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

      // Update localStorage with new profile data
      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setSuccessMessage("Profile updated successfully!");
      setOriginalProfile(profileData); // Update original profile after saving
      setTimeout(() => navigate("/profile", { state: { updated: true } }), 1000);
    } catch (err: any) {
      setError(err.message);
    }
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

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: hasProfileChanged() ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
          disabled={!hasProfileChanged()}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
