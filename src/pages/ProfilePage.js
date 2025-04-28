import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-4 text-white">
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please login.</p>
      )}
    </div>
  );
};

export default ProfilePage;