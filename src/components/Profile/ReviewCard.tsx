import React, { useEffect, useState } from 'react';
import { Post } from '../../types';
import './ReviewCard.css';

interface MovieDetails {
    backdrop_path: string;
    poster_path: string;
    title: string;
}

interface ReviewCardProps {
    post: Post;
    onDelete: (postId: string) => void;
    onEdit: (postId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ post, onDelete, onEdit }) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`/api/movies/${post.MovieId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                const data = await response.json();
                setMovieDetails(data);
            } catch (err) {
                setError('Failed to load movie details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [post.MovieId]);

    const handleEdit = () => {
        onEdit(post._id);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            onDelete(post._id);
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
                    <div className="rating">Rating: {post.Rating}/10</div>
                    <p className="comment">{post.Comment}</p>
                    <div className="review-actions">
                        <button onClick={handleEdit} className="edit-button">Edit</button>
                        <button onClick={handleDelete} className="delete-button">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard; 