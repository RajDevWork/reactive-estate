import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 border border-slate-200">
          {/* Heading */}
          <p className="text-slate-700 text-lg">
            Contact{" "}
            <span className="font-semibold text-indigo-600">
              {landlord.username}
            </span>{" "}
            about{" "}
            <span className="font-semibold text-slate-900">
              {listing.name.toLowerCase()}
            </span>
          </p>

          {/* Message box */}
          <textarea
            name="message"
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-inner"
          ></textarea>

          {/* Send button */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="inline-block text-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
