import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  const [ recommendedListings,  setRecommendedListings] = useState([]);

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
  //Fetch AI based listing
  const fetchRecommendations =
  async () => {
    const res = await fetch(
      "/api/listing/recommendations"
    );

    const data = await res.json();

    setRecommendedListings(data);
  };


  useEffect(() => {
    fetchListings("offer=true&limit=4&order=desc", setOfferListings);
    fetchListings("type=rent&limit=4", setRentListings);
    fetchListings("type=sale&limit=4", setSaleListings);
    fetchRecommendations();

  }, []);


  // console.log("recommendedListings = ",recommendedListings)

  return (
    <div className="pb-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/** 🏠 Top Section */}
      <div className="flex flex-col gap-8 p-8 sm:p-12 lg:p-20 max-w-full mx-auto text-center lg:text-left relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-ping"></div>
        
        {/* Main background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-3xl backdrop-blur-sm"></div>
        
        {/* Heading */}
        <h1 className="text-slate-800 font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight relative z-10">
          Unlock Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">Dream</span> <span className="text-slate-800">Space</span>
          <br className="hidden sm:block" /> with Confidence
        </h1>

        {/* Sub Text */}
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed relative z-10">
          From cozy apartments to luxury villas — Reactive Estate helps you discover 
          properties that perfectly fit your lifestyle and ambitions.  
          The right home is just a click away.
        </p>

        {/* CTA Button */}
        <Link
          to="/search"
          className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 w-fit mx-auto lg:mx-0 transform hover:-translate-y-2 relative z-10 border-2 border-white/20 backdrop-blur-sm"
        >
          Start Exploring →
        </Link>
      </div>


      {/** 🖼️ Middle - Swiper Carousel */}
      <div className="max-w-7xl mx-auto px-4 mb-16 relative">
        {/* Enhanced Decorative elements */}
        <div className="absolute -top-12 left-12 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-spin shadow-lg"></div>
        <div className="absolute -top-8 right-24 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 animate-bounce shadow-md"></div>
        <div className="absolute -bottom-8 left-1/3 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-50 animate-pulse shadow-sm"></div>
        <div className="absolute top-1/2 left-4 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute top-1/2 right-4 w-4 h-4 bg-orange-400 rounded-full opacity-80 animate-ping animation-delay-1000"></div>
        
        {/* Custom Navigation Buttons */}
        <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
          <button className="swiper-button-prev-custom bg-white/20 backdrop-blur-md text-white w-12 h-12 rounded-full shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30">
            ‹
          </button>
        </div>
        <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
          <button className="swiper-button-next-custom bg-white/20 backdrop-blur-md text-white w-12 h-12 rounded-full shadow-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30">
            ›
          </button>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            renderBullet: (index, className) => {
              return `<span class="${className} bg-white/30 backdrop-blur-sm border border-white/20"></span>`;
            }
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm relative"
        >
          {offerListings?.length > 0 &&
            offerListings.map((listing, index) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="w-full h-full relative group overflow-hidden"
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  {/* Multiple overlay layers */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Animated particles */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
                  <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-50 animate-bounce"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8 text-white transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                        HOT DEAL
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                        Limited Time
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-2xl mb-3 transform scale-95 group-hover:scale-100 transition-transform duration-500">
                      {listing.name}
                    </h2>
                    <p className="text-lg opacity-90 drop-shadow-lg mb-4">
                      🔥 Exclusive Offer - Save Big!
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transform hover:scale-105 transition-transform">
                        View Details
                      </span>
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transform hover:scale-105 transition-transform">
                        Contact Agent
                      </span>
                    </div>
                  </div>
                  
                  {/* Slide counter */}
                  <div className="absolute top-8 right-8 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold border border-white/20">
                    {index + 1} / {offerListings.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        
        {/* Progress bar */}
        <div className="mt-6 flex justify-center">
          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/** 📌 Bottom - Listings Section */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-20 mt-20">
        {/* Offers */}
        {offerListings?.length > 0 && (
          <Section
            title="Recent Offers"
            link="/search?offer=true"
            listings={offerListings}
            icon=""
          />
        )}

        {/* AI Recommendation */}

        {recommendedListings?.length > 0 && (
          <Section
            title="AI Recommended"
            link="/search"
            listings={recommendedListings}
            icon="✨"
          />
        )}

        {/* Rent */}
        {rentListings?.length > 0 && (
          <Section
            title="Recent Places for Rent"
            link="/search?type=rent"
            listings={rentListings}
            icon=""
          />
        )}

        {/* Sale */}
        {saleListings?.length > 0 && (
          <Section
            title="Recent Places for Sale"
            link="/search?type=sale"
            listings={saleListings}
            icon=""
          />
        )}
      </div>
    </div>
  );
}

/** ✅ Reusable Section Component */
function Section({ title, link, listings, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 relative overflow-hidden group">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-500">{icon}</div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span className="text-2xl">{icon}</span>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{title}</span>
          </h2>
          <Link 
            to={link} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 border-2 border-white/20"
          >
            Show more →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {listings.map((listing) => (
            <div key={listing._id} className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group/item">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <ListingItem listing={listing} />

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
