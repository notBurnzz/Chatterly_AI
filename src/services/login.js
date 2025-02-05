import { auth, googleProvider, signInWithPopup, signOut } from "../services/firebase";

/**
 * 🔹 Handle Google Login
 */
export const handleLogin = async (setUser, setMessages, setError) => {
  try {
    setError(null);
    const result = await signInWithPopup(auth, googleProvider); // ✅ Use googleProvider
    setUser(result.user);
  } catch (error) {
    console.error("Login failed:", error);
    setError("Login failed");
  }
};

/**
 * 🔹 Handle Google Logout
 */
export const handleLogout = async (setUser, setMessages, setError) => {
  try {
    await signOut(auth);
    setUser(null);
    setMessages([]);
    setError(null);
  } catch (error) {
    console.error("Logout failed:", error);
    setError("Logout failed");
  }
};
