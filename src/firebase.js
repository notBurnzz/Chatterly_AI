import { initializeApp } from "firebase/app";
<<<<<<< HEAD
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
=======
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";

// 🔹 Firebase configuration
>>>>>>> eabef92 (03/02-changes)
const firebaseConfig = {
  apiKey: "AIzaSyBYLebCzi5BBKtDm0xLYHuRNjEIGT2g0oM",
  authDomain: "chatterly-ai.firebaseapp.com",
  projectId: "chatterly-ai",
  storageBucket: "chatterly-ai.appspot.com",
  messagingSenderId: "282308678619",
  appId: "1:282308678619:web:cc5dd3dc5f514166d2cdfe",
  measurementId: "G-GH8QE4S3N6",
};

<<<<<<< HEAD
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
=======
// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * 🔹 Save Chat to Firebase
 * - Stores messages under a specific model per user.
 * - Ensures each session is grouped properly.
 */
const saveChatToFirebase = async (userId, model, message) => {
  if (!userId) return;

  try {
    const userChatRef = doc(db, "users", userId); // Changed to "users" for better structure
    const chatCollectionRef = collection(userChatRef, model);

    // Fetch existing chat session
    const chatDoc = await getDoc(userChatRef);
    const chatData = chatDoc.exists() ? chatDoc.data() : {};
    const existingChats = chatData[model] || [];

    if (existingChats.length > 0) {
      // Append to the latest chat session
      const lastChatId = existingChats[existingChats.length - 1].id;
      const lastChatRef = doc(chatCollectionRef, lastChatId);

      await updateDoc(lastChatRef, {
        messages: arrayUnion({
          text: message.text,
          timestamp: serverTimestamp(),
          sender: message.sender
        })
      });
    } else {
      // Create a new chat session with first message as heading
      const newChatRef = doc(chatCollectionRef);
      await setDoc(newChatRef, {
        id: newChatRef.id,
        title: message.text, // First message as heading
        messages: [
          {
            text: message.text,
            timestamp: serverTimestamp(),
            sender: message.sender
          }
        ],
        createdAt: serverTimestamp()
      });

      await setDoc(userChatRef, {
        [model]: arrayUnion({
          id: newChatRef.id,
          title: message.text
        })
      }, { merge: true });
    }
  } catch (error) {
    console.error("🚨 Error saving chat:", error);
  }
};

/**
 * 🔹 Fetch Chat Sessions for Sidebar
 * - Fetches all chat sessions grouped by AI model.
 */
const fetchChatSessions = async (userId) => {
  if (!userId) return [];

  try {
    const userChatRef = doc(db, "users", userId);
    const chatDoc = await getDoc(userChatRef);

    if (chatDoc.exists()) {
      return Object.values(chatDoc.data()).flat(); // Extract all model chats
    }
  } catch (error) {
    console.error("🚨 Error fetching chat sessions:", error);
  }
  return [];
};

// 🔹 Export Firebase utilities
export {
  app,
  db,
  auth,
  googleProvider,
  saveChatToFirebase,
  fetchChatSessions,
  collection,
  addDoc,
  query,
  where,
>>>>>>> eabef92 (03/02-changes)
  getDocs,
  orderBy,
  serverTimestamp
};
