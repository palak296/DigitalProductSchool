import { Link } from "react-router-dom";

const Header = () => {

  return (
    <nav className="bg-gray-900 py-6 w-full fixed">
      <div className="container flex items-center justify-center mx-auto">
        <Link to="/">
          <span className="text-2xl text-yellow-500">
            github<span className="font-bold text-white">Finder</span>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
