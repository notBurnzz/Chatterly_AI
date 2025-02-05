export class NvidiaDeepseekAssistant {
  #baseUrl;
  #apiKey;
  #model;

  /**
   * Constructor to initialize Nvidia DeepSeek Assistant.
   * @param {string} model - The AI model to use (default: "deepseek-ai/deepseek-r1").
   * @param {string} baseUrl - The base URL for the Nvidia API.
   * @param {string} apiKey - The API key for authentication.
   */
  constructor(
    model = "deepseek-ai/deepseek-r1",
    baseUrl = "https://integrate.api.nvidia.com/v1",
    apiKey = import.meta.env.VITE_NVIDIA_DEEPSEEK_API_KEY
  ) {
    if (!apiKey) {
      throw new Error("API key is missing. Set VITE_NVIDIA_DEEPSEEK_API_KEY in environment variables.");
    }
    this.#baseUrl = baseUrl;
    this.#apiKey = apiKey;
    this.#model = model;
  }

  /**
   * Sends a non-streaming chat message to the Nvidia DeepSeek AI.
   * @param {string} content - The user message to send.
   * @returns {Promise<string>} - The AI's response text.
   */
  async chat(content) {
    try {
      const response = await fetch(`${this.#baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#apiKey}`,
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [{ role: "user", content }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}. ${errorData?.message || ""}`
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response received.";
    } catch (error) {
      console.error("Error in NvidiaDeepseekAssistant chat:", error);
      throw error;
    }
  }

  /**
   * Sends a streaming chat message to the Nvidia DeepSeek AI.
   * @param {string} content - The user message to send.
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *chatStream(content) {
    try {
      const response = await fetch(`${this.#baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#apiKey}`,
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [{ role: "user", content }],
          stream: true, // Enables streaming
        }),
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
        yield decoder.decode(value); // Stream chunks of response
      }
    } catch (error) {
      console.error("Error in NvidiaDeepseekAssistant chatStream:", error);
      throw error;
    }
  }
}
