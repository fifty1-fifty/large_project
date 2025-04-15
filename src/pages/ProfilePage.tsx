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
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);

  const handleFollowToggle = async () => {
    if (!currentUser || !userInfo) return;

    try {
      const endpoint = isFollowing 
        ? `/api/profile/${currentUser.id}/unfollow/${userInfo.id}`
        : `/api/profile/${currentUser.id}/follow/${userInfo.id}`;

      const response = await fetch(`http://group22cop4331c.xyz${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update follow status');
      }

      // Update the local state
      setIsFollowing(!isFollowing);
      
      // Update the userInfo followers list
      if (userInfo.followers) {
        if (isFollowing) {
          // Remove current user from followers
          userInfo.followers = userInfo.followers.filter((id: string) => id !== currentUser.id);
        } else {
          // Add current user to followers
          userInfo.followers.push(currentUser.id);
        }
        setUserInfo({...userInfo});
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update follow status. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/deletepost/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts((prevPosts: Post[]) => prevPosts.filter(post => post._id !== postId));
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

        // Check if current user is following this profile
        if (currentUser && currentUser.id !== targetUserId && profileData.followers) {
          setIsFollowing(profileData.followers.includes(currentUser.id));
        }

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
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, location, currentUser]);

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
  const validPosts = posts.filter((post: Post) => post.Comment || post.Rating);

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
              {validPosts.map((post: Post) => (
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
