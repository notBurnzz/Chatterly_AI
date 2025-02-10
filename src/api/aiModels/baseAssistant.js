export class BaseAssistant {
  /**
   * Constructor to initialize API key and base URL.
   * @param {string} apiKey - The API key for authentication.
   * @param {string} baseUrl - The base URL of the API.
   * @param {number} timeout - Optional timeout in milliseconds (default: 10000ms).
   */
  constructor(apiKey, baseUrl, timeout = 10000) {
    if (!apiKey || !baseUrl) {
      throw new Error("API key and base URL are required for BaseAssistant.");
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeout = timeout; // Optional timeout
  }

  /**
   * Generic function to make API requests.
   * @param {string} endpoint - The API endpoint to call.
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {Object} [body=null] - Request payload (for POST/PUT).
   * @param {Object} [headers={}] - Additional headers.
   * @returns {Promise<Object>} - Parsed JSON response.
   */
  async request(endpoint, method = "GET", body = null, headers = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}. ${
            errorData?.message || "No additional details available."
          }`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in BaseAssistant Request:", {
        endpoint,
        method,
        body,
        headers,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Sends a message to the AI model (POST request).
   * @param {string} endpoint - The API endpoint.
   * @param {Object} body - Request payload.
   * @returns {Promise<Object>} - Parsed JSON response.
   */
  async sendMessage(endpoint, body) {
    return this.request(endpoint, "POST", body);
  }

  /**
   * Sends a message to the AI model with streaming support.
   * @param {string} endpoint - The API endpoint.
   * @param {Object} body - Request payload.
   * @returns {AsyncGenerator<string>} - Async generator yielding response chunks.
   */
  async *sendMessageStream(endpoint, body) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}. ${
            errorData?.message || "No additional details available."
          }`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    } catch (error) {
      console.error("Error in BaseAssistant (Streaming):", {
        endpoint,
        body,
        error: error.message,
      });
      throw error;
    }
  }
}
