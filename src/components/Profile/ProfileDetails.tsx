import React, { useState, useEffect } from "react";
import "./ProfileDetails.css";
import { buildPath } from "../../utils";

interface ProfileDetailsProps {
  userInfo: any;
  error: string;
  navigateToEdit: () => void;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  dateCreated: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userInfo, error, navigateToEdit }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userInfo?.id) return;
      
      try {
        const response = await fetch(buildPath(`/apiposts/user/${userInfo.id}`));
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const userPosts = await response.json();
        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setPostsError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userInfo?.id]);

  return (
    <div className="profile-page">
      <h1 className="profile-heading"></h1>
      {error && <div className="error-message">Error: {error}</div>}
      {userInfo ? (
        <>
          <div className="profile-header">
            <h3>
              {userInfo.firstName} {userInfo.lastName}
            </h3>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Bio:</strong> {userInfo.bio}
            </p>
          </div>

          <div className="followers-following">
            <div className="followers">
              <h4>Followers</h4>
              <p>{userInfo.followers ? userInfo.followers.length : 0}</p>
            </div>
            <div className="following">
              <h4>Following</h4>
              <p>{userInfo.following ? userInfo.following.length : 0}</p>
            </div>
          </div>

          <div className="edit-profile-container">
            <button onClick={navigateToEdit} className="profile-edit-button">
              Edit Profile
            </button>
          </div>

          <div className="user-posts">
            <h2>Posts</h2>
            {loading ? (
              <p>Loading posts...</p>
            ) : postsError ? (
              <p className="error-message">{postsError}</p>
            ) : posts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post._id} className="post">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <span className="post-date">
                      {new Date(post.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProfileDetails;
