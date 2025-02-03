export const modelConfig = {
    openai: {
      apiUrl: "https://api.openai.com/v1/chat/completions",
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    },
    googleai: {
      apiUrl: "https://api.google.com/v1/chat",
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    },
    deepseek: {
      apiUrl: "https://api.deepseek.com/v1/chat",
      apiKey: process.env.REACT_APP_DEEPSEEK_API_KEY,
    },
  };
  
  export const FIREBASE_COLLECTIONS = {
    USERS: "users",
    CHATS: "chats",
  };
  
  export const ERROR_MESSAGES = {
    FETCH_FAIL: "⚠️ Failed to fetch data. Try again later.",
    API_FAIL: "⚠️ AI model is currently unavailable.",
  };
  