import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Import to handle navigation
import { Button, Row, Col } from 'react-bootstrap';

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
  const history = useHistory(); // Used for navigation

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

  const submitHandler = async (e: React.FormEvent) => {
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
      history.push("/profile"); // Navigate back to profile page after successful update
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const postDetails = (pics: any) => {
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
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <Row>
        <Col md={6}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            {picMessage && <div style={{ color: "red" }}>{picMessage}</div>}
            <Form.Group controlId="pic">
              <Form.Label>Change Profile Picture</Form.Label>
              <Form.File
                onChange={(e) => postDetails(e.target.files[0])}
                id="custom-file"
                label="Upload Profile Picture"
                custom
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default EditProfilePage;
