export class BaseAssistant {
    /**
     * Constructor to initialize API key and base URL
     * @param {string} apiKey - The API key for authentication.
     * @param {string} baseUrl - The base URL of the API.
     */
    constructor(apiKey, baseUrl) {
      if (!apiKey || !baseUrl) {
        throw new Error("API key and base URL are required for BaseAssistant.");
      }
      this.apiKey = apiKey;
      this.baseUrl = baseUrl;
    }
  
    /**
     * Makes a POST request to the AI API endpoint.
     * @param {string} endpoint - The endpoint to hit.
     * @param {Object} body - The body of the POST request.
     * @returns {Promise<Object>} - The parsed JSON response.
     */
    async sendMessage(endpoint, body) {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${response.status} - ${response.statusText}. ${errorData?.message || ""}`
          );
        }
  
        return await response.json();
      } catch (error) {
        console.error("Error in BaseAssistant:", error);
        throw error;
      }
    }
  
    /**
     * Makes a POST request to the AI API endpoint with streaming support.
     * @param {string} endpoint - The endpoint to hit.
     * @param {Object} body - The body of the POST request.
     * @returns {AsyncGenerator<string>} - An async generator yielding chunks of response text.
     */
    async *sendMessageStream(endpoint, body) {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API Error: ${response.status} - ${response.statusText}. ${errorData?.message || ""}`
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
        console.error("Error in BaseAssistant (Streaming):", error);
        throw error;
      }
    }
  }
  