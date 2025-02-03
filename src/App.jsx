import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Assistant as OpenAIAssistant } from "./assistants/openai";
import { Assistant as GoogleAIAssistant } from "./assistants/googleai";
import { Assistant as DeepSeekAIAssistant } from "./assistants/deepseekai";

import {
  db,
  auth,
  signInWithGoogle,
  logout,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "./firebase";

import { Loader } from "./components/Loader/Loader";
import { Chat } from "./components/Chat/Chat";
=======
import { getAIResponse } from "./assistants/baseAssistant"; // AI logic
import { loadChatHistory, saveChatToFirebase } from "./utils/firebaseUtils"; // Firebase utilities
import { handleLogin, handleLogout } from "./utils/login"; // Authentication utilities

import { Loader } from "./components/Loader/Loader";
import { ChatWindow } from "./components/Chat/ChatWindow";
>>>>>>> eabef92 (03/02-changes)
import { Controls } from "./components/Controls/Controls";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Navbar } from "./components/Navbar/Navbar";

<<<<<<< HEAD
=======
import { auth } from "./firebase"; // Firebase authentication
>>>>>>> eabef92 (03/02-changes)
import styles from "./App.module.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("googleai");
  const [user, setUser] = useState(null);
<<<<<<< HEAD

  // Initialize assistants
  const assistants = {
    openai: new OpenAIAssistant(),
    googleai: new GoogleAIAssistant(),
    deepseekai: new DeepSeekAIAssistant(),
  };

  // Listen for auth changes and load chat history
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadChatHistory(currentUser.uid, selectedModel);
      } else {
        setMessages([]);
=======
  const [error, setError] = useState(null);

  // 🔹 Listen for auth changes and load chat history
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setMessages([]); // Reset chat on model change
        await loadChatHistory(currentUser.uid, selectedModel, setMessages, setError);
>>>>>>> eabef92 (03/02-changes)
      }
    });
    return () => unsubscribe();
  }, [selectedModel]);

<<<<<<< HEAD
  // Load chat history from Firebase
  const loadChatHistory = async (userId, model) => {
    try {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const q = query(
        collection(db, "chats"),
        where("userId", "==", userId),
        where("model", "==", model),
        where("timestamp", ">", sevenDaysAgo)
      );
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chats);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Save a message to Firebase
  const saveMessageToFirebase = async (message) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "chats"), {
        ...message,
        userId: user.uid,
        model: selectedModel,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // Handle user message sending
  const handleContentSend = async (content) => {
=======
  // 🔹 Handle sending user messages
  const handleContentSend = async (content) => {
    if (!content.trim()) return; // Prevent empty messages

>>>>>>> eabef92 (03/02-changes)
    const userMessage = { content, role: "user", model: selectedModel };
    setMessages((prev) => [...prev, userMessage]);

    if (user) {
<<<<<<< HEAD
      await saveMessageToFirebase(userMessage);
=======
      await saveChatToFirebase(user.uid, selectedModel, userMessage);
>>>>>>> eabef92 (03/02-changes)
    }

    setIsLoading(true);
    setIsStreaming(true);

    try {
<<<<<<< HEAD
      const result = await assistants[selectedModel].chatStream(content, messages);
      let aiMessage = { content: "", role: "assistant", model: selectedModel };
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          setMessages((prev) => [...prev, aiMessage]);
        }
        aiMessage.content += chunk;
      }

      if (user) {
        await saveMessageToFirebase(aiMessage);
      }
    } catch (error) {
      console.error("Error during AI response:", error);
=======
      const assistantResponse = await getAIResponse(selectedModel, content);
      const aiMessage = { content: assistantResponse, role: "assistant", model: selectedModel };

      setMessages((prev) => [...prev, aiMessage]);

      if (user) {
        await saveChatToFirebase(user.uid, selectedModel, aiMessage);
      }
    } catch (error) {
      console.error("🚨 AI Response Error:", error);
      setError("AI response failed. Try again.");
>>>>>>> eabef92 (03/02-changes)
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}

<<<<<<< HEAD
      {/* Navbar */}
      <Navbar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Main container (Sidebar + Chat) */}
      <div className={styles.MainContainer}>
        <Sidebar
          messages={messages}
          setMessages={setMessages}
          user={user}
          setUser={setUser}
        />
        <div className={styles.ChatContainer}>
          <Chat messages={messages} setMessages={setMessages} />
        </div>
      </div>

      {/* Input Controls */}
      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
=======
      {/* 🔹 Navbar */}
      <Navbar selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      {/* 🔹 Main container (Sidebar + Chat) */}
      <div className={styles.MainContainer}>
        <Sidebar messages={messages} setMessages={setMessages} user={user} setUser={setUser} />
        <div className={styles.ChatContainer}>
          <ChatWindow messages={messages} setMessages={setMessages} />
        </div>
      </div>

      {/* 🔹 Input Controls */}
      <Controls isDisabled={isLoading || isStreaming} onSend={handleContentSend} />

      {/* 🔹 User Authentication (Login/Logout) */}
      <div className={styles.AuthContainer}>
        {!user ? (
          <button onClick={() => handleLogin(setUser, setMessages, setError)} className={styles.AuthButton}>
            Login with Google
          </button>
        ) : (
          <button onClick={() => handleLogout(setUser, setMessages, setError)} className={styles.AuthButton}>
            Logout
          </button>
        )}
      </div>

      {/* 🔹 Error Handling */}
      {error && <p className={styles.ErrorMessage}>{error}</p>}
>>>>>>> eabef92 (03/02-changes)
    </div>
  );
}

export default App;
