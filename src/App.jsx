import { useState, useEffect } from "react";
import { Assistant as OpenAIAssistant } from "./assistants/openai";
import { Assistant as GoogleAIAssistant } from "./assistants/googleai";
import { NvidiaDeepseekAssistant as DeepSeekAIAssistant } from "./assistants/nvidiadeepseekai";

import { db, auth, collection, addDoc, query, where, getDocs } from "./services/firebase";
import { Loader } from "./components/Loader/Loader";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Navbar } from "./components/Navbar/Navbar";
import { Login } from "./pages/home/Login";

import { fetchAIResponse } from "./utils/api";
import { formatTimestamp } from "./utils/formatters";
import { isNotEmpty } from "./utils/validators";

import styles from "./App.module.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("googleai");
  const [user, setUser] = useState(null);

  // AI Assistants initialization
  const assistants = {
    openai: new OpenAIAssistant(),
    googleai: new GoogleAIAssistant(),
    deepseekai: new DeepSeekAIAssistant(),
  };

  // Listen for authentication changes
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

  // Load chat history
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
        timestamp: formatTimestamp(doc.data().timestamp),
      }));
      setMessages(chats);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Save messages to Firebase
  const saveMessageToFirebase = async (message) => {
    if (!user || !isNotEmpty(message.content)) return;
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

  // Handle message sending
  const handleContentSend = async (content) => {
    if (!isNotEmpty(content)) return;

    const userMessage = { content, role: "user", model: selectedModel };
    setMessages((prev) => [...prev, userMessage]);

    if (user) {
      await saveMessageToFirebase(userMessage);
    }

    setIsLoading(true);
    setIsStreaming(true);

    try {
      const result = await fetchAIResponse(selectedModel, [
        ...messages,
        { role: "user", content },
      ]);

      const aiMessage = { content: result, role: "assistant", model: selectedModel };
      setMessages((prev) => [...prev, aiMessage]);

      if (user) {
        await saveMessageToFirebase(aiMessage);
      }
    } catch (error) {
      console.error("Error during AI response:", error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Render Login screen for unauthenticated users
  if (!user) {
    return (
      <div className={styles.App}>
        <Login user={user} setUser={setUser} />
      </div>
    );
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}

      {/* Navbar */}
      <Navbar selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      {/* Main layout */}
      <div className={styles.MainContainer}>
        <Sidebar messages={messages} setMessages={setMessages} user={user} setUser={setUser} />
        <div className={styles.ChatContainer}>
          <Chat messages={messages} setMessages={setMessages} />
        </div>
      </div>

      {/* Input Controls */}
      <Controls isDisabled={isLoading || isStreaming} onSend={handleContentSend} />
    </div>
  );
}

export default App;
