import React from "react";
import EditProfileForm from "./EditProfileForm"; // Importing the form component

interface EditProfilePageProps {
  userId: string;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ userId }) => {
  return (
    <div className="edit-profile-page-container">
      <h1>Edit Your Profile</h1>
      <EditProfileForm userId={userId} />
    </div>
  );
};

export default EditProfilePage;
