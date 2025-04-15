import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../types";
import { buildPath } from "../../utils";
import "./PostDetail.css";

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  onDelete: (postId: string) => void;
}

interface MovieDetails {
  title: string;
  poster_path: string;
  overview: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onClose, onDelete }) => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(post.Rating);
  const [editedComment, setEditedComment] = useState(post.Comment);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (!storedUser) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const token = user?.token;

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const obj = { id: post.MovieId };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath('/api/fullMovieInfo'), {
          method: 'POST',
          body: js,
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        const res = await response.json();
        if (res.movieData) {
          setMovie({
            title: res.movieData.original_title,
            poster_path: res.movieData.poster_path,
            overview: res.movieData.overview
          });
        } else {
          setError("Movie data not found");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [post.MovieId]);

  const handleViewMovie = () => {
    navigate(`/movie?movieId=${post.MovieId}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const storedUser = localStorage.getItem("user_data");
      if (!storedUser) {
        setError("User not logged in");
        return;
      }

      const user = JSON.parse(storedUser);
      const token = user?.token;

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(`/api/posts/edit/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          rating: editedRating,
          comment: editedComment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();
      // Update the post object with the server response
      post.Rating = updatedPost.post.Rating;
      post.Comment = updatedPost.post.Comment;
      
      setIsEditing(false);
      onClose(); // Close the detail view to show updated values
    } catch (err) {
      setError('Failed to update post. Please try again.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDelete(post._id);
      onClose();
    }
  };

  return (
    <div className="post-detail-overlay" onClick={onClose}>
      <div className="post-detail-card" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="loading">Loading movie info...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="post-detail-content">
            {movie?.poster_path && (
              <div className="movie-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="poster-img"
                />
              </div>
            )}
            <div className="post-details">
              <h2 className="movie-title">{movie?.title}</h2>
              {movie?.overview && (
                <p className="movie-overview">{movie.overview}</p>
              )}
              <div className="review-section">
                <h3>Your Review</h3>
                {isEditing ? (
                  <div className="edit-form">
                    <div className="rating-input">
                      <label>Rating:</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editedRating}
                        onChange={(e) => setEditedRating(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="comment-input">
                      <label>Comment:</label>
                      <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      />
                    </div>
                    <div className="edit-actions">
                      <button onClick={handleSave} className="save-button">Save</button>
                      <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {post.Comment && (
                      <p className="review-comment">{post.Comment}</p>
                    )}
                    <div className="review-rating">
                      {post.Rating ? `Rating: ${post.Rating}/5` : "No rating"}
                    </div>
                  </>
                )}
              </div>
              <div className="action-buttons">
                <button 
                  className="view-movie-button"
                  onClick={handleViewMovie}
                >
                  View Movie Page
                </button>
                {!isEditing && (
                  <button 
                    className="edit-button"
                    onClick={handleEdit}
                  >
                    Edit Review
                  </button>
                )}
                {!isEditing && (
                  <button 
                    className="delete-button"
                    onClick={handleDelete}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default PostDetail; 