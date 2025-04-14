import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { buildPath } from "../utils";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Post {
  _id: string;
  UserId: number;
  MovieId: number;
  Rating: number;
  Comment: string;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          targetUserId = user.id;
        }
      }

      if (!targetUserId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await fetch(buildPath(`/api/profile/${targetUserId}`));
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        const profileData = await profileResponse.json();
        setUserInfo(profileData);

        // Fetch user posts
        const postsResponse = await fetch(buildPath(`/api/posts/user/${targetUserId}`));
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, location]);

  const navigateToEdit = () => {
    navigate(`/edit`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <ProfileDetails
        userInfo={userInfo}
        error={error}
        navigateToEdit={navigateToEdit}
      />
      
      <div className="mt-4">
        <h3 className="mb-3">User Posts</h3>
        {posts.length === 0 ? (
          <div className="alert alert-info">No posts yet.</div>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div key={post._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Movie ID: {post.MovieId}</h5>
                    <p className="card-text">{post.Comment}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="rating">
                        Rating: {post.Rating}/10
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
