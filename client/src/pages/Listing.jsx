import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa';
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSelector } from 'react-redux';
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [listData, setListData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listID = params.listingID;

      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${listID}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setListData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingID]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {loading && <p className="text-center text-2xl my-12 text-gray-600">Loading beautiful property details...</p>}
      {error && <p className="text-center text-2xl my-12 text-red-600">Something went wrong — please try again.</p>}

      {listData && !loading && !error && (
        <div className="relative overflow-hidden pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.06),_transparent_25%)] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop={true}
                className="h-[520px] md:h-[620px]"
              >
                {listData.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }}>
                      <div className="h-full w-full bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                type="button"
                onClick={handleShare}
                className="absolute top-6 right-6 z-20 w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300 shadow-lg"
              >
                <FaShare className="text-xl" />
              </button>

              {isCopied && (
                <div className="absolute top-24 right-6 z-20 rounded-2xl bg-white/95 border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-xl">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr] mt-10">
              <section className="space-y-8">
                <div className="rounded-[28px] bg-white border border-gray-200 p-8 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-indigo-600/70 mb-2">Premium Listing</p>
                      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{listData.name}</h1>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-600">
                        ${listData.offer ? Number(listData.discountPrice).toLocaleString('en-US') : Number(listData.regularPrice).toLocaleString('en-US')}
                      </p>
                      {listData.type === 'rent' && <p className="text-sm text-gray-500">/ month</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 border border-gray-300">
                        <FaMapMarkerAlt /> {listData.address}
                      </span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${listData.type === 'rent' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                        {listData.type === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                      {listData.offer && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-700 border border-red-200">
                          Discount ${Number(listData.regularPrice) - Number(listData.discountPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 leading-8 mt-6">
                    <span className="font-semibold text-gray-900">Property Description:</span> {listData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-3xl bg-white border border-gray-200 p-5 text-center shadow-lg">
                    <p className="text-2xl font-bold text-gray-900">{listData.bedrooms}</p>
                    <p className="text-sm text-gray-500 mt-2">Bedrooms</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-gray-200 p-5 text-center shadow-lg">
                    <p className="text-2xl font-bold text-gray-900">{listData.bathrooms}</p>
                    <p className="text-sm text-gray-500 mt-2">Bathrooms</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-gray-200 p-5 text-center shadow-lg">
                    <p className="text-2xl font-bold text-gray-900">{listData.parking ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-500 mt-2">Parking</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-gray-200 p-5 text-center shadow-lg">
                    <p className="text-2xl font-bold text-gray-900">{listData.furnished ? 'Furnished' : 'Unfurnished'}</p>
                    <p className="text-sm text-gray-500 mt-2">Interior</p>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-[28px] bg-white border border-gray-200 p-8 shadow-2xl backdrop-blur-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h2>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                      <span>Listing type</span>
                      <span className="font-semibold text-gray-900">{listData.type === 'rent' ? 'Rent' : 'Sale'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                      <span>Offer available</span>
                      <span className="font-semibold text-gray-900">{listData.offer ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                      <span>Area</span>
                      <span className="font-semibold text-gray-900">{listData.area || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white border border-gray-200 p-8 shadow-2xl backdrop-blur-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Action Center</h2>
                  {currentUser && listData.userRef !== currentUser._id && !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-3xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                      Contact Landlord
                    </button>
                  )}
                  {contact && <Contact listing={listData} />}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
