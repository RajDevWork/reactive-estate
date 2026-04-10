import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="relative overflow-hidden py-24 px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),_transparent_30%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-1/2">
            <span className="inline-flex rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
              About Reactive Estate
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Modern real estate, built for the way people live today.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-gray-600">
              At Reactive Estates, we blend verified listings, intelligent search, and a premium experience so every property journey feels effortless. Whether buying, renting, or selling, our platform helps users move faster with confidence.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50 backdrop-blur-xl">
                <p className="text-3xl font-bold text-indigo-600">10K+</p>
                <p className="mt-2 text-sm text-gray-600">Verified clients trusting our listings</p>
              </div>
              <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50 backdrop-blur-xl">
                <p className="text-3xl font-bold text-purple-600">4.9</p>
                <p className="mt-2 text-sm text-gray-600">Average rating across our premium properties</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
              >
                Explore listings
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white/5 px-8 py-4 text-base font-semibold text-gray-900 transition hover:border-indigo-500 hover:bg-gray-50"
              >
                Sign in to manage
              </Link>
            </div>
          </div>

          <div className="relative lg:w-1/2">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[40px] border border-gray-200 bg-white shadow-2xl shadow-gray-200/40">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury property interior"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-gray-600">Premium living</p>
                <p className="mt-3 text-2xl font-semibold text-gray-900">Designed for modern comfort</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-24 rounded-[32px] border border-gray-200 bg-white px-6 py-10 shadow-2xl shadow-gray-200/50 backdrop-blur-xl sm:px-10">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Verified listings",
                description: "High quality properties backed by real-time data and trusted sources.",
                accentClass: "text-indigo-600",
              },
              {
                title: "Seamless discovery",
                description: "Smart search tools and filters to find your right home faster.",
                accentClass: "text-purple-600",
              },
              {
                title: "Full support",
                description: "A trusted network of agents and resources for every step of your journey.",
                accentClass: "text-indigo-600",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/20">
                <p className={`text-3xl font-bold ${feature.accentClass}`}>{feature.title}</p>
                <p className="mt-3 text-sm leading-7 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
