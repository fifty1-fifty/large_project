import { useEffect, useState } from 'react';
import { buildPath } from '../utils'; 

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // Holds user's profile info
    const [error, setError] = useState<string>('');
    const [bio, setBio] = useState<string>(''); // State for bio input
    const [profilePic, setProfilePic] = useState<File | null>(null); // State for profile pic upload
    const user = JSON.parse(localStorage.getItem('user_data') || '{}'); // Get current user info from localStorage

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(buildPath(`/api/profile/${user.id}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await response.json();
                setUserInfo(profileData);
                setBio(profileData.bio || ''); // Set initial bio
            } catch (err: any) {
                setError(err.message);
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

            <div className="form-group">
                <textarea 
                    id="input" 
                    placeholder="Write your bio..." 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                />
            </div>

            <div className="form-group">
                <label htmlFor="profilePicUpload" className="upload-button">
                    Choose a Profile Picture
                </label>
                <input 
                    id="profilePicUpload" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                    style={{ display: 'none' }} 
                />
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
