import React, { useState } from "react";
import EditProfileForm from "../components/Profile/EditProfileForm";

const EditProfilePage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);


  React.useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user?.id || null);
    }
  }, []);

  return (
    <div>
      {userId ? (
        <EditProfileForm userId={userId} />
      ) : (
        <div>Loading...</div> 
      )}
    </div>
  );
};

export default EditProfilePage;
