// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // If the user document exists, use its data
          setUser({ uid: firebaseUser.uid, ...docSnap.data() });
        } else {
          // If no document exists, create a fallback.
          // Check if the email matches the admin email.
          const role = firebaseUser.email === "patcher787@gmail.com" ? "admin" : "customer";
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firebaseUser.displayName || "",
            role,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Called after sign up to store additional user data in Firestore
  const signup = async ({ firstName, email, uid }) => {
    try {
      // Assign admin role if email matches, else customer.
      const role = email === "patcher787@gmail.com" ? "admin" : "customer";
      await setDoc(doc(db, "users", uid), {
        firstName,
        email,
        role,
      });
      setUser({ uid, firstName, email, role });
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
