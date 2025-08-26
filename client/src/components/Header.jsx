import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchterm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchterm", searchterm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchterm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">
            <span className="text-indigo-600">Reactive</span>
            <span className="text-slate-800">Estate</span>
          </h1>
        </Link>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 px-3 py-2 rounded-full flex items-center shadow-inner w-32 sm:w-72 transition focus-within:ring-2 focus-within:ring-indigo-500"
        >
          <input
            type="text"
            placeholder="Search homes..."
            className="bg-transparent focus:outline-none text-sm sm:text-base w-full"
            value={searchterm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600 hover:text-indigo-600 transition" />
          </button>
        </form>

        {/* Navigation */}
        <ul className="flex gap-6 items-center font-medium">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:text-indigo-600 transition">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:text-indigo-600 transition">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full w-9 h-9 border-2 border-indigo-500 hover:scale-105 transition-transform object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
