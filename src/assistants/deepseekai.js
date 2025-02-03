import axios from "axios";

const API_KEY = import.meta.env.VITE_DEEPSEEK_AI_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export class Assistant {
  #model;

  constructor(model = "deepseek-chat") {
    this.#model = model;
  }

  /**
   * Fetches a chat completion from DeepSeek AI.
   * @param {string} content - User input message.
   * @param {Array} history - Chat history [{ role: "user", content: "Hello" }, ...]
   * @returns {Promise<string>} - AI response.
   */
  async chat(content, history) {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: this.#model,
          messages: [...history, { role: "user", content }],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0]?.message?.content || "No response received.";
    } catch (error) {
      console.error("DeepSeek AI Error:", error.response?.data || error.message);
      return "Sorry, I encountered an error processing your request.";
    }
  }

  /**
   * Streams responses from DeepSeek AI.
   * @param {string} content - User input message.
   * @param {Array} history - Chat history [{ role: "user", content: "Hello" }, ...]
   * @returns {AsyncGenerator<string>} - Streamed AI response chunks.
   */
  async *chatStream(content, history) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.#model,
          messages: [...history, { role: "user", content }],
          stream: true,
        }),
      });

      if (!response.ok) {
        console.error("DeepSeek AI Streaming Error:", response.statusText);
        yield "Error: Unable to process request.";
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    } catch (error) {
      console.error("DeepSeek AI Streaming Error:", error.message);
      yield "Error: Unable to retrieve responseses.";
    }
  }
}
