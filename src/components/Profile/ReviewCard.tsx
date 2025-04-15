import React, { useEffect, useState } from 'react';
import { Post } from '../../types';
import { buildPath } from '../../utils';
import './ReviewCard.css';

interface MovieDetails {
  backdrop_path: string;
  poster_path: string;
  title: string;
}

interface ReviewCardProps {
  post: Post;
  onPostClick: (post: Post) => void;
  showDeleteButton?: boolean; // If the parent passes this as true, show delete button
  onDelete?: (postId: string) => void; // Callback for post deletion
}

const ReviewCard: React.FC<ReviewCardProps> = ({ post, onPostClick, showDeleteButton, onDelete }) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (!storedUser) {
          setError("User not logged in");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const token = user?.token;

        if (!token) {
          setError("No authentication token found");
          setIsLoading(false);
          return;
        }

        const response = await fetch(buildPath('/api/fullMovieInfo'), {
          method: 'POST',
          body: JSON.stringify({ id: post.MovieId }),
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
          setMovieDetails({
            title: res.movieData.original_title,
            poster_path: res.movieData.poster_path,
            backdrop_path: res.movieData.backdrop_path
          });
        } else {
          setError("Movie data not found");
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [post.MovieId]);

  const handleDeleteClick = () => {
    if (onDelete && post._id) {
      onDelete(post._id); // Call the parent delete function when delete button is clicked
    }
  };

  if (isLoading) {
    return <div className="review-card loading">Loading...</div>;
  }

  if (error) {
    return <div className="review-card error">{error}</div>;
  }

  return (
    <div 
      className="review-card"
      onClick={() => onPostClick(post)}
      style={{
        backgroundImage: movieDetails?.backdrop_path 
          ? `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`
          : 'none'
      }}
    >
      <div className="review-card-content">
        <div className="movie-poster">
          {movieDetails?.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
            />
          )}
        </div>
        <div className="review-details">
          <h3>{movieDetails?.title}</h3>
          <div className="rating">Rating: {post.Rating}/5</div>
          <p className="comment">{post.Comment}</p>
        </div>
      </div>
      {showDeleteButton && (
        <button className="delete-post-btn" onClick={handleDeleteClick}>
          Delete Post
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
