import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { buildPath } from "../utils";

interface Post {
  _id: string;
  title: string;
  content: string;
  dateCreated: string;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(buildPath(`/api/profile/${userId}`));
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        setUserInfo(profileData);

        // Fetch user posts
        const postsResponse = await fetch(buildPath(`/apiposts/user/${userId}`));
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const navigateToEdit = () => {
    navigate(`/edit`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileDetails
      userInfo={userInfo}
      error={error}
      navigateToEdit={navigateToEdit}
      posts={posts}
    />
  );
};

export default ProfilePage;
