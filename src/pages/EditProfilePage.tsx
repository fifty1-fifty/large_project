import React, { useState, useEffect, useMemo } from "react";
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
  // Parse localStorage once and memoize the userId
  const userId = useMemo(() => {
    const storedUser = localStorage.getItem("user_data");
    const user = storedUser ? JSON.parse(storedUser) : {};
    return user?.id;
  }, []);



  useEffect(() => {
    if (!userId) return;
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile for editing");
        }
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

    // Clear any previous messages
    setError("");
    setSuccessMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`/api/profile/${userId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, bio, password, profilePic }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
    
      const updatedProfile = await response.json();

      // Update localStorage with new profile info
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          id: userId,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          email: updatedProfile.email,
          bio: updatedProfile.bio,
          password: updatedProfile.password,
          profilePicture: updatedProfile.profilePicture
        })
      );

      setSuccessMessage("Successful profile update!");
      

      // Redirect to profile page
       setTimeout(() => {
        navigate("/profile"); 
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
    <div
      className="edit-profile-page"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
    >
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>}
      {successMessage && <div style={{  color: "#28a745", marginBottom: "15px" }}>{successMessage}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
            rows={3}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          ></textarea>
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        {picMessage && (
          <div style={{ color: "red", marginBottom: "15px" }}>{picMessage}</div>
        )}
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
