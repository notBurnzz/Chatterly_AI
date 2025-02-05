import { createContext, useContext, useEffect, useState } from "react";
import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "../services/firebase";
import { useAuth } from "./AuthContext";

// ✅ Create Chat Context
const ChatContext = createContext();

/**
 * ✅ ChatProvider Component
 * Provides chat state & methods to child components
 */
export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("googleai"); // Default AI model
  const [error, setError] = useState(null);

  // ✅ Load chat history on user or model change
  useEffect(() => {
    if (user) {
      loadChatHistory(user.uid);
    } else {
      setMessages([]); // Clear messages on logout
      setLoading(false);
    }
  }, [user, selectedModel]);

  /**
   * ✅ Load last 7 days' chat history from Firestore
   */
  async function loadChatHistory(userId) {
    setLoading(true);
    setError(null);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(db, "chats"),
        where("userId", "==", userId),
        where("model", "==", selectedModel),
        where("timestamp", ">", sevenDaysAgo),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const chatHistory = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.(),
      }));

      setMessages(chatHistory);
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * ✅ Save a new message to Firebase
   */
  async function saveMessage(message) {
    if (!user) return;

    try {
      const newMessage = {
        ...message,
        userId: user.uid,
        model: selectedModel,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "chats"), newMessage);
      setMessages((prev) => [...prev, { ...newMessage, timestamp: new Date() }]);
    } catch (err) {
      console.error("Error saving message:", err);
      setError("Failed to save message. Please try again.");
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        error,
        selectedModel,
        setSelectedModel,
        saveMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// ✅ Custom hook to use ChatContext
export function useChat() {
  return useContext(ChatContext);
}
