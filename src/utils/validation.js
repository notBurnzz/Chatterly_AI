/**
 * 🔹 Validate User Input
 * - Ensures input is not empty or contains only spaces.
 */
export const validateMessage = (message) => {
    if (!message || message.trim() === "") return false;
    return true;
  };
  
  /**
   * 🔹 Sanitize Input
   * - Removes potentially harmful characters to prevent script injection.
   */
  export const sanitizeInput = (message) => {
    return message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\$/g, "&#36;"); // Prevents JavaScript execution & SQL injection
  };
  
  /**
   * 🔹 Validate API Key Format
   * - Ensures the API key is a valid string and not empty.
   */
  export const validateApiKey = (apiKey) => {
    return typeof apiKey === "string" && apiKey.length > 10; // API keys are usually long strings
  };
  
  /**
   * 🔹 Validate Firebase User ID
   * - Checks if the user ID is in a valid format.
   */
  export const validateUserId = (userId) => {
    return typeof userId === "string" && userId.length > 5; // User IDs should not be too short
  };
  