import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

// Initialize Google Provider
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Returns user information after successful login
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Function to handle Sign-Out
const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
};

// Export authentication functions
export { provider, signInWithGoogle, signOut };
