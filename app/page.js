"use client";

import { useEffect, useState } from "react";
import { getUser } from "../lib/auth"; // Import getUser function

const Home = () => {
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
      <h1 className="text-2xl font-bold">Welcome to Food Order System</h1>
      {user ? <p>Hi {user.email}, you are logged in!</p> : <p>Please log in to place orders.</p>}
    </div>
  );
};

export default Home;
