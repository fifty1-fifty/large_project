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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load user ID and profile from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null);

      // If localStorage has profile data, use it
      setProfileData({
        FirstName: user.FirstName || "",
        LastName: user.LastName || "",
        Email: user.Email || "",
        Bio: user.Bio || "",
        ProfilePic: user.ProfilePic || "default.png",
      });

      setOriginalProfile(user);
      console.log("Loaded profile from localStorage:", user);
    }
  }, []);

  // Fetch user profile data from API only if needed
  useEffect(() => {
    if (!userId || originalProfile) return;

    console.log("Fetching profile for userId:", userId);
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data: ProfileData = await response.json();
        console.log("Fetched profile data:", data);

        setProfileData(data);
        setOriginalProfile(data);

        // Update localStorage so it persists
        localStorage.setItem("user_data", JSON.stringify({ ...data, id: userId }));
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
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle profile picture upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set preview of image
      };
      reader.readAsDataURL(file);

      setProfileData((prev) => ({
        ...prev,
        ProfilePic: file.name, // Store the file name or URL
      }));
    }
  };

  // Check if profile data has changed
  const hasProfileChanged = () => JSON.stringify(profileData) !== JSON.stringify(originalProfile);

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!hasProfileChanged()) {
      setError("No changes detected.");
      return;
    }

    const formData = new FormData();

    // Append profile data
    formData.append("FirstName", profileData.FirstName);
    formData.append("LastName", profileData.LastName);
    formData.append("Email", profileData.Email);
    formData.append("Bio", profileData.Bio);

    // Send ProfilePic if there's a file uploaded
    if (e.target instanceof HTMLFormElement && e.target.ProfilePic.files[0]) {
      formData.append("ProfilePic", e.target.ProfilePic.files[0]);
    }

    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        body: formData, // Send form data which includes the profile pic
      });

      if (!response.ok) throw new Error("Failed to update profile");

      console.log("Profile updated successfully!");

      // Update localStorage with new profile data
      localStorage.setItem("user_data", JSON.stringify({ ...profileData, id: userId }));

      setSuccessMessage("Profile updated successfully!");
      setOriginalProfile(profileData);

      // Redirect to profile page after 1 second
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
        {["First Name", "Last Name", "Email"].map((field) => (
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

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="ProfilePic">Profile Picture</label>
          <input
            type="file"
            id="ProfilePic"
            accept="image/*"
            onChange={handleFileChange}
            style={{ padding: "8px" }}
          />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: "15px" }}>
            <img
              src={imagePreview}
              alt="Profile Preview"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        )}

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
