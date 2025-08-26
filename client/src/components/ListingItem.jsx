import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl overflow-hidden w-full sm:w-[280px]">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <div className="relative w-full h-[220px] sm:h-[200px] overflow-hidden">
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          {/* Title */}
          <p className="truncate text-lg font-semibold text-slate-800">
            {listing.name}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MdLocationOn className="w-5 h-5 text-green-600 shrink-0" />
            <p className="truncate">{listing.address}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {listing.description}
          </p>

          {/* Price */}
          <p className="text-indigo-600 font-bold text-base">
            ${" "}
            {listing.offer
              ? Number(listing?.discountPrice).toLocaleString("en-IN")
              : Number(listing?.regularPrice).toLocaleString("en-IN")}
            {listing.type === "rent" && " / month"}
          </p>

          {/* Beds & Baths */}
          <div className="flex gap-6 text-slate-700 text-xs font-medium">
            <span>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </span>
            <span>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
