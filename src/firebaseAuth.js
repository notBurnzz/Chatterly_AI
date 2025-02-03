<<<<<<< HEAD
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
=======
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { fetchChatSessions } from "./firebaseUtils"; // Import chat fetching function

/**
 * 🔹 Google Sign-In
 * - Authenticates the user via Google.
 * - Fetches chat history upon successful login.
 */
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user) throw new Error("User data is missing!");

    // Fetch user chat history immediately after login
    const chatSessions = await fetchChatSessions(user.uid);

    return { user, chatSessions };
  } catch (error) {
    console.error("🚨 Google Sign-In Error:", error.message);
>>>>>>> eabef92 (03/02-changes)
    throw error;
  }
};

<<<<<<< HEAD
// Function to handle Sign-Out
=======
/**
 * 🔹 Google Sign-Out
 * - Logs out the user from Firebase authentication.
 */
>>>>>>> eabef92 (03/02-changes)
const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
<<<<<<< HEAD
    console.error("Sign-Out Error:", error);
=======
    console.error("🚨 Sign-Out Error:", error.message);
>>>>>>> eabef92 (03/02-changes)
    throw error;
  }
};

<<<<<<< HEAD
// Export authentication functions
export { provider, signInWithGoogle, signOut };
=======
// 🔹 Export authentication functions
export { signInWithGoogle, signOut };
>>>>>>> eabef92 (03/02-changes)
