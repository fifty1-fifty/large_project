import React, { useState, useEffect } from 'react';
import CollectionCard from './CollectionCard';
import './CollectionList.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  Collection?: string[];
}

interface CollectionListProps {
  userId: string;
}

const CollectionList: React.FC<CollectionListProps> = ({ userId }) => {
  const [collection, setCollection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (!storedUser) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const token = user?.token;

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://group22cop4331c.xyz/api/profile/${userId}`, {
          headers: {
            'authorization': token
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const userData: UserProfile = await response.json();
        setCollection(userData.Collection || []);
      } catch (error) {
        console.error("Error fetching collection:", error);
        setError("Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading collection...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (collection.length === 0) {
    return <div className="no-collection">No movies in collection yet.</div>;
  }

  return (
    <div className="collection-grid">
      {collection.map((movieId) => (
        <CollectionCard key={movieId} movieId={movieId} />
      ))}
    </div>
  );
};

export default CollectionList; 