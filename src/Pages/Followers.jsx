import React, { useContext, useEffect, useState } from "react";
import UserContext from "../utilities/UserContext";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (username) => {
    userContext.setUsername(username);
    navigate("/home");
  };

  useEffect(() => {
    async function fetchFollowers() {
      const response = await fetch(
        `https://api.github.com/users/${userContext.username}/followers`
      );
      const followersData = await response.json();
      setFollowers(followersData);
    }
    fetchFollowers();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="bg-gray-800 w-full max-w-md rounded-md p-8">
          {followers.length > 0 ? (
            followers.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center mb-3 cursor-pointer hover:bg-gray-700 rounded-md p-2"
                onClick={() => handleClick(follower.login)}
              >
                <img
                  className="w-8 h-8 rounded-full mr-2"
                  src={follower.avatar_url}
                  alt={`Avatar of ${follower.login}`}
                />
                <div className="text-gray-200 font-medium">
                  {follower.login}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-200 text-center py-10">
              Loading followers...
            </div>
          )}
        </div>
        <button
          className="absolute top-0 left-0 mt-2 ml-2 px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default Followers;
