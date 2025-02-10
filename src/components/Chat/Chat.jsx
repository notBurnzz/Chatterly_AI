import { useRef, useEffect, useState } from "react";
import { ChatWindow } from "./ChatWindow"; // Import ChatWindow
import { ChatFooter } from "./ChatFooter"; // Import ChatFooter
import { useChat } from "../../contexts/ChatContext"; // Use ChatContext for messages
import { fetchAIResponse } from "../../utils/api"; // Corrected path to utils/api
import styles from "./Chat.module.css";

/**
 * Chat Component
 * Manages user input, AI responses, and chat history.
 *
 * @returns {JSX.Element}
 */
export function Chat() {
  const { messages, setMessages, selectedModel, saveMessage, loading, error } = useChat(); // Access ChatContext
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false); // 🔹 AI Typing state
  const messagesRef = useRef(messages); // 🔹 Prevent stale state issues

  // 🔹 Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🔹 Keep track of messages to prevent stale state issues
  useEffect(() => {
    messagesRef.current = messages;
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

    // Show typing indicator before AI responds
    setIsTyping(true);

    try {
      // 🔹 Fetch AI response using latest messages
      const aiResponse = await fetchAIResponse(selectedModel, [...messagesRef.current, userMessage]);
      const assistantMessage = { role: "assistant", content: aiResponse };

      setMessages((prev) => [...prev, assistantMessage]); // Add AI response to state
      await saveMessage(assistantMessage); // Save AI response to Firebase
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ AI is currently unavailable. Please try again." }]);
    } finally {
      setIsTyping(false); // Remove typing indicator after AI responds
    }
  }

  return (
    <div className={styles.Chat}>
      {/* 🔹 Error and Loading States */}
      {error && <div className={styles.Error}>⚠️ {error}</div>}
      {loading && <div className={styles.Loading}>Loading chat history...</div>}

      {/* 🔹 Chat Messages */}
      <ChatWindow messages={messages} isTyping={isTyping} />

      {/* 🔹 Chat Input (Footer) */}
      <ChatFooter onSendMessage={handleUserMessage} setIsTyping={setIsTyping} />

      {/* 🔹 Scroll to Latest Message */}
      <div ref={messagesEndRef} />
    </div>
  );
}
