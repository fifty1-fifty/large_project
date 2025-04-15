import React from 'react';
import { useNavigate } from 'react-router-dom';
import FriendProfilePosts from './FriendProfilePosts';
import "./FriendProfile.css";

interface FriendProfileProps {
    friendInfo: any;
    error: string;
    isFollowing: boolean;
    onFollow: () => void;
    onUnfollow: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ friendInfo, error, isFollowing, onFollow, onUnfollow }) => {
    const navigate = useNavigate();

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!friendInfo) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-content">
                <div className="profile-details">
                    <div className="profile-content">
                        <div className="profile-header">
                            <h1 className="profile-name">{friendInfo.name}</h1>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-value">{friendInfo.followers?.length || 0}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{friendInfo.following?.length || 0}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-bio">
                            <p>{friendInfo.bio || "No bio available"}</p>
                        </div>
                        <div className="profile-actions">
                            {isFollowing ? (
                                <button className="unfollow-button" onClick={onUnfollow}>
                                    Unfollow
                                </button>
                            ) : (
                                <button className="follow-button" onClick={onFollow}>
                                    Follow
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="reviews-section">
                    <h2 className="section-title">Reviews</h2>
                    <FriendProfilePosts friendId={friendInfo.id} />
                </div>
            </div>
        </div>
    );
};

export default FriendProfile;