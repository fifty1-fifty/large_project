import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import './UserListModal.css';

interface UserListModalProps {
  userIds: (string | number)[] | undefined;
  title: string;
  onClose: () => void;
  onUserClick: (userId: string) => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ userIds, title, onClose, onUserClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userIds || userIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem("user_data");
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
          console.error("No token found");
          return;
        }

        console.log("Fetching users with IDs:", userIds);
        const userPromises = userIds.map(async (id) => {
          // Convert ID to string for the API call
          const userId = typeof id === 'number' ? id.toString() : id;
          console.log("Fetching user with ID:", userId);
          
          try {
            const response = await fetch(`/api/profile/${userId}`, {
              headers: {
                'authorization': token
              }
            });
            
            if (!response.ok) {
              console.error(`Failed to fetch user ${userId}:`, response.status);
              return null; // Return null for failed fetches
            }
            
            const data = await response.json();
            console.log("Fetched user data:", data);
            return data;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null; // Return null for failed fetches
          }
        });

        const userData = await Promise.all(userPromises);
        // Filter out null values (failed fetches)
        const validUsers = userData.filter(user => user !== null);
        console.log("Valid users fetched:", validUsers);
        setUsers(validUsers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  const handleUserClick = (user: User) => {
    console.log("User clicked:", user);
    // Use _id if UserId is not available
    const userId = user.UserId ? user.UserId.toString() : user._id;
    console.log("Navigating to user ID:", userId);
    onUserClick(userId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="user-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div 
                key={user._id} 
                className="user-item"
                onClick={() => handleUserClick(user)}
              >
                <span className="user-name">{user.firstName} {user.lastName}</span>
              </div>
            ))
          ) : (
            <div className="no-users">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal; 