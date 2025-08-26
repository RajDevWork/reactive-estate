import React from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // API call to backend for saving/validating user
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        console.error("Backend error:", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Could not sign in with Google:", error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-5 rounded-lg uppercase font-medium shadow-md hover:bg-red-700 hover:shadow-lg transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google logo"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
}
