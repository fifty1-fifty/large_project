import { useEffect, useState } from 'react';
import { buildPath } from '../utils'; 

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // Holds user's profile info
    const [error, setError] = useState<string>('');
    const user = JSON.parse(localStorage.getItem('user_data') || '{}'); // Get current user info from localStorage

    useEffect(() => {

        // Fetch user profile details from backend when component mounts
        async function fetchProfile() {
            try {
                const response = await fetch(buildPath(`/api/profile/${user.id}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await response.json();
                
                // Set user info to state
                setUserInfo(profileData); 
            } catch (err: any) {
                setError(err.message); // Handle errors
            }
        }

        if (user?.id) {
            fetchProfile();
        }
    }, [user]);

    // Error handling
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userInfo) {
        return <div>Loading profile...</div>;
    }
    
    return (
        <div className="profile-page">
            <h1>{userInfo.firstName} {userInfo.lastName}'s Profile</h1>
            
            <div className="profile-pic">
                {userInfo.profilePic ? (
                    <img src={userInfo.profilePic} alt="Profile" />
                ) : (
                    <div>No profile picture</div>
                )}
            </div>

            <div className="bio">
                <h3>Bio:</h3>
                <p>{userInfo.bio || 'This user has not set a bio.'}</p>
            </div>

            <div className="followers-following">
                <div>
                    <h3>Followers ({userInfo.followers.length})</h3>
                    <ul>
                        {userInfo.followers.map((follower: any, index: number) => (
                            <li key={index}>{follower}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Following ({userInfo.following.length})</h3>
                    <ul>
                        {userInfo.following.map((following: any, index: number) => (
                            <li key={index}>{following}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
