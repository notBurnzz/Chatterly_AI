import OpenAI from "openai";

export class OpenAIAssistant {
  #model;
  #openai;

  /**
   * Constructor to initialize OpenAI Assistant.
   * @param {string} model - The AI model to use (default: "gpt-4o-mini").
   */
  constructor(model = "gpt-4o-mini") {
    if (!import.meta.env.VITE_OPEN_AI_API_KEY) {
      throw new Error("API key is missing. Set VITE_OPEN_AI_API_KEY in environment variables.");
    }

    this.#model = model;
    this.#openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Sends a non-streaming chat message to OpenAI.
   * @param {string} content - The user message to send.
   * @param {Array} history - The conversation history.
   * @returns {Promise<string>} - The AI's response text.
   */
  async chat(content, history = []) {
    try {
      const result = await this.#openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices?.[0]?.message?.content || "No response received.";
    } catch (error) {
      console.error("Error in OpenAIAssistant chat:", error);
      throw error;
    }
  }

  /**
   * Sends a streaming chat message to OpenAI.
   * @param {string} content - The user message to send.
   * @param {Array} history - The conversation history.
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *chatStream(content, history = []) {
    try {
      const result = await this.#openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices?.[0]?.delta?.content || "";
      }
    } catch (error) {
      console.error("Error in OpenAIAssistant chatStream:", error);
      throw error;
    }
  }
}
