import React, { useState, useEffect } from "react";
import EditProfileForm from "../components/Profile/EditProfileForm";

const EditProfilePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null); 
    }
  }, []);

  if (!userId) {
    return <div>User not found or not logged in.</div>;  
  }

  return <EditProfileForm userId={userId} />;
};

export default EditProfilePage;
