// ProfileInfo.tsx
import React from "react";
import "../index.css" 

interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ firstName, lastName, email }) => {
  return (
    <div>
      <div >
        <strong>First Name:</strong>
        <p>{firstName}</p>
      </div>
      <div>
        <strong>Last Name:</strong>
        <p>{lastName}</p>
      </div>
      <div>
        <strong>Email:</strong>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
