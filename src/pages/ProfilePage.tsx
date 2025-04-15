import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ReviewCard from "../components/Profile/ReviewCard";
import PostDetail from "../components/Profile/PostDetail";
import MovieCollection from "../components/Profile/MovieCollection";
import { User, Post } from "../types";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/deletepost/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Update the posts state by filtering out the deleted post
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setSelectedPost(null); 
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

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
        console.log("Fetched posts:", postsData);
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
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-section">
          <ProfileDetails
            userInfo={userInfo}
            error={error}
            navigateToEdit={navigateToEdit}
            onCollectionClick={() => setIsCollectionOpen(!isCollectionOpen)}
          />
        </div>
        <div className="reviews-section">
          {validPosts.length === 0 ? (
            <div className="no-reviews">No reviews yet.</div>
          ) : (
            <div className="reviews-grid">
              {validPosts.map((post) => (
                <ReviewCard 
                  key={post._id} 
                  post={post} 
                  onPostClick={handlePostClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={handleClosePostDetail}
          onDelete={handleDeletePost}
        />
      )}
      {isCollectionOpen && (
        <MovieCollection
          movieIds={userInfo.Collection || []}
          onClose={() => setIsCollectionOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
