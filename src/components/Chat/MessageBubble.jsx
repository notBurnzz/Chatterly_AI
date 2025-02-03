import React, { useState } from "react";
import Markdown from "react-markdown";
import styles from "./MessageBubble.module.css";

/**
 * 🔹 MessageBubble Component
 * - Renders messages with Markdown support.
 * - Allows copying AI-generated responses.
 */
const MessageBubble = ({ role, content }) => {
  const [copied, setCopied] = useState(false);

  // 🔹 Copy AI response to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("🚨 Copy Error:", error);
    }
  };

  return (
    <div className={`${styles.MessageBubble} ${role === "user" ? styles.UserBubble : styles.AIBubble}`}>
      <Markdown>{content}</Markdown>

      {/* Copy Button for AI Responses */}
      {role === "assistant" && (
        <button className={styles.CopyButton} onClick={copyToClipboard}>
          {copied ? "✔ Copied!" : "📋 Copy"}
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
