import React, { useState, useEffect } from 'react';
import './UserListModal.css';
import { useNavigate } from 'react-router-dom';

interface UserListModalProps {
  userIds: (string | number)[] | undefined;
  title: string;
  onClose: () => void;
}

interface UserInfo {
  [key: string]: {
    firstName: string;
    lastName: string;
  };
}

const UserListModal: React.FC<UserListModalProps> = ({ userIds, title, onClose }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!userIds || userIds.length === 0) return;

      const storedUser = localStorage.getItem("user_data");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) return;

      const userInfoMap: UserInfo = {};
      for (const userId of userIds) {
        try {
          const response = await fetch(`/api/profile/${userId}`, {
            headers: {
              'authorization': token
            }
          });
          if (response.ok) {
            const data = await response.json();
            userInfoMap[userId] = {
              firstName: data.firstName,
              lastName: data.lastName
            };
          }
        } catch (error) {
          console.error(`Error fetching user info for ${userId}:`, error);
        }
      }
      setUserInfo(userInfoMap);
    };

    fetchUserNames();
  }, [userIds]);

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
                <span className="user-name">
                  {userInfo[userId] ? `${userInfo[userId].firstName} ${userInfo[userId].lastName}` : 'Loading...'}
                </span>
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