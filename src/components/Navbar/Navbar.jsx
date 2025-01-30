import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export function Navbar({ selectedModel, setSelectedModel }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Sync with localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <header className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        {/* Logo + Title in center */}
        <div className={styles.LeftSection}>
          <img
            className={styles.Logo}
            src="/chat-bot.png"
            alt="Chatterly AI Logo"
          />
          <h2 className={styles.Title}>Chatterly AI</h2>
        </div>

        {/* Model & Features on the right */}
        <div className={styles.RightSection}>
          <select
            className={styles.ModelSelect}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="googleai">Google AI</option>
            <option value="openai">OpenAI</option>
            <option value="deepseekai">DeepSeek AI</option>
          </select>

          <div className={styles.FeaturesDropdown}>
            <button
              className={styles.FeaturesButton}
              onClick={() => setIsFeaturesOpen((prev) => !prev)}
            >
              Features
            </button>
            {isFeaturesOpen && (
              <ul className={styles.FeaturesList}>
                <li onClick={toggleTheme}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
