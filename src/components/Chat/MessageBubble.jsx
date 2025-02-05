import Markdown from "react-markdown";
import styles from "./MessageBubble.module.css";

export function MessageBubble({ role, content, onCopy, isCopied }) {
  return (
    <div
      className={styles.MessageBubble}
      data-role={role}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" && role === "assistant") {
          onCopy();
        }
      }}
    >
      <Markdown>{content}</Markdown>
      {role === "assistant" && (
        <button className={styles.CopyButton} onClick={onCopy}>
          {isCopied ? "Copied!" : "📋 Copy"}
        </button>
      )}
    </div>
  );
}
