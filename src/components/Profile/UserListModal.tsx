import React from 'react';
import './UserListModal.css';
import { useNavigate } from 'react-router-dom';

interface UserListModalProps {
  userIds: (string | number)[] | undefined;
  title: string;
  onClose: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ userIds, title, onClose }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string | number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="user-list">
          {userIds && userIds.length > 0 ? (
            userIds.map((userId) => (
              <div 
                key={userId} 
                className="user-item"
                onClick={() => handleUserClick(userId)}
              >
                <span className="user-name">User {userId}</span>
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