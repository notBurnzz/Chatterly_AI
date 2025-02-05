/**
 * 🔹 Format timestamp into a readable date/time string
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} - Formatted date string (e.g., "Jan 1, 2024 - 10:30 AM")
 */
export function formatTimestamp(timestamp) {
    if (!timestamp || isNaN(timestamp)) return "N/A";
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  /**
   * 🔹 Shorten long text while maintaining readability
   * @param {string} text - Input text
   * @param {number} maxLength - Max character length (default: 100)
   * @returns {string} - Shortened text with ellipsis if needed
   */
  export function truncateText(text, maxLength = 100) {
    if (typeof text !== "string") return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }
  
  /**
   * 🔹 Format AI API response to extract clean text
   * @param {object} response - AI response object
   * @param {string} model - The AI model used (e.g., "openai", "googleai", "nvidia", "qwenai")
   * @returns {string} - Extracted message text
   */
  export function formatAIResponse(response, model) {
    if (!response || typeof response !== "object") return "No response received.";
  
    switch (model) {
      case "openai":
      case "nvidia":
      case "qwenai":
        return response.choices?.[0]?.message?.content ?? "AI response unavailable.";
  
      case "googleai":
        return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "AI response unavailable.";
  
      default:
        return "Invalid AI model selected.";
    }
  }
  
  /**
   * 🔹 Capitalize the first letter of a string
   * @param {string} text - Input text
   * @returns {string} - Text with the first letter capitalized
   */
  export function capitalizeFirstLetter(text) {
    if (typeof text !== "string" || text.length === 0) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  /**
   * 🔹 Sanitize user input to prevent XSS attacks
   * @param {string} input - User input
   * @returns {string} - Sanitized input
   */
  export function sanitizeInput(input) {
    if (typeof input !== "string") return "";
    return input.replace(/[<>]/g, "");
  }
  