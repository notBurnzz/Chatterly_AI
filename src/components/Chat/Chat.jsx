import { useRef, useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "../../firebase"; // ✅ Ensure correct import path
import styles from "./Chat.module.css";

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "Your friendly AI companion, ready to assist 24/7.\nWhat’s on your mind?",
  },
];

export function Chat({ messages, setMessages }) {
  const messagesEndRef = useRef(null);
  const [copiedMessage, setCopiedMessage] = useState(null);

  // 🔹 Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // 🔹 Group messages by user and assistant responses
  const messagesGroups = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]); // Start a new group for user messages
        groups[groups.length - 1].push(message);
        return groups;
      }, []),
    [messages]
  );

  // 🔹 Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Load last 7 days' chat history from Firestore
  async function loadChatHistory() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(db, "chats"),
        where("timestamp", ">", sevenDaysAgo),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages((prev) => [...prev, ...chats]); // Append messages instead of replacing
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }

  // 🔹 Save new messages to Firestore
  async function saveMessageToFirebase(message) {
    try {
      await addDoc(collection(db, "chats"), {
        ...message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  // 🔹 Copy message content to clipboard
  const copyToClipboard = async (content, messageIndex) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(messageIndex); // Highlight copied message
      setTimeout(() => setCopiedMessage(null), 2000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={styles.Chat}>
      {/* Render welcome message and grouped chat messages */}
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map((messages, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({ role, content }, index) => (
            <div
              key={index}
              className={styles.Message}
              data-role={role}
              role="button"
              tabIndex={0} // Makes message focusable for accessibility
              onKeyPress={(e) => {
                if (e.key === "Enter" && role === "assistant") {
                  copyToClipboard(content, `${groupIndex}-${index}`);
                }
              }}
            >
              <Markdown>{content}</Markdown>
              {role === "assistant" && (
                <button
                  className={styles.CopyButton}
                  onClick={() => copyToClipboard(content, `${groupIndex}-${index}`)}
                >
                  {copiedMessage === `${groupIndex}-${index}` ? "Copied!" : "📋 Copy"}
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
