// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "reactiveestates.firebaseapp.com",
  projectId: "reactiveestates",
  storageBucket: "reactiveestates.firebasestorage.app",
  messagingSenderId: "503131997600",
  appId: "1:503131997600:web:d8c3fd1b4ecda909ea50c5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);