    // login.js
<<<<<<< HEAD
import { auth, provider, signInWithPopup, signOut } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const handleLogin = async (setUser, setMessages, setError) => {
  try {
    setError(null);
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    await loadChatHistory(result.user.uid, setMessages, setError);
  } catch (error) {
    console.error("Login failed:", error);
    setError("Login failed");
  }
};

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

export const loadChatHistory = async (userId, setMessages, setError) => {
  try {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const q = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      where("timestamp", ">", sevenDaysAgo)
    );
    const querySnapshot = await getDocs(q);
    const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(chats);
  } catch (error) {
    console.error("Error loading chat history:", error);
    setError("Failed to load chat history");
  }
};
=======
    import { auth, provider, signInWithPopup, signOut } from "../firebase";
    import { collection, query, where, getDocs } from "firebase/firestore";
    import { db } from "../firebase";
    
    export const handleLogin = async (setUser, setMessages, setError) => {
      try {
        setError(null);
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        await loadChatHistory(result.user.uid, setMessages, setError);
      } catch (error) {
        console.error("Login failed:", error);
        setError("Login failed");
      }
    };
    
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
    
    export const loadChatHistory = async (userId, setMessages, setError) => {
      try {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const q = query(
          collection(db, "chats"),
          where("userId", "==", userId),
          where("timestamp", ">", sevenDaysAgo)
        );
        const querySnapshot = await getDocs(q);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(chats);
      } catch (error) {
        console.error("Error loading chat history:", error);
        setError("Failed to load chat history");
      }
    };
>>>>>>> eabef92 (03/02-changes)
