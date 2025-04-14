import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Post } from "../../types";
import StarRating from "../MovieInfo/StarRating";
import "./EditPost.css";

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the post from location state
    const postFromState = location.state?.post;
    if (postFromState) {
      setPost(postFromState);
      setRating(postFromState.Rating);
      setComment(postFromState.Comment);
    } else {
      setError("Post data not found");
    }
  }, [location.state]);

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
      setError('Failed to update post. Please try again.');
    }
  };

  if (error) {
    return <div className="edit-post-container">{error}</div>;
  }

  if (!post) {
    return <div className="edit-post-container">Post not found</div>;
  }

  return (
    <div className="edit-post-container">
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit} className="edit-post-form">
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <StarRating onRatingChange={setRating} />
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
          <button type="button" onClick={() => navigate('/profile')} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 