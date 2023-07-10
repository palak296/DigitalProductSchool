import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../utilities/UserContext";
import { BiGitRepoForked, BiLink, BiSolidStar } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai"
const Repositories = () => {
  const [sdata, setsdata] = useState("");
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://api.github.com/users/${userContext.username}/repos`
      );
      const data = await response.json();
      setsdata(data);
    }
    fetchData();
  }, [userContext.username]);

  return (
    <div className="bg-gray-800 h-screen">
      <div className="rounded-xl overflow-hidden bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 flex justify-center">
            Repositories
          </h2>
          <div className="bg-gray-900 rounded-lg">
            {sdata.length > 0 ? (
              sdata.map((repo) => (
                <div key={repo.id} className="p-4 border-b border-gray-800">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-gray-200 mb-1 flex items-center"
                  >
                    <span className="mr-2 text-2xl">
                      <BiLink />
                    </span>{" "}
                    <span>{repo.name}</span>
                  </a>
                  <p className="text-gray-400 mb-2">{repo.description}</p>
                  <div className="flex items-center text-gray-400">
                    <span className="mr-2 text-yellow-400">
                      {repo.language}
                    </span>
                    <span className="font-bold mr-2 flex items-center  rounded-full px-2 bg-blue-300 text-black">
                      <span className="mr-1">
                        <AiFillEye />
                      </span>
                      {repo.watchers_count}
                    </span>
                    <span className="font-bold mr-2 flex items-center  rounded-full px-2 bg-green-300 text-black">
                      <span className="mr-1">
                        <BiSolidStar />
                      </span>{" "}
                      {repo.stargazers_count}
                    </span>
                    <span className="font-bold mr-2 flex items-center  rounded-full px-2 bg-yellow-300 text-black">
                      <span className="mr-1">
                        <BiGitRepoForked />
                      </span>
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-200 text-center p-10 flex justify-between">
                Loading Repositories...
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="absolute top-2 left-2 flex items-center px-3 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default Repositories;
