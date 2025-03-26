import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfilePage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [picMessage, setPicMessage] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("user_data") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current profile data for editing
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile for editing");
        }

        const profileData = await response.json();
        setName(profileData.firstName);
        setEmail(profileData.email);
        setBio(profileData.bio || "");
        setProfilePic(profileData.profilePic);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/profile/${user.id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          bio,
          password,
          profilePic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
      navigate("/profile"); // Navigate back to profile page after successful update
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const postDetails = (pics: File) => {
    setPicMessage(""); // Clear previous messages
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const reader = new FileReader();
      reader.readAsDataURL(pics); // Convert image to base64
      reader.onloadend = () => {
        setProfilePic(reader.result as string); // Set base64 string as profilePic
      };
    } else {
      setPicMessage("Please select a valid image (JPEG or PNG).");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-profile-page" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          ></textarea>
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        {picMessage && <div style={{ color: "red", marginBottom: "15px" }}>{picMessage}</div>}
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="pic">Change Profile Picture</label>
          <input
            type="file"
            id="pic"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                postDetails(e.target.files[0]);
              }
            }}
            style={{ width: "100%" }}
          />
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
            borderRadius: "4px"
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
