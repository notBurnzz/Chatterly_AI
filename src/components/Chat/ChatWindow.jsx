import { useEffect, useRef } from "react";
import { loadChatHistory } from "../../utils/firebaseUtils"; // 🔹 Moved Firebase calls to utils
import MessageBubble from "./MessageBubble"; // 🔹 Uses MessageBubble for rendering messages
import styles from "./ChatWindow.module.css";

/**
 * 🔹 ChatWindow Component
 * - Loads and displays chat messages.
 */
export function ChatWindow({ user, selectedModel, messages, setMessages }) {
  const messagesEndRef = useRef(null);

  // 🔹 Load chat history when user/model changes
  useEffect(() => {
    if (user) {
      loadChatHistory(user.uid, selectedModel, setMessages, console.error);
    }
  }, [user, selectedModel]);

  // 🔹 Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.ChatWindow}>
      {messages.length === 0 ? (
        <p className={styles.EmptyMessage}>Start a conversation...</p>
      ) : (
        messages.map(({ role, content, id }, index) => (
          <MessageBubble key={id || index} role={role} content={content} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
