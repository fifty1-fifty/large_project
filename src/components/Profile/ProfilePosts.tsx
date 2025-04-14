import React from 'react';

interface Post {
  _id: string;
  UserId: number;
  MovieId: number;
  Rating: number;
  Comment: string;
}

interface ProfilePostsProps {
  posts: Post[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  return (
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
  );
};

export default ProfilePosts; 