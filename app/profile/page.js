"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../lib/auth"; // Import getUser function

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getUser();
      setUser(loggedInUser);
    };
    fetchUser();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
