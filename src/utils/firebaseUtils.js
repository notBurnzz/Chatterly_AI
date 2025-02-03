import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

/**
 * 🔹 Save Chat Message
 * - Stores messages in Firestore under user-specific chat sessions.
 * - Ensures messages are grouped properly inside a session.
 */
export const saveChatToFirebase = async (userId, model, message) => {
  if (!userId || !message.text.trim()) return;

  try {
    const userChatRef = doc(db, "users", userId);
    const chatCollectionRef = collection(userChatRef, "chats"); // Store chats under "chats"

    // Get existing chat sessions
    const chatDoc = await getDoc(userChatRef);
    const chatData = chatDoc.exists() ? chatDoc.data() : {};
    const existingChats = chatData[model] || [];

    if (existingChats.length > 0) {
      // Append message to the latest chat session
      const lastChatId = existingChats[existingChats.length - 1].id;
      const lastChatRef = doc(chatCollectionRef, lastChatId);

      await updateDoc(lastChatRef, {
        messages: arrayUnion({
          text: message.text,
          timestamp: serverTimestamp(),
          sender: message.sender,
        }),
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
            sender: message.sender,
          },
        ],
        createdAt: serverTimestamp(),
      });

      // Add new chat reference to the user
      await setDoc(userChatRef, {
        [model]: arrayUnion({ id: newChatRef.id, title: message.text }),
      }, { merge: true });
    }
  } catch (error) {
    console.error("🚨 Error saving chat:", error);
  }
};

/**
 * 🔹 Load Chat History
 * - Retrieves chat messages for a specific model (last 7 days).
 */
export const loadChatHistory = async (userId, model, setMessages, setError) => {
  if (!userId) return;

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, "users", userId, "chats"),
      where("createdAt", ">", sevenDaysAgo),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const chats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages(chats);
  } catch (error) {
    console.error("🚨 Error loading chat history:", error);
    setError("Failed to load chat history.");
  }
};

/**
 * 🔹 Fetch Chat Sessions for Sidebar
 * - Retrieves all chat sessions from Firestore for the logged-in user.
 */
export const fetchChatSessions = async (userId) => {
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
