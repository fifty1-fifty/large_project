import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../../types";
import { buildPath } from "../../utils";
import StarRating from "../MovieInfo/StarRating";
import "./EditPost.css";

interface EditPostProps {
  post: Post;
}

const EditPost: React.FC<EditPostProps> = ({ post }) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(post.Rating);
  const [comment, setComment] = useState<string>(post.Comment);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const storedUser = localStorage.getItem("user_data");
      if (!storedUser) {
        setError("User not logged in");
        return;
      }

      const user = JSON.parse(storedUser);
      const token = user?.token;

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(buildPath(`/api/posts/edit/${postId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          Rating: rating,
          Comment: comment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      navigate('/profile');
    } catch (err) {
      setError('Failed to update post. Please try again.');
    }
  };

  if (error) {
    return <div className="edit-post-container">{error}</div>;
  }

  return (
    <div className="edit-post-container">
      <h2>Edit Review</h2>
      <div className="edit-form">
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
          <button onClick={() => navigate('/profile')} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 