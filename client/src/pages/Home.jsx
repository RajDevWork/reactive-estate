import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  // 🟢 Reusable fetcher function
  const fetchListings = async (query, setter) => {
    try {
      const res = await fetch(`/api/listing/get?${query}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchListings("offer=true&limit=4&order=desc", setOfferListings);
    fetchListings("type=rent&limit=4", setRentListings);
    fetchListings("type=sale&limit=4", setSaleListings);
  }, []);

  return (
    <div className="pb-10">
      {/** 🏠 Top Section */}
      <div className="flex flex-col gap-6 p-8 sm:p-12 lg:p-20 max-w-6xl mx-auto text-center lg:text-left">
  {/* Heading */}
  <h1 className="text-slate-800 font-extrabold text-3xl sm:text-4xl lg:text-6xl leading-tight">
    Unlock Your <span className="text-indigo-600">Dream</span><span className="text-slate-800"> Space</span>
    <br className="hidden sm:block" /> with Confidence
  </h1>

  {/* Sub Text */}
  <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
    From cozy apartments to luxury villas — Reactive Estate helps you discover 
    properties that perfectly fit your lifestyle and ambitions.  
    The right home is just a click away.
  </p>

  {/* CTA Button */}
  <Link
    to="/search"
    className="inline-block bg-blue-600 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 w-fit mx-auto lg:mx-0"
  >
    Start Exploring →
  </Link>
</div>


      {/** 🖼️ Middle - Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-[400px] sm:h-[500px] lg:h-[600px]"
      >
        {offerListings?.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="w-full h-full rounded-xl shadow-md"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                <div className="bg-black/40 w-full h-full flex items-center justify-center rounded-xl">
                  <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
                    {listing.name}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/** 📌 Bottom - Listings Section */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-12 mt-12">
        {/* Offers */}
        {offerListings?.length > 0 && (
          <Section
            title="Recent Offers"
            link="/search?offer=true"
            listings={offerListings}
          />
        )}

        {/* Rent */}
        {rentListings?.length > 0 && (
          <Section
            title="Recent Places for Rent"
            link="/search?type=rent"
            listings={rentListings}
          />
        )}

        {/* Sale */}
        {saleListings?.length > 0 && (
          <Section
            title="Recent Places for Sale"
            link="/search?type=sale"
            listings={saleListings}
          />
        )}
      </div>
    </div>
  );
}

/** ✅ Reusable Section Component */
function Section({ title, link, listings }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-700">{title}</h2>
        <Link to={link} className="text-blue-700 text-sm hover:underline">
          Show more →
        </Link>
      </div>
      <div className="flex flex-wrap gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
