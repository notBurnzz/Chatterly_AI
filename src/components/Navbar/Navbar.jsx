import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";

export function Navbar({ selectedModel, setSelectedModel }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync theme with localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <header className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        {/* Logo + Title */}
        <div className={styles.LeftSection}>
          <img
            className={styles.Logo}
            src="/chat-bot.png"
            alt="Chatterly AI Logo"
          />
          <h2 className={styles.Title}>Chatterly AI</h2>
        </div>

        {/* Right Section: Model Selection + Features */}
        <div className={styles.RightSection}>
          {/* AI Model Selector */}
          <select
            className={styles.ModelSelect}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="googleai">Google AI</option>
            <option value="openai">OpenAI</option>
            <option value="deepseekai">DeepSeek AI</option>
            <option value="qwenai">Qwen AI</option>
          </select>

          {/* Features Dropdown */}
          <div className={styles.FeaturesDropdown} ref={dropdownRef}>
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
                <li onClick={() => alert("Feature 1 clicked!")}>
                  Other Feature 1
                </li>
                <li onClick={() => alert("Feature 2 clicked!")}>
                  Other Feature 2
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
