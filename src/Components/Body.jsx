import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../utilities/UserContext";

const Body = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);

  const handleButtonClick = () => {
    setLoading(true);
    userContext.setUsername(username);
    if (username !== "") {
      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="max-w-md  md:mx-0 mx-4 p-10 bg-gray-900 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Find GitHub Users and Explore Their Repositories with Ease
        </h2>
        <form>
          <div className="relative mb-6">
            <label
              htmlFor="text"
              className={`block mb-2 text-sm font-medium ${username ? "text-gray-300" : "text-gray-500"
                } transition-all duration-200`}
            >
              Enter GitHub username
            </label>
            <input
              type="text"
              id="text"
              autoComplete="off"
              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />

          </div>
          <button
            type="submit"
            className={`bg-gradient-to-br ${loading ? "from-yellow-600 to-yellow-800" : "from-yellow-600 to-yellow-700"
              } hover:opacity-90 focus:ring-4 focus:outline-none font-medium rounded-lg text-white text-sm px-5 py-3 w-full transition-all duration-200`}
            onClick={handleButtonClick}
            disabled={loading}
          >
            {loading ? "Loading..." : "Find User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Body;
