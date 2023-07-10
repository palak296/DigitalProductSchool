import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import UserContext from "../utilities/UserContext";
import { BiSearch } from "react-icons/bi";

const HomePage = () => {
  const [sdata, setsdata] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  console.log(userContext.username);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${userContext.username}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setsdata(data);
        } else {
          setError("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data ");
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Header />


      {isLoading ? (
        <div className="text-gray-200">Loading...</div>
      ) : (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">

          {error ? (

            <div className="text-gray-200  text-3xl bg-gray-900">
              {error}❗
              <button
                className=" mt-2 ml-6 px-5 py-2 rounded-md flex items-center bg-gray-800 text-white hover:bg-gray-700 focus:outline-none "
                onClick={() => navigate(-1)}
              >
                Back to <span className="ml-2 text-4xl text-yellow-400"><BiSearch /></span>
              </button>
            </div>

          ) : (

            <div className="rounded-xl overflow-hidden bg-gray-900 md:shadow-2xl w-full md:w-2/3 lg:w-1/3">
              <button
                className=" mt-2 ml-2 px-5 py-2 rounded-md flex items-center bg-gray-800 text-white hover:bg-gray-700 focus:outline-none "
                onClick={() => navigate(-1)}
              >
                Back to <span className="ml-2 text-2xl text-yellow-400"><BiSearch /></span>
              </button>
              <div className="px-6 py-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full border-2 border-yellow-300 overflow-hidden w-32 h-32">
                    <img
                      className="w-full h-full "
                      src={sdata.avatar_url}
                      alt="Avatar"
                    />
                  </div>
                  <div className="text-2xl font-bold text-gray-200 mt-4">
                    {sdata.name}
                  </div>
                  <div className="text-xl font-bold text-gray-400 mt-2">
                    @{sdata.login}
                  </div>
                  <div className="flex justify-evenly mt-4">
                    <Link to="/follower">
                      <span className="font-semibold rounded-md bg-red-300 p-2 text-gray-900 hover:font-bold">
                        Followers: {sdata.followers}
                      </span>
                    </Link>
                    <Link to="/following">
                      <span className="ml-5 font-semibold rounded-md bg-red-300  text-gray-900 p-2 hover:font-bold">
                        Following: {sdata.following}
                      </span>
                    </Link>
                  </div>
                  <Link to="/repositories">
                    <div className="mt-4 font-semibold rounded-md bg-yellow-300 p-2 text-gray-900 hover:font-bold">
                      Public Repositories: {sdata.public_repos}
                    </div>
                  </Link>
                  <Link to="/contributions">
                    <div className="mt-4 font-semibold rounded-md bg-blue-200 p-2 text-gray-900 hover:font-bold">
                      Contributions
                    </div>
                  </Link>
                  <button className=" px-4 py-2 rounded-md mt-4 ">
                    <a
                      href={sdata.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="font-bold hover:bg-gray-500  text-white border-2 p-3">
                        Visit Github Profile
                      </span>
                    </a>
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HomePage;
