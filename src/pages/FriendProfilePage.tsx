import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FriendProfile from '../components/FriendProfile/FriendProfile';
import FriendProfilePosts from '../components/FriendProfile/FriendProfilePosts';
import "../components/FriendProfile/FriendProfile.css";

const FriendProfilePage: React.FC = () => {
    const [friendInfo, setFriendInfo] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user_data");
    const currentUser = storedUser ? JSON.parse(storedUser) : {};
    const currentUserId = currentUser?.id;

    const location = useLocation();
    const friendId = location.state?.friendId;

    useEffect(() => {
        if(!friendId || !currentUserId) {
            navigate('/home');
            return;
        }

        async function fetchProfile() {
            try {
                const response = await fetch(`http://group22cop4331c.xyz/api/profile/${friendId}`);
                if(!response.ok) {
                    throw new Error("Failed to fetch friend profile");
                }
                const profileData = await response.json();
                setFriendInfo(profileData);

                // Check if current user is following this friend
                const followingStatus = profileData.followers?.includes(currentUserId);
                setIsFollowing(followingStatus);
            } catch (err: any) {
                setError(err.message);
            }
        }

        fetchProfile();
    }, [friendId, currentUserId, navigate]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://group22cop4331c.xyz/api/profile/${currentUserId}/follow/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to follow user');
            }
            
            setIsFollowing(true);
            setFriendInfo(prev => prev ? {
                ...prev,
                followers: [...prev.followers, currentUserId]
            } : null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://group22cop4331c.xyz/api/profile/${currentUserId}/unfollow/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to unfollow user');
            }
            
            setIsFollowing(false);
            setFriendInfo(prev => prev ? {
                ...prev,
                followers: prev.followers.filter(id => id !== currentUserId)
            } : null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="profile-page">
            <FriendProfile 
                friendInfo={friendInfo}
                error={error}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
            />
            {friendInfo && <FriendProfilePosts friendId={friendId} />}
        </div>
    );
};

export default FriendProfilePage;
