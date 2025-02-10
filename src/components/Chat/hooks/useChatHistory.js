import { useState, useEffect } from "react";

export function useChatSettings() {
  const DEFAULT_MODEL = "openai"; // Default AI model

  // 🔹 Load settings from localStorage or use defaults
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("aiModel") || DEFAULT_MODEL;
  });

  const [messageLengthLimit, setMessageLengthLimit] = useState(() => {
    return parseInt(localStorage.getItem("messageLengthLimit"), 10) || 500;
  });

  // 🔹 Update theme preference
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // 🔹 Update AI model preference
  useEffect(() => {
    localStorage.setItem("aiModel", selectedModel);
  }, [selectedModel]);

  // 🔹 Update message length preference
  useEffect(() => {
    localStorage.setItem("messageLengthLimit", messageLengthLimit);
  }, [messageLengthLimit]);

  return {
    isDarkMode,
    setIsDarkMode,
    selectedModel,
    setSelectedModel,
    messageLengthLimit,
    setMessageLengthLimit,
  };
}
