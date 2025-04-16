import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import './UserListModal.css';
import { useNavigate } from 'react-router-dom';

interface UserListModalProps {
  userIds: (string | number)[] | undefined;
  title: string;
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ userIds, title, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        const userPromises = userIds.map(async (id) => {
          try {
            const userId = typeof id === 'number' ? id.toString() : id;
            const response = await fetch(`/api/profile/${userId}`, {
              headers: {
                'authorization': token
              }
            });
            
            if (!response.ok) {
              console.error(`Failed to fetch user ${userId}:`, response.status);
              return null;
            }
            
            const data = await response.json();
            return data;
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
          }
        });

        const userData = await Promise.all(userPromises);
        const validUsers = userData.filter(user => user !== null);
        setUsers(validUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  const handleUserClick = (user: User) => {
    if (user.UserId) {
      navigate(`/profile/${user.UserId}`);
    }
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