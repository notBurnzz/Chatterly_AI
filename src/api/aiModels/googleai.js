import { GoogleGenerativeAI } from "@google/generative-ai";

export class GoogleAI {
  #chat;
  #model;
  #googleai;
  #apiKey;

  /**
   * Constructor to initialize the Google Generative AI assistant.
   * @param {string} model - The model to use (default is "gemini-2.0-flash-exp").
   */
  constructor(model = "gemini-2.0-flash-exp") {
    this.#model = model;
    this.#apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

    if (!this.#apiKey) {
      throw new Error(
        "Google AI API key is missing. Set VITE_GOOGLE_AI_API_KEY in your environment."
      );
    }

    this.#googleai = new GoogleGenerativeAI(this.#apiKey);
    this.initializeAI();
  }

  /**
   * Initializes the Google Generative AI assistant.
   */
  initializeAI() {
    try {
      const gemini = this.#googleai.getGenerativeModel({ model: this.#model });
      this.#chat = gemini.startChat({ history: [] });
    } catch (error) {
      console.error("Error initializing Google AI model:", error);
      throw new Error(
        "Failed to load Gemini 2.0 Flash. Ensure your API key is correct and supports the selected model."
      );
    }
  }

  /**
   * Sends a message to the AI model and returns the full response text.
   * @param {string} content - The user message to send to the model.
   * @param {number} retries - Number of retry attempts in case of failure.
   * @returns {Promise<string>} - The AI's response text.
   */
  async chat(content, retries = 2) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Invalid content provided. Content must be a non-empty string.");
    }

    while (retries >= 0) {
      try {
        const result = await this.#chat.sendMessage(content);
        return result.response.text(); // Extract and return the full response text
      } catch (error) {
        console.error("Error in Google AI chat:", error);

        if (retries === 0) {
          throw new Error("Failed to send message to Google AI after multiple attempts.");
        }

        console.warn(`Retrying chat request... Attempts left: ${retries}`);
        retries--;
      }
    }
  }

  /**
   * Sends a message to the AI model and streams the response in chunks.
   * @param {string} content - The user message to send to the model.
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *chatStream(content) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Invalid content provided. Content must be a non-empty string.");
    }

    try {
      const result = await this.#chat.sendMessageStream(content);

      for await (const chunk of result.stream) {
        yield chunk.text(); // Stream each chunk of text
      }
    } catch (error) {
      console.error("Error in Google AI chatStream:", error);
      throw new Error("Failed to stream response from Google AI. Please try again.");
    }
  }
}
