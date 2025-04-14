import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../types";
import { buildPath } from "../../utils";
import PostDetail from "./PostDetail";
import "./ReviewCard.css";

interface ReviewCardProps {
  post: Post;
}

interface MovieDetails {
  title: string;
  poster_path: string;
  backdrop_path: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ post }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

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
            backdrop_path: res.movieData.backdrop_path
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

  const handleClick = () => {
    setShowDetail(true);
  };

  return (
    <>
      <div 
        className="review-card" 
        onClick={handleClick}
        style={{
          backgroundImage: movie?.backdrop_path 
            ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))'
        }}
      >
        {loading ? (
          <div className="loading">Loading movie info...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="review-content">
            {movie?.poster_path && (
              <div className="movie-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="poster-img"
                />
              </div>
            )}
            <div className="review-details">
              <h3 className="movie-title">{movie?.title || `Movie ID: ${post.MovieId}`}</h3>
              {post.Comment && <p className="review-comment">{post.Comment}</p>}
              <div className="review-rating">
                {post.Rating ? `Rating: ${post.Rating}/10` : "No rating"}
              </div>
            </div>
          </div>
        )}
      </div>
      {showDetail && (
        <PostDetail 
          post={post} 
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
};

export default ReviewCard; 