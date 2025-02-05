import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";

export function Navbar({ selectedModel, setSelectedModel }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🔹 Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newTheme = !prevMode;
      document.body.classList.toggle("dark-mode", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  // 🔹 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
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

        {/* Right Section: Model Selector + Features */}
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
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-label="Toggle Features"
            >
              Features
            </button>

            {isDropdownOpen && (
              <ul className={styles.FeaturesList}>
                <li onClick={toggleTheme}>
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </li>
                <li onClick={() => alert("Feature 1 activated!")}>
                  Feature 1
                </li>
                <li onClick={() => alert("Feature 2 activated!")}>
                  Feature 2
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
