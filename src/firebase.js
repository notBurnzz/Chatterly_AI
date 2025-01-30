import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYLebCzi5BBKtDm0xLYHuRNjEIGT2g0oM",
  authDomain: "chatterly-ai.firebaseapp.com",
  projectId: "chatterly-ai",
  storageBucket: "chatterly-ai.appspot.com",
  messagingSenderId: "282308678619",
  appId: "1:282308678619:web:cc5dd3dc5f514166d2cdfe",
  measurementId: "G-GH8QE4S3N6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Ensure Firestore is initialized
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Logout function
const logout = () => signOut(auth);

// ✅ Export Firestore (db), Auth, and other Firebase utilities
export { 
  app, 
  db,  // ✅ Ensure db is exported
  auth, 
  signInWithGoogle, 
  logout,
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  serverTimestamp
};
