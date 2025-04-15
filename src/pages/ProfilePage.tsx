import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ReviewCard from "../components/Profile/ReviewCard";
import PostDetail from "../components/Profile/PostDetail";
import { User, Post } from "../types";
import Navigation from "../components/Navigation/Navigation";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser({
        ...userData,
        _id: userData.id.toString(),
        UserId: parseInt(userData.id),
      });
      console.log("Loaded current user from localStorage:", {
        id: userData.id,
        _id: userData.id.toString(),
      });
    } else {
      setError("Not logged in");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        //const targetUserId = userId || currentUser?._id;
        const targetUserId = userId || currentUser?.UserId?.toString();

        if (!targetUserId) {
          setError("No user ID provided");
          setIsLoading(false);
          return;
        }

        const isOwn = targetUserId === currentUser?._id;
        setIsOwnProfile(isOwn);

        // Get the current user's token
        const storedUser = localStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
          setError("Not logged in");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/profile/${targetUserId}`, {
          headers: {
            'authorization': token
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        //setUser(data);
        setUser({
          ...data,
          UserId: parseInt(userId || "0")  // ensure it's a number
        });
        

        // // Check if current user is following this profile by looking at the followers array
        // if (!isOwn && currentUser?._id) {
        //   const isFollowing = data.followers?.includes(currentUser._id) || false;
        //   setIsFollowing(isFollowing);
        // }
        // Check if current user is following this profile by looking at the followers array
        if (!isOwn && currentUser?.UserId !== undefined) {
          const isFollowing = data.followers?.includes(currentUser.UserId) || false;
          setIsFollowing(isFollowing);
        }

        const postsResponse = await fetch(`/api/posts/user/${targetUserId}`, {
          headers: {
            'authorization': token
          }
        });
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [userId, currentUser]);

  const navigateToEdit = () => {
    if (isOwnProfile) {
      navigate("/edit");
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;

    try {
      const storedUser = localStorage.getItem("user_data");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        setError("Not logged in");
        return;
      }

      // const endpoint = isFollowing
      //   ? `/api/profile/${currentUser._id}/unfollow/${user._id}`
      //   : `/api/profile/${currentUser._id}/follow/${user._id}`;
      const endpoint = isFollowing
        ? `/api/profile/${currentUser.UserId}/unfollow/${user.UserId}`
        : `/api/profile/${currentUser.UserId}/follow/${user.UserId}`;


      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update follow status");
      }

      setIsFollowing(!isFollowing);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followers: isFollowing
            ? prevUser.followers?.filter((id) => id !== currentUser._id)
            : [...(prevUser.followers || []), currentUser._id],
        };
      });
    } catch (err) {
      console.error("Follow error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update follow status"
      );
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!isOwnProfile) return;

    try {
      const response = await fetch(`/api/posts/deletepost/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts((prev: Post[]) => prev.filter((post) => post._id !== postId));
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

  const validPosts = posts.filter((post: Post) => post.Comment || post.Rating);

  return (
    <div>
      <Navigation />
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
                {validPosts.map((post: Post) => (
                  <ReviewCard
                    key={post._id}
                    post={post}
                    onPostClick={handlePostClick}
                    showDeleteButton={isOwnProfile}
                    onDelete={isOwnProfile ? handleDeletePost : undefined}
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
            isOwnProfile={isOwnProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
