// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMRkv81uBdkGmKTi9e2RniEwgxPabEkgE",
  authDomain: "amigos-store-193a3.firebaseapp.com",
  projectId: "amigos-store-193a3",
  storageBucket: "amigos-store-193a3.appspot.com",
  messagingSenderId: "488706658849",
  appId: "1:488706658849:web:b04a2082f7bbae419e0960",
  measurementId: "G-09JQ7S0KW2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//  Export Firebase services properly
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore Database
export const storage = getStorage(app); // Firebase Storage
export { app }; // Explicitly exporting app
