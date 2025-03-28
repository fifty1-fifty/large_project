import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [picMessage, setPicMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  // Load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null);
    }
  }, []);

  // Fetch user profile data when userId is set
  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        console.log("Fetching profile for user:", userId);
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const profileData = await response.json();
        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setEmail(profileData.email);
        setBio(profileData.bio || "");
        setProfilePic(profileData.profilePic);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [userId]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Submitting update request with data:", {
        firstName,
        lastName,
        email,
        bio,
        password,
        profilePic,
      });

      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, bio, password, profilePic }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();

      // Update localStorage with new profile info
      const updatedUserData = {
        id: userId,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        bio: updatedProfile.bio,
        profilePic: updatedProfile.profilePic,
      };

      localStorage.setItem("user_data", JSON.stringify(updatedUserData));
      console.log("Updated localStorage:", updatedUserData);

      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        navigate("/profile", { state: { updated: true } }); // Redirect with state
      }, 1000);

      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const postDetails = (pics: File) => {
    setPicMessage("");
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const reader = new FileReader();
      reader.readAsDataURL(pics);
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
    } else {
      setPicMessage("Please select a valid image (JPEG or PNG).");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
      {successMessage && <div style={{ color: "#28a745", marginBottom: "15px" }}>{successMessage}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="pic">Change Profile Picture</label>
          <input
            type="file"
            id="pic"
            onChange={(e) => e.target.files && postDetails(e.target.files[0])}
            style={{ width: "100%" }}
          />
        </div>
        {picMessage && <div style={{ color: "red", marginBottom: "15px" }}>{picMessage}</div>}
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
