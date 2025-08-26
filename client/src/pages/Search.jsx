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
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Search Term */}
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Search:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div>
            <label className="font-semibold text-gray-700">Type:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["all", "rent", "sale"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={type}
                    checked={sidebarData.type === type}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  checked={sidebarData.offer}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span>Offer</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-semibold text-gray-700">Amenities:</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  checked={sidebarData.parking}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span>Parking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={sidebarData.furnished}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span>Furnished</span>
              </label>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="font-semibold text-gray-700">Sort By:</label>
            <select
              id="sort_order"
              className="border rounded-lg px-4 py-2 mt-2 w-full bg-white focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold border-b p-4 text-gray-800">
          Search Results
        </h1>
        <div className="p-7 flex flex-wrap gap-6">
          {!loading && listing.length === 0 && (
            <p className="text-lg text-gray-600">No listing found!</p>
          )}
          {loading && (
            <p className="text-lg w-full text-center text-gray-600">
              Loading...
            </p>
          )}
          {!loading &&
            listing.map((list) => (
              <ListingItem key={list._id} listing={list} />
            ))}
        </div>

        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-blue-600 hover:underline py-5 font-semibold w-full text-center"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
