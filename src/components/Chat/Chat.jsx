import { useRef, useEffect } from "react";
import { ChatWindow } from "./ChatWindow"; // Import ChatWindow
import { useChat } from "../../contexts/ChatContext"; // Use ChatContext for messages
import { fetchAIResponse } from "../../utils/api"; // Corrected path to utils/api
import styles from "./Chat.module.css";

export function Chat() {
  const { messages, setMessages, selectedModel, saveMessage, loading, error } = useChat(); // Access ChatContext
  const messagesEndRef = useRef(null);

  // 🔹 Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 🔹 Handle user message input and AI response
   * @param {string} content - User input message
   */
  async function handleUserMessage(content) {
    if (!content.trim()) return; // Prevent empty messages

    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]); // Add user message to state

    // Save the user message to Firebase
    await saveMessage(userMessage);

    // Fetch AI response
    try {
      const aiResponse = await fetchAIResponse(selectedModel, [...messages, userMessage]);
      const assistantMessage = { role: "assistant", content: aiResponse };

      setMessages((prev) => [...prev, assistantMessage]); // Add AI response to state
      await saveMessage(assistantMessage); // Save AI response to Firebase
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  }

  return (
    <div className={styles.Chat}>
      {/* Error and Loading States */}
      {error && <div className={styles.Error}>{error}</div>}
      {loading && <div className={styles.Loading}>Loading chat history...</div>}

      {/* Chat Messages */}
      <ChatWindow messages={messages} onUserMessage={handleUserMessage} />

      {/* Scroll to Latest Message */}
      <div ref={messagesEndRef} />
    </div>
  );
}
