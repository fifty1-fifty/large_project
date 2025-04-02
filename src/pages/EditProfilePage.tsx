import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePic: "default.png",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [picMessage, setPicMessage] = useState<string | null>(null);

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

        const data = await response.json();
        setProfileData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          bio: data.bio || "",
          profilePic: data.profilePic,
        }));
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
      const { firstName, lastName, email, bio, password, profilePic } = profileData;
      const requestBody = { firstName, lastName, email, bio, profilePic };
      if (password) requestBody["password"] = password; // Only send password if updated

      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile", { state: { updated: true } }), 1000);
    } catch (err: any) {
      setError(err.message);
    }

    // Clear passwords after submission
    setProfileData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  // Handle profile picture upload
  const postDetails = (pics: File) => {
    setPicMessage(null);
    if (!pics || (pics.type !== "image/jpeg" && pics.type !== "image/png")) {
      setPicMessage("Please select a valid image (JPEG or PNG).");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(pics);
    reader.onloadend = () => {
      setProfileData((prev) => ({ ...prev, profilePic: reader.result as string }));
    };
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
      {successMessage && <div style={{ color: "#28a745", marginBottom: "15px" }}>{successMessage}</div>}

      <form onSubmit={submitHandler}>
        {["firstName", "lastName", "email"].map((field) => (
          <div key={field} className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor={field}>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              value={profileData[field]}
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
              value={profileData[field]}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="profilePic">Change Profile Picture</label>
          <input type="file" id="profilePic" onChange={(e) => e.target.files && postDetails(e.target.files[0])} />
          {picMessage && <div style={{ color: "red", marginTop: "5px" }}>{picMessage}</div>}
        </div>

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
