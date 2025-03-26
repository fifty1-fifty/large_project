import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; 
import { Button, Row, Col } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>(""); 

  const user = JSON.parse(localStorage.getItem("user_data") || "{}");
  const history = useHistory(); 

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const profileData = await response.json();
        setUserInfo(profileData);
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

  // Navigate to edit profile page
  const navigateToEdit = () => {
    history.push("/edit");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {userInfo ? (
        <Row>
          <Col md={6}>
            <h3>{userInfo.firstName} {userInfo.lastName}</h3>
            <p>Email: {userInfo.email}</p>
            <p>Bio: {userInfo.bio}</p>
            <div>
              {userInfo.profilePic && (
                <img
                  src={userInfo.profilePic}
                  alt="Profile"
                  className="profilePic"
                  style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                />
              )}
            </div>
            <Button variant="primary" onClick={navigateToEdit}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      ) : (
        <div>No profile information available</div>
      )}
    </div>
  );
};

export default ProfilePage;
