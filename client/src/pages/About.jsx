import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
            About <span className="text-indigo-600">Reactive</span>
            <span className="text-slate-800">Estate</span>
          </h2>
          <p className="text-lg text-gray-600">
            We’re redefining the way people discover their dream homes. At{" "}
            <span className="font-semibold text-slate-700">Reactive Estates</span>, 
            our mission is to make property search simple, transparent, and stress-free.
          </p>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=60"
              alt="Modern House"
              className="rounded-3xl shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl w-64">
              <p className="text-2xl font-bold text-blue-600">10,000+</p>
              <p className="text-sm text-gray-500">Happy Clients</p>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Find, Rent or Buy – All in One Place
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              From affordable rentals to premium villas, we bring together verified listings 
              and advanced tools to help you make smarter property decisions. 
              With trusted agents, transparent details, and modern technology, 
              Reactive Estates is more than just a search platform – it’s your real estate partner.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">🔍 Verified Listings</h4>
                <p className="text-gray-500 text-sm">
                  All properties are verified with accurate details, updated regularly.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">⚡ Smart Search</h4>
                <p className="text-gray-500 text-sm">
                  Use filters and location-based tools to find your perfect property quickly.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">🤝 Trusted Network</h4>
                <p className="text-gray-500 text-sm">
                  Connect with reliable agents and thousands of happy clients nationwide.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">🏡 Wide Range</h4>
                <p className="text-gray-500 text-sm">
                  From rentals to luxury villas, we cover every segment of real estate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            Your dream home is just a click away 🚀
          </h3>
          <Link to="/search" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
