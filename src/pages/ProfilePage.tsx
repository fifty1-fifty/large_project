import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ReviewCard from "../components/Profile/ReviewCard";
import PostDetail from "../components/Profile/PostDetail";
import { User, Post } from "../types";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setError("Not logged in");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // If no userId is provided, use the current user's ID
        const targetUserId = userId || currentUser?.id;
        
        if (!targetUserId) {
          setError('No user ID provided');
          setIsLoading(false);
          return;
        }

        // Check if this is the current user's profile
        setIsOwnProfile(targetUserId === currentUser?.id);

        const response = await fetch(`/api/profile/${targetUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setUser(data);
        
        // Fetch user's posts
        const postsResponse = await fetch(`/api/posts/user/${targetUserId}`);
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const navigateToEdit = () => {
    navigate("/edit");
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;

    try {
      const endpoint = isFollowing
        ? `/api/profile/${currentUser._id}/unfollow/${user._id}`
        : `/api/profile/${currentUser._id}/follow/${user._id}`;

      const response = await fetch(`http://group22cop4331c.xyz${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update follow status");
      }

      // Update local state
      setIsFollowing(!isFollowing);
      if (user.followers) {
        if (isFollowing) {
          user.followers = user.followers.filter(id => id !== currentUser._id);
        } else {
          user.followers.push(currentUser._id);
        }
        setUser({ ...user });
      }
    } catch (err) {
      console.error("Follow error:", err);
      setError("Failed to update follow status");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/deletepost/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts(prev => prev.filter(post => post._id !== postId));
      setSelectedPost(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete post");
    }
  };

  const handlePostClick = (post: Post) => setSelectedPost(post);
  const handleClosePostDetail = () => setSelectedPost(null);

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!user) return <div className="alert alert-warning mt-5">User not found</div>;

  const validPosts = posts.filter(post => post.Comment || post.Rating);

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-section">
          <ProfileDetails
            userInfo={user}
            error={error}
            navigateToEdit={isOwnProfile ? navigateToEdit : undefined}
            showFollowButton={!isOwnProfile}
            isFollowing={isFollowing}
            onFollowToggle={handleFollowToggle}
          />
        </div>
        <div className="reviews-section">
          {validPosts.length === 0 ? (
            <div className="no-reviews">No reviews yet.</div>
          ) : (
            <div className="reviews-grid">
              {validPosts.map(post => (
                <ReviewCard
                  key={post._id}
                  post={post}
                  onPostClick={handlePostClick}
                  showDeleteButton={isOwnProfile}
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
          onDelete={isOwnProfile ? handleDeletePost : undefined}
        />
      )}
    </div>
  );
};

export default ProfilePage;
