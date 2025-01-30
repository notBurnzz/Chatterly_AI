import { useState, useEffect } from "react";
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
import { Controls } from "./components/Controls/Controls";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Navbar } from "./components/Navbar/Navbar";

import styles from "./App.module.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("googleai");
  const [user, setUser] = useState(null); // Current user state

  // Initialize assistants
  const assistants = {
    openai: new OpenAIAssistant(),
    googleai: new GoogleAIAssistant(),
    deepseekai: new DeepSeekAIAssistant(),
  };

  // Listen for auth changes, load chat history if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadChatHistory(currentUser.uid, selectedModel);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [selectedModel]);

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
      alert("Failed to load chat history. Please create the required Firestore index.");
    }
  };

  // Save a message to Firebase (only if user is logged in)
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
      alert("Failed to save the message.");
    }
  };

  // Handle sending user content and AI response
  const handleContentSend = async (content) => {
    const userMessage = { content, role: "user", model: selectedModel };
    setMessages((prev) => [...prev, userMessage]);

    if (user) {
      await saveMessageToFirebase(userMessage);
    }

    setIsLoading(true);
    setIsStreaming(true);

    try {
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
      alert("Failed to process the chat.");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}

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
    </div>
  );
}

export default App;
