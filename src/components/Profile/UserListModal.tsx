import React from 'react';
import { User } from '../../types';
import './UserListModal.css';

interface UserListModalProps {
  users: User[] | undefined;
  title: string;
  onClose: () => void;
  onUserClick: (userId: string) => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ users, title, onClose, onUserClick }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="user-list">
          {users && users.length > 0 ? (
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