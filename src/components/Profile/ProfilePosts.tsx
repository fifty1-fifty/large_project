import React, { useEffect } from "react";
import { Post } from "../../types";
import "./ProfilePosts.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface ProfilePostsProps {
  posts: Post[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  useEffect(() => {
    const carouselElement = document.getElementById('postsCarousel');
    if (carouselElement) {
      new (window as any).bootstrap.Carousel(carouselElement, {
        interval: 5000,
        wrap: true
      });
    }
  }, [posts]);

  return (
    <div className="profile-posts">
      <h3>Recent Posts</h3>
      {posts.length > 0 ? (
        <div id="postsCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {posts.map((post, index) => (
              <div 
                key={post.MovieId} 
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <div className="post-card">
                  <h5>Movie ID: {post.MovieId}</h5>
                  <p className="post-comment">{post.Comment}</p>
                  <div className="post-rating">
                    Rating: {post.Rating}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
          {posts.length > 1 && (
            <>
              <button 
                className="carousel-control-prev" 
                type="button" 
                data-bs-target="#postsCarousel" 
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button 
                className="carousel-control-next" 
                type="button" 
                data-bs-target="#postsCarousel" 
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="no-posts">No posts yet</div>
      )}
    </div>
  );
};

export default ProfilePosts; 