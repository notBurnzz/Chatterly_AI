import { auth, googleProvider, signInWithPopup, signOut } from "../services/firebase";

/**
 * 🔹 Handle Google Login
 */
export const handleLogin = async (setUser, setMessages, setError) => {
  try {
    setError(null);
    const result = await signInWithPopup(auth, googleProvider); // ✅ Use googleProvider
    setUser(result.user);

    // ✅ Store user data in local storage for session persistence
    localStorage.setItem("user", JSON.stringify(result.user));
  } catch (error) {
    console.error("Login failed:", error);
    setError("Login failed. Please try again.");
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

    // ✅ Remove user from local storage
    localStorage.removeItem("user");

    setError(null);
  } catch (error) {
    console.error("Logout failed:", error);
    setError("Logout failed. Please try again.");
  }
};

/**
 * 🔹 Check for an existing session (Auto-login on refresh)
 */
export const checkUserSession = (setUser) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
};
