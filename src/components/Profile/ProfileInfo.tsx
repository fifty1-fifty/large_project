import React from "react";

interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ firstName, lastName, email }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="display-4">{firstName ? `${firstName} ${lastName}` : "Guest"}</h2>
      <p className="lead">{email || "Not Available"}</p>
    </div>
  );
};

export default ProfileInfo;
