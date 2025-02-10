/**
 * 🔹 Parses a message to detect commands, links, and keywords
 * @param {string} message - The user input message
 * @returns {Object} - Parsed message object
 */
export function parseMessage(message) {
  if (!message.trim()) return { type: "empty", content: "" };

  // Normalize message content (trim spaces & convert to lowercase for commands)
  const trimmedMessage = message.trim();
  const lowerCaseMessage = trimmedMessage.toLowerCase();

  // 🔹 Check if message is a command (e.g., /help, /clear)
  if (lowerCaseMessage.startsWith("/")) {
    return {
      type: "command",
      command: lowerCaseMessage.split(" ")[0], // Extract command (first word)
      content: trimmedMessage,
    };
  }

  // 🔹 Check for links (basic detection)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const containsLink = urlRegex.test(trimmedMessage);

  // 🔹 Extract keywords (for AI processing)
  const keywords = extractKeywords(trimmedMessage);

  return {
    type: containsLink ? "link" : "text",
    content: trimmedMessage,
    containsLink,
    keywords,
  };
}

/**
 * 🔹 Extracts keywords from a message for AI context improvement
 * @param {string} text - User input text
 * @returns {Array} - List of keywords
 */
function extractKeywords(text) {
  const stopwords = ["the", "is", "at", "which", "on", "and", "a", "an", "to"]; // Basic stopwords list
  return text
    .toLowerCase()
    .split(/\W+/) // Split by non-word characters
    .filter((word) => word.length > 2 && !stopwords.includes(word)); // Remove short words & stopwords
}

/**
 * 🔹 Formats a message if it contains a link
 * @param {string} message - User input message
 * @returns {string} - Formatted message with clickable links
 */
export function formatMessageWithLinks(message) {
  return message.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
