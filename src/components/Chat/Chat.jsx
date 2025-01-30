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
  serverTimestamp 
} from "../../firebase";  // ✅ Ensure correct import path



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

  useEffect(() => {
    loadChatHistory();
  }, []);

  const messagesGroups = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]);
        groups[groups.length - 1].push(message);
        return groups;
      }, []),
    [messages]
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Load last 7 days' messages from Firestore
  async function loadChatHistory() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Convert to Firestore Timestamp

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
        timestamp: serverTimestamp(), // ✅ Use Firestore serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  // 🔹 Copy message content
  const copyToClipboard = async (content, messageIndex) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(messageIndex);
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map((messages, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({ role, content }, index) => (
            <div key={index} className={styles.Message} data-role={role}>
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
