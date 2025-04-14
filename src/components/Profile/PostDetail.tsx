import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../types";
import { buildPath } from "../../utils";
import "./PostDetail.css";

interface PostDetailProps {
  post: Post;
  onClose: () => void;
}

interface MovieDetails {
  title: string;
  poster_path: string;
  overview: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onClose }) => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                {post.Comment && (
                  <p className="review-comment">{post.Comment}</p>
                )}
                <div className="review-rating">
                  {post.Rating ? `Rating: ${post.Rating}/10` : "No rating"}
                </div>
              </div>
              <button 
                className="view-movie-button"
                onClick={handleViewMovie}
              >
                View Movie Page
              </button>
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