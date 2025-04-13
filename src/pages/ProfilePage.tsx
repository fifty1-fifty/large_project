import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { buildPath } from "../utils";

interface Post {
  _id: string;
  title: string;
  content: string;
  dateCreated: string;
  UserId: string;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Try to get userId from URL params first
      let targetUserId = userId;
      
      // If no userId in URL, try to get it from localStorage
      if (!targetUserId) {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          targetUserId = user.id;
          console.log("Using userId from localStorage:", targetUserId);
        }
      }

      if (!targetUserId) {
        console.error("No userId found in URL params or localStorage");
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile for userId:", targetUserId);
        // Fetch user profile
        const profileResponse = await fetch(buildPath(`/api/profile/${targetUserId}`));
        if (!profileResponse.ok) {
          console.error("Profile fetch failed with status:", profileResponse.status);
          throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
        }
        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);
        setUserInfo(profileData);

        // Fetch user posts
        const postsUrl = buildPath(`/apiposts/user/${targetUserId}`);
        console.log("Attempting to fetch posts from:", postsUrl);
        const postsResponse = await fetch(postsUrl);
        console.log("Posts response status:", postsResponse.status);
        
        if (!postsResponse.ok) {
          console.error("Posts fetch failed with status:", postsResponse.status);
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        
        const postsData = await postsResponse.json();
        console.log("Posts data received:", postsData);
        
        if (!Array.isArray(postsData)) {
          console.error("Posts data is not an array:", postsData);
          throw new Error("Invalid posts data format");
        }
        
        setPosts(postsData);
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, location]);

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
