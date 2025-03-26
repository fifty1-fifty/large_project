import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button, Row, Col, Card, Spinner } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>(""); 

  const user = JSON.parse(localStorage.getItem("user_data") || "{}");
  const navigate = useNavigate(); 

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

  const navigateToEdit = () => {
    navigate("/edit");
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div className="profile-page container mt-5">
      <h1 className="text-center mb-4">User Profile</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {userInfo ? (
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={4} className="text-center">
                    {userInfo.profilePic && (
                      <img
                        src={userInfo.profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: "150px", height: "150px" }}
                      />
                    )}
                  </Col>
                  <Col md={8}>
                    <h3>{userInfo.firstName} {userInfo.lastName}</h3>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Bio:</strong> {userInfo.bio}</p>
                    <Button variant="primary" onClick={navigateToEdit}>
                      Edit Profile
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <div>No profile information available</div>
      )}
    </div>
  );
};

export default ProfilePage;
