import { modelConfig } from "./constants";

/**
 * 🔹 Fetch AI Response
 * - Handles dynamic API requests for different AI models.
 */
export const getAIResponse = async (model, message) => {
  try {
    const { apiUrl, apiKey } = modelConfig[model];

    const payload = {
      model: model,
      messages: [{ role: "user", content: message }],
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI model.";
  } catch (error) {
    console.error("🚨 API Request Failed:", error.message);
    return "⚠️ Unable to get a response. Please try again.";
  }
};
