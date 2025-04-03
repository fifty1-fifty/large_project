import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  FirstName: string;
  LastName: string;
  Email: string;
  Bio: string;
  ProfilePic: string;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Bio: "",
    ProfilePic: "default.png",
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
      console.log("User ID set from localStorage:", user?.id);
    }
  }, []);

  // Fetch user profile data when userId is available
  useEffect(() => {
    if (!userId) return;

    console.log("Fetching profile for userId:", userId);
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data: ProfileData = await response.json();
        console.log("Fetched profile data:", data);

        setProfileData({
          FirstName: data.FirstName || "",
          LastName: data.LastName || "",
          Email: data.Email || "",
          Bio: data.Bio || "",
          ProfilePic: data.ProfilePic || "default.png",
        });

        setOriginalProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err.message);
        setError(err.message);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    console.log(`Updating field '${id}' to:`, value);
    
    setProfileData((prev) => ({
      ...prev,
      [id]: value, // Correct case-sensitive property update
    }));
  };

  // Check if profile data has changed
  const hasProfileChanged = () => {
    const changed = JSON.stringify(profileData) !== JSON.stringify(originalProfile);
    console.log("Profile changed?", changed);
    return changed;
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!hasProfileChanged()) {
      setError("No changes detected.");
      console.log("No changes detected, submission blocked.");
      return;
    }

    console.log("Submitting updated profile:", profileData);
    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      console.log("Profile updated successfully!");

      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setSuccessMessage("Profile updated successfully!");
      setOriginalProfile(profileData);
      setTimeout(() => navigate("/profile", { state: { updated: true } }), 1000);
    } catch (err: any) {
      console.error("Error updating profile:", err.message);
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
      {successMessage && <div style={{ color: "green", marginBottom: "15px" }}>{successMessage}</div>}

      <form onSubmit={submitHandler}>
        {["FirstName", "LastName", "Email"].map((field) => (
          <div key={field} className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor={field}>{field}</label>
            <input
              type={field === "Email" ? "email" : "text"}
              id={field}
              value={profileData[field as keyof ProfileData] || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="Bio">Bio</label>
          <textarea
            id="Bio"
            value={profileData.Bio}
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
