import OpenAI from "openai";

export class OpenAIModel {
  #model;
  #openai;

  /**
   * Constructor to initialize OpenAI Model.
   * @param {string} model - The AI model to use (default: "gpt-4o-mini").
   */
  constructor(model = "gpt-4o-mini") {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Set VITE_OPENAI_API_KEY in environment variables.");
    }

    this.#model = model;
    this.#openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Sends a non-streaming chat message to OpenAI.
   * @param {string} content - The user message to send.
   * @param {Array} history - The conversation history.
   * @param {number} retries - Number of retry attempts in case of failure.
   * @returns {Promise<string>} - The AI's response text.
   */
  async chat(content, history = [], retries = 2) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Invalid content provided. Content must be a non-empty string.");
    }

    while (retries >= 0) {
      try {
        const result = await this.#openai.chat.completions.create({
          model: this.#model,
          messages: [...history, { content, role: "user" }],
        });

        return result.choices?.[0]?.message?.content || "No response received.";
      } catch (error) {
        console.error("Error in OpenAIModel chat:", error);

        if (retries === 0) {
          throw new Error("Failed to send message to OpenAI after multiple attempts.");
        }

        console.warn(`Retrying OpenAI request... Attempts left: ${retries}`);
        retries--;
      }
    }
  }

  /**
   * Sends a streaming chat message to OpenAI.
   * @param {string} content - The user message to send.
   * @param {Array} history - The conversation history.
   * @returns {AsyncGenerator<string>} - A generator yielding chunks of response text.
   */
  async *chatStream(content, history = []) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new Error("Invalid content provided. Content must be a non-empty string.");
    }

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
      console.error("Error in OpenAIModel chatStream:", error);
      throw new Error("Failed to stream response from OpenAI. Please try again.");
    }
  }
}
