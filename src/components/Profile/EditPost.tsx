import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css';

interface Post {
    _id: string;
    Rating: number;
    Comment: string;
    MovieId: string;
}

const EditPost: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${postId}`);
                if (!response.ok) throw new Error('Failed to fetch post');
                const data = await response.json();
                setPost(data);
                setRating(data.Rating);
                setComment(data.Comment);
            } catch (err) {
                setError('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/posts/edit/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) throw new Error('Failed to update post');
            
            navigate('/profile');
        } catch (err) {
            setError('Failed to update post');
        }
    };

    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!post) return <div className="error">Post not found</div>;

    return (
        <div className="edit-post-container">
            <h2>Edit Review</h2>
            <form onSubmit={handleSubmit} className="edit-post-form">
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <input
                        type="number"
                        id="rating"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost; 