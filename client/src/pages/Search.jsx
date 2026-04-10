import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchterm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      setShowMore(data.length > 4);
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (["all", "rent", "sale"].includes(e.target.id)) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchterm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("order", sidebarData.order);
    urlParams.set("sort", sidebarData.sort);

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listing.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    const res = await fetch(`/api/listing/get?${urlParams}`);
    const data = await res.json();
    if (data.length < 4) setShowMore(false);
    setListing([...listing, ...data]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="md:w-80 p-8 bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-30 animate-bounce"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              🔍 Search Filters
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Search Term */}
              <div className="group">
                <label className="block font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">
                  Search Term
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Enter location, property type..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="group">
                <label className="block font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "all", label: "All Types", icon: "🏠" },
                    { id: "rent", label: "For Rent", icon: "🏢" },
                    { id: "sale", label: "For Sale", icon: "💰" }
                  ].map((type) => (
                    <label key={type.id} className="relative">
                      <input
                        type="radio"
                        name="type"
                        id={type.id}
                        checked={sidebarData.type === type.id}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="p-3 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-md peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-lg bg-white/50 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-sm font-medium text-slate-700">{type.label}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Offer checkbox */}
                <div className="mt-4">
                  <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-green-400 hover:shadow-md bg-white/50 backdrop-blur-sm">
                    <input
                      type="checkbox"
                      id="offer"
                      checked={sidebarData.offer}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔥</span>
                      <span className="font-medium text-slate-700">Special Offers</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div className="group">
                <label className="block font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
                  Amenities
                </label>
                <div className="space-y-3">
                  {[
                    { id: "parking", label: "Parking Available", icon: "🚗" },
                    { id: "furnished", label: "Furnished", icon: "🛋️" }
                  ].map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-md bg-white/50 backdrop-blur-sm">
                      <input
                        type="checkbox"
                        id={amenity.id}
                        checked={sidebarData[amenity.id]}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{amenity.icon}</span>
                        <span className="font-medium text-slate-700">{amenity.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="group">
                <label className="block font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    id="sort_order"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none"
                    onChange={handleChange}
                    defaultValue={"createdAt_desc"}
                  >
                    <option value="regularPrice_desc">💰 Price: High to Low</option>
                    <option value="regularPrice_asc">💰 Price: Low to High</option>
                    <option value="createdAt_desc">🕒 Latest First</option>
                    <option value="createdAt_asc">🕒 Oldest First</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm"
              >
                🔍 Search Properties
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Search Results
            </h1>
            <p className="text-slate-600 text-lg">
              {listing.length > 0 ? `Found ${listing.length} amazing properties` : 'Start your search to find your dream home'}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-700 animate-pulse">
                Finding your perfect home...
              </p>
              <div className="mt-4 flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && listing.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Properties Found</h3>
              <p className="text-slate-600 text-lg max-w-md">
                Try adjusting your search criteria or explore different filters to find more options.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                🔄 Try Again
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && listing.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listing.map((list, index) => (
                <div 
                  key={list._id} 
                  className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-slate-200 group-hover:border-blue-300">
                    <ListingItem listing={list} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show More Button */}
          {showMore && (
            <div className="text-center mt-12">
              <button
                onClick={onShowMoreClick}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform border-2 border-white/20 backdrop-blur-sm"
              >
                Load More Properties 📦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
