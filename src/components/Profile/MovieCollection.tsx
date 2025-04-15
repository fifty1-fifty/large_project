import React, { useState, useEffect } from 'react';
import { buildPath } from '../../utils';
import './MovieCollection.css';

interface MovieCollectionProps {
  movieIds: string[];
  onClose: () => void;
}

interface MovieDetails {
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

const MovieCollection: React.FC<MovieCollectionProps> = ({ movieIds, onClose }) => {
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
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

        const moviePromises = movieIds.map(async (movieId) => {
          const response = await fetch(buildPath('/api/fullMovieInfo'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': token
            },
            body: JSON.stringify({ id: movieId })
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.status}`);
          }

          const res = await response.json();
          return {
            title: res.movieData?.original_title ?? "Unknown Title",
            poster_path: res.movieData?.poster_path ?? null,
            backdrop_path: res.movieData?.backdrop_path ?? null
          };
        });

        const movieResults = await Promise.all(moviePromises);
        setMovies(movieResults);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieIds]);

  if (loading) {
    return (
      <div className="movie-collection-modal">
        <div className="movie-collection-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-collection-modal">
        <div className="movie-collection-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-collection-modal">
      <div className="movie-collection-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>My Collection</h2>
        <div className="movies-grid">
          {movies.length === 0 ? (
            <div className="no-movies">No movies in collection yet.</div>
          ) : (
            movies.map((movie, index) => (
              <div key={index} className="movie-card">
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    className="movie-poster"
                  />
                ) : (
                  <div className="no-poster">{movie.title}</div>
                )}
                <h3 className="movie-title">{movie.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCollection; 