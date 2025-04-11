import React, { useState, useEffect } from "react";
import EditProfileForm from "../components/Profile/EditProfileForm";

const EditProfilePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    console.log('Stored user data:', storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('Parsed user data:', user);
      setUserId(user?.id || null); 
    }
  }, []);

  if (!userId) {
    return <div>User not found or not logged in.</div>;  
  }

  return <EditProfileForm userId={userId} />;
};

export default EditProfilePage;
