import React, { useState, useEffect } from 'react';
import './MovieCollection.css';
import { buildPath } from '../../utils';

interface MovieCollectionProps {
    movieIds: string[];
    onClose: () => void;
}

interface Movie {
    id: string;
    title: string;
    poster_path: string;
    overview: string;
}

const MovieCollection: React.FC<MovieCollectionProps> = ({ movieIds, onClose }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
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
                        throw new Error(`Failed to fetch movie ${movieId}`);
                    }

                    const res = await response.json();
                    if (res.movieData) {
                        return {
                            id: movieId,
                            title: res.movieData.original_title,
                            poster_path: res.movieData.poster_path,
                            overview: res.movieData.overview
                        };
                    }
                    return null;
                });

                const movieData = await Promise.all(moviePromises);
                setMovies(movieData.filter((movie): movie is Movie => movie !== null));
            } catch (err) {
                setError('Failed to load movies');
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [movieIds]);

    if (loading) {
        return (
            <div className="collection-modal">
                <div className="collection-content">
                    <h2>My Collection</h2>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="collection-modal">
                <div className="collection-content">
                    <h2>My Collection</h2>
                    <p className="error">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="collection-modal">
            <div className="collection-content">
                <div className="collection-header">
                    <h2>My Collection</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-card">
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCollection; 