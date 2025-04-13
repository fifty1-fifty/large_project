import React from "react";
import "./ProfileDetails.css";

interface Post {
  _id: string;
  title: string;
  content: string;
  dateCreated: string;
}

interface ProfileDetailsProps {
  userInfo: any;
  error: string;
  navigateToEdit: () => void;
  posts: Post[];
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userInfo, error, navigateToEdit, posts }) => {
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
            {posts.length === 0 ? (
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
