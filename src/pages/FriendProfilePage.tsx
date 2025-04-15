import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FriendProfile from '../components/FriendProfile/FriendProfile';
import "../components/FriendProfile/FriendProfile.css";

const FriendProfilePage: React.FC = () => {
    const [friendInfo, setFriendInfo] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const storedUser = localStorage.getItem("user_data");
    const currentUser = storedUser ? JSON.parse(storedUser) : {};
    const currentUserId = currentUser?.id;
    const token = currentUser?.Token;

    // const location = useLocation();
    // const friendId = location.state?.friendId; //or use route param if needed
    const { friendId } = useParams<{ friendId: string}>();

    useEffect(() => {
        if(!friendId || !currentUserId)   return;

        async function fetchProfile() {
            try {
                const response = await fetch(`/api/profile/${friendId}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                if(!response.ok) {
                    throw new Error("Failed to fetch friend profile");
                }
                const profileData = await response.json();
                setFriendInfo(profileData);

                // check if current user is following this friend
                // const followRes = await fetch(`/api/users/${currentUserId}/is-following/${friendId}`, {
                //     headers: {
                //         Authorization: token,
                //     },
                // });
                // if(!followRes.ok) {
                //     throw new Error("Failed to check follow status");
                // }
                // const { isFollowing } = await followRes.json();

                // determine if current user is following friend
                const followingStatus = profileData.followers?.includes(currentUserId);
                setIsFollowing(followingStatus);
            } catch (err: any) {
                setError(err.message);
            }
        }

        fetchProfile();
    }, [friendId, currentUserId, token]);

    const followButton = async () => {
        try {
            const endpoint = isFollowing ? `/api/users/${currentUserId}/unfollow/${friendId}` : `/api/users/${currentUserId}/follow${friendId}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: token,
                },
            });

            if(!response.ok) {
                throw new Error("Failed to update follow status");
            }
            
            // update local state
            setIsFollowing((prev) => !prev);
            setFriendInfo((prev: any) => {
                const updatedFollowers = isFollowing ? prev.followers.filter((id: number) => id !== currentUserId)
                : [...(prev.followers || []), currentUserId];

                return {
                    ...prev,
                    followers: updatedFollowers,
                };
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <FriendProfile 
            friendInfo={friendInfo}
            error={error}
            isFollowing={isFollowing}
            followButton={followButton}
        />
    );
};

export default FriendProfilePage;
