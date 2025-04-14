import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { buildPath } from '../../utils';
import StarRating from '../MovieInfo/StarRating';
import './ReviewCard.css';

interface MovieDetails {
    backdrop_path: string;
    poster_path: string;
    title: string;
}

interface ReviewCardProps {
    post: Post;
    onPostClick: (post: Post) => void;
    onDelete: (postId: string) => void;
    onEdit: (post: Post) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ post, onPostClick, onDelete, onEdit }) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(post.Rating);
    const [comment, setComment] = useState(post.Comment);
    const navigate = useNavigate();

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

    const handleEdit = () => {
        navigate(`/edit-post/${post._id}`, { state: { post } });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/posts/edit/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) throw new Error('Failed to update post');
            
            onEdit({ ...post, Rating: rating, Comment: comment });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleCancel = () => {
        setRating(post.Rating);
        setComment(post.Comment);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="review-card edit-form">
                <div className="form-group">
                    <label>Rating:</label>
                    <StarRating onRatingChange={setRating} />
                </div>
                <div className="form-group">
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button onClick={handleSave} className="save-button">Save Changes</button>
                    <button onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        );
    }

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
                    <div className="rating">
                        <StarRating rating={post.Rating} readOnly />
                    </div>
                    <p className="comment">{post.Comment}</p>
                </div>
            </div>
            <div className="review-footer">
                <span className="date">{new Date(post.CreatedAt).toLocaleDateString()}</span>
                <div className="button-group">
                    <button onClick={handleEdit} className="edit-button">Edit</button>
                    <button onClick={() => onDelete(post._id)} className="delete-button">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard; 