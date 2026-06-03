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
    <header className="sticky top-0 z-50 bg-white/90 shadow-lg backdrop-blur-md border-b border-gray-200/75">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link to="/" className="inline-flex items-center gap-3 rounded-3xl bg-gray-100/80 px-4 py-3 text-gray-900 shadow-xl shadow-indigo-500/10 transition hover:bg-gray-100">
            <div className="flex h-10 w-10 text-white items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-lg shadow-indigo-500/20">
              R
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-indigo-600/90">Reactive</p>
              <p className="text-lg font-bold text-gray-900">Estate</p>
            </div>
          </Link>

          <div className="hidden rounded-full bg-gray-100/80 px-5 py-3 text-gray-600 ring-1 ring-gray-300/80 sm:inline-flex items-center gap-4 shadow-inner">
            <Link to="/" className={`text-sm font-medium transition hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link to="/about" className={`text-sm font-medium transition hover:text-indigo-600 ${location.pathname === '/about' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
              About
            </Link>
            <Link to="/search" className={`text-sm font-medium transition hover:text-indigo-600 ${location.pathname === '/search' ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
              Search
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 shadow-inner sm:w-[380px]">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search homes, city or area"
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
              value={searchterm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110">
              Search
            </button>
          </form>

          <div className="inline-flex items-center gap-3">
            {currentUser ? (
              <Link to="/profile" className="inline-flex items-center gap-3 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 shadow-lg shadow-gray-200/20 transition hover:border-indigo-500 hover:bg-gray-100">
                <img src={currentUser.avatar} alt="profile" className="h-10 w-10 rounded-full object-cover" />
                <span className="hidden sm:inline">My Profile</span>
              </Link>
            ) : (
              <Link to="/sign-in" className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:brightness-110">
                Sign In
              </Link>
              
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
