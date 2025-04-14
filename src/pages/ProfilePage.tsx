import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { User, Post } from "../types";


const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState("");
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
        const profileResponse = await fetch(`http://group22cop4331c.xyz/api/profile/${targetUserId}`);
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        
        const contentType = profileResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON");
        }

        const profileData = await profileResponse.json();
        setUserInfo(profileData);

        // Fetch user posts
        const postsResponse = await fetch(`http://group22cop4331c.xyz/api/posts/user/${targetUserId}`);
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }

        const postsContentType = postsResponse.headers.get("content-type");
        if (!postsContentType || !postsContentType.includes("application/json")) {
          throw new Error("Server did not return JSON for posts");
        }

        const postsData = await postsResponse.json();
        console.log("Fetched posts:", postsData); // Debug log
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching data:", err);
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

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!userInfo) {
    return <div className="alert alert-warning mt-5">User not found</div>;
  }

  // Filter out posts with empty comments and no ratings
  const validPosts = posts.filter(post => post.Comment || post.Rating);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <ProfileDetails
            userInfo={userInfo}
            error={error}
            navigateToEdit={navigateToEdit}
          />
        </div>
        <div className="col-md-8">
          <div className="mt-4">
            <h3 className="mb-3">User Reviews</h3>
            {validPosts.length === 0 ? (
              <div className="alert alert-info">No reviews yet.</div>
            ) : (
              <div className="row">
                {validPosts.map((post) => (
                  <div key={post._id} className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Movie ID: {post.MovieId}</h5>
                        {post.Comment && <p className="card-text">{post.Comment}</p>}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="rating">
                            {post.Rating ? `Rating: ${post.Rating}/10` : "No rating"}
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
      </div>
    </div>
  );
};

export default ProfilePage;
