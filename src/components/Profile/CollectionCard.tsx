import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../utils';
import './CollectionCard.css';

interface MovieDetails {
  title: string;
  poster_path: string;
  backdrop_path: string;
}

interface CollectionCardProps {
  movieId: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ movieId }) => {
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

        const obj = { id: movieId };
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
  }, [movieId]);

  const handleClick = () => {
    navigate(`/movie?movieId=${movieId}`);
  };

  return (
    <div 
      className="collection-card" 
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
        <div className="collection-content">
          {movie?.poster_path && (
            <div className="movie-poster">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="poster-img"
              />
            </div>
          )}
          <div className="movie-details">
            <h3 className="movie-title">{movie?.title || `Movie ID: ${movieId}`}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionCard; 