import { GoogleGenerativeAI } from "@google/generative-ai";

// Renamed the class to Assistant to match the import
export class Assistant {
  #chat;

  /**
   * Constructor to initialize the Google Generative AI assistant.
   * @param {string} model - The model to use (default is "gemini-1.5-flash").
   */
  constructor(model = "gemini-1.5-flash") {
    // Initialize GoogleGenerativeAI with the API key from environment variables
    const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

    if (!googleai) {
      throw new Error("Google Generative AI initialization failed. Check your API key.");
    }

    // Get the specified generative model and start a new chat
    const gemini = googleai.getGenerativeModel({ model });
    this.#chat = gemini.startChat({ history: [] }); // Initialize with an empty history
  }

  /**
   * Sends a message to the AI model and returns the full response text.
   * @param {string} content - The user message to send to the model.
   * @returns {Promise<string>} - The AI's response text.
   */
  async chat(content) {
    try {
      const result = await this.#chat.sendMessage(content);
      return result.response.text();
    } catch (error) {
      console.error("Error in GoogleAIAssistant chat:", error);
      throw error;
    }
  }

  /**
   * Sends a message to the AI model and streams the response in chunks.
   * @param {string} content - The user message to send to the model.
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *chatStream(content) {
    try {
      const result = await this.#chat.sendMessageStream(content);

      for await (const chunk of result.stream) {
        yield chunk.text(); // Stream each chunk of text
      }
    } catch (error) {
      console.error("Error in GoogleAIAssistant chatStream:", error);
      throw error;
    }
  }
}