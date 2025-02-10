import { BaseAssistant } from "./baseAssistant";

/**
 * MistralAI Class
 * Extends BaseAssistant to integrate with the Mistral AI API.
 */
export class MistralAI extends BaseAssistant {
  /**
   * Constructor to initialize Mistral AI.
   * @param {string} apiKey - The API key for Mistral AI authentication.
   * @param {string} baseUrl - The base URL for Mistral API (default: "https://api.mistral.ai/v1").
   */
  constructor(apiKey = import.meta.env.VITE_MISTRAL_API_KEY, baseUrl = "https://api.mistral.ai/v1") {
    if (!apiKey) {
      throw new Error("Mistral AI API key is missing. Set VITE_MISTRAL_API_KEY in your environment.");
    }
    super(apiKey, baseUrl); // Initialize BaseAssistant with API key and base URL
  }

  /**
   * Sends a message to the Mistral AI model and retrieves the response.
   * @param {string} prompt - The user input to send to the model.
   * @param {Object} options - Additional options for Mistral API (e.g., max tokens, temperature).
   * @returns {Promise<string>} - The AI's response text.
   */
  async sendMessage(prompt, options = {}) {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Invalid prompt provided. Prompt must be a non-empty string.");
    }

    const body = {
      messages: [{ role: "user", content: prompt }],
      ...options, // Include additional options like max tokens, temperature, etc.
    };

    try {
      const response = await this.request("chat/completions", "POST", body);
      return response?.choices?.[0]?.message?.content || "No response from Mistral AI.";
    } catch (error) {
      console.error("Error in MistralAI sendMessage:", error);
      throw new Error("Failed to send message to Mistral AI. Please try again.");
    }
  }

  /**
   * Streams a message to the Mistral AI model and yields response chunks.
   * @param {string} prompt - The user input to send to the model.
   * @param {Object} options - Additional options for Mistral API (e.g., max tokens, temperature).
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *sendMessageStream(prompt, options = {}) {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Invalid prompt provided. Prompt must be a non-empty string.");
    }

    const body = {
      messages: [{ role: "user", content: prompt }],
      stream: true, // Enables streaming
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Mistral API Error: ${response.status} - ${response.statusText}. ${
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
      console.error("Error in MistralAI sendMessageStream:", error);
      throw new Error("Failed to stream response from Mistral AI. Please try again.");
    }
  }
}
