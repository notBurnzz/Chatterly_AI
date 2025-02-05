import { useMemo, useState } from "react";
import Markdown from "react-markdown";
import { MessageBubble } from "./MessageBubble"; // Import MessageBubble
import styles from "./Chat.module.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Your friendly AI companion, ready to assist 24/7.\nWhat’s on your mind?",
};

export function ChatWindow({ messages }) {
  const [copiedMessage, setCopiedMessage] = useState(null);

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

  // 🔹 Copy message content to clipboard
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
    <div className={styles.ChatWindow}>
      {/* Welcome message */}
      <MessageBubble key="welcome" role="assistant" content={WELCOME_MESSAGE.content} />

      {/* Chat messages */}
      {messagesGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {group.map(({ role, content }, index) => (
            <MessageBubble
              key={`${groupIndex}-${index}`}
              role={role}
              content={content}
              onCopy={() => copyToClipboard(content, `${groupIndex}-${index}`)}
              isCopied={copiedMessage === `${groupIndex}-${index}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
