import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import './UserListModal.css';

interface UserListModalProps {
  userIds: string[] | undefined;
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

        const userPromises = userIds.map(async (userId) => {
          const response = await fetch(`/api/profile/${userId}`, {
            headers: {
              'authorization': token
            }
          });
          if (!response.ok) throw new Error('Failed to fetch user');
          return response.json();
        });

        const userData = await Promise.all(userPromises);
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

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
                onClick={() => onUserClick(user._id)}
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