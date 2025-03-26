import React, { useEffect, useState } from 'react';
import { buildPath } from '../utils'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/Profile';

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(buildPath(`/api/profile/${user.id}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const profileData = await response.json();
                setUserInfo(profileData);
                setBio(profileData.bio || '');
            } catch (err: any) {
                setError(err.message);
            }
        }

        if (user?.id) {
            fetchProfile();
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!userInfo) {
        return <div className="text-center mt-4">Loading profile...</div>;
    }

    return (
        <div className="profile-container" id="fade-in">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-pic">
                        {userInfo.profilePic ? (
                            <img src={userInfo.profilePic} alt="Profile" className="rounded-circle" />
                        ) : (
                            <div className="default-pic">No Pic</div>
                        )}
                    </div>
                    <h5>{userInfo.firstName} {userInfo.lastName}</h5>
                </div>

                <div className="form-group">
                    <h6>Bio:</h6>
                    <textarea 
                        id="input" 
                        placeholder="Write your bio..." 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <input 
                        id="profilePicUpload" 
                        type="file" 
                        accept="image/*" 
                        className="d-none"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="profilePicUpload" className="upload-btn">Upload Profile Picture</label>
                    {selectedFile && <p className="selected-file">Selected: {selectedFile.name}</p>}
                </div>

                <div className="form-group">
                    <h6>Followers ({userInfo.followers.length})</h6>
                    <ul className="list-group">
                        {userInfo.followers.map((follower: any, index: number) => (
                            <li key={index} className="list-group-item">{follower}</li>
                        ))}
                    </ul>
                </div>

                <div className="form-group">
                    <h6>Following ({userInfo.following.length})</h6>
                    <ul className="list-group">
                        {userInfo.following.map((following: any, index: number) => (
                            <li key={index} className="list-group-item">{following}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
