import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // Ensures Google account selection

/**
 * Handles Google Sign-In
 * - Returns user object on success
 * - Throws an error if login fails
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Returns authenticated user
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw new Error("Failed to sign in. Please try again.");
  }
};

/**
 * Handles User Sign-Out
 * - Logs out the user from Firebase Authentication
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error.message);
    throw new Error("Failed to sign out. Please try again.");
  }
};

// Export provider for direct usage in other components if needed
export { provider, auth };
