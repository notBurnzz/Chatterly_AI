// ✅ Import environment variables securely
const OPENAI_API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;
const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const NVIDIA_DEEPSEEK_API_KEY = import.meta.env.VITE_NVIDIA_DEEPSEEK_API_KEY;
const QWEN_AI_API_KEY = import.meta.env.VITE_QWEN_AI_API_KEY;

// ✅ API Endpoints
const API_ENDPOINTS = {
  openai: "https://api.openai.com/v1/chat/completions",
  googleai: "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
  nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
  qwenai: "https://api.qwen.aliyun.com/v1/chat/completions",
};

// ✅ Model Defaults
const MODEL_DEFAULTS = {
  openai: "gpt-4o-mini",
  googleai: "gemini-2.0-flash-exp",
  nvidia: "deepseek-ai/deepseek-r1",
  qwenai: "qwen-turbo",
};

/**
 * 🔹 Fetch response from AI models
 * @param {string} model - The AI model to use (openai, googleai, nvidia, qwenai)
 * @param {Array} messages - Chat history for context
 * @returns {Promise<string>} - The AI response
 */
export async function fetchAIResponse(model, messages) {
  try {
    // ✅ Validate model
    if (!API_ENDPOINTS[model]) throw new Error(`Invalid AI model selected: ${model}`);

    // ✅ Set API key, URL, headers
    const apiKey = getApiKey(model);
    const url = getApiUrl(model, apiKey);
    const headers = getHeaders(model, apiKey);
    const body = getRequestBody(model, messages);

    // ✅ Make API request
    const response = await fetch(url, { method: "POST", headers, body });
    if (!response.ok) throw new Error(`API Error: ${response.status} - ${response.statusText}`);

    // ✅ Process AI response
    const data = await response.json();
    return parseAIResponse(model, data);
  } catch (error) {
    console.error(`❌ Error fetching ${model} response:`, error.message);
    return "Sorry, an error occurred while processing your request.";
  }
}

/**
 * 🔹 Get API Key for the selected model
 */
function getApiKey(model) {
  switch (model) {
    case "openai": return OPENAI_API_KEY;
    case "googleai": return GOOGLE_AI_API_KEY;
    case "nvidia": return NVIDIA_DEEPSEEK_API_KEY;
    case "qwenai": return QWEN_AI_API_KEY;
    default: throw new Error("Invalid AI model selected.");
  }
}

/**
 * 🔹 Get API URL (with key for Google AI)
 */
function getApiUrl(model, apiKey) {
  return model === "googleai" ? `${API_ENDPOINTS[model]}?key=${apiKey}` : API_ENDPOINTS[model];
}

/**
 * 🔹 Get Headers for API Request
 */
function getHeaders(model, apiKey) {
  return {
    "Content-Type": "application/json",
    ...(model !== "googleai" && { Authorization: `Bearer ${apiKey}` }), // GoogleAI doesn't need Authorization header
  };
}

/**
 * 🔹 Get Request Body for API Call
 */
function getRequestBody(model, messages) {
  const lastUserMessage = messages[messages.length - 1]?.content || "Hello!";
  const modelName = MODEL_DEFAULTS[model];

  switch (model) {
    case "openai":
    case "nvidia":
    case "qwenai":
      return JSON.stringify({ model: modelName, messages, temperature: 0.7 });

    case "googleai":
      return JSON.stringify({
        contents: [{ role: "user", parts: [{ text: lastUserMessage }] }],
      });

    default:
      throw new Error("Invalid AI model selected.");
  }
}

/**
 * 🔹 Parse AI Response
 */
function parseAIResponse(model, data) {
  switch (model) {
    case "googleai":
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Google AI response unavailable.";
      
    default:
      return data?.choices?.[0]?.message?.content || "AI response unavailable.";
  }
}
