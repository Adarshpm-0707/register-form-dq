import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbwWoTdqw8OI5h6hjvcqIkSMiIYRn2TmM",
  authDomain: "deepstaq-98c0d.firebaseapp.com",
  projectId: "deepstaq-98c0d",
  storageBucket: "deepstaq-98c0d.firebasestorage.app",
  messagingSenderId: "1003753041298",
  appId: "1:1003753041298:web:6006ea9ae19f43c25ba54b",
  measurementId: "G-CY39BN8JWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
