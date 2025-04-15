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

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setError("Not logged in");
      setLoading(false);
    }
  }, []);

  // Determine if it's the current user's own profile
  const isOwnProfile = !userId || userId === currentUser?._id;
  const targetUserId = userId || currentUser?._id;

  // Fetch profile + posts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!targetUserId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const profileRes = await fetch(`http://group22cop4331c.xyz/api/profile/${targetUserId}`);
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();
        setUserInfo(profileData);

        // Check follow status
        if (
          currentUser &&
          targetUserId !== currentUser._id &&
          profileData.followers?.includes(currentUser._id)
        ) {
          setIsFollowing(true);
        }

        // Fetch posts
        const postsRes = await fetch(`http://group22cop4331c.xyz/api/posts/user/${targetUserId}`);
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [targetUserId, location, currentUser]);

  const navigateToEdit = () => {
    navigate("/edit");
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !userInfo) return;

    try {
      const endpoint = isFollowing
        ? `/api/profile/${currentUser._id}/unfollow/${userInfo._id}`
        : `/api/profile/${currentUser._id}/follow/${userInfo._id}`;

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
      if (userInfo.followers) {
        if (isFollowing) {
          userInfo.followers = userInfo.followers.filter(id => id !== currentUser._id);
        } else {
          userInfo.followers.push(currentUser._id);
        }
        setUserInfo({ ...userInfo });
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!userInfo) return <div className="alert alert-warning mt-5">User not found</div>;

  const validPosts = posts.filter(post => post.Comment || post.Rating);

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <div className="profile-section">
          <ProfileDetails
            userInfo={userInfo}
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
