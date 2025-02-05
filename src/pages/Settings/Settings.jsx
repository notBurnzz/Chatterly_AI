import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import { useAuth } from "../../contexts/AuthContext";

export function Settings() {
  const { user, logoutUser } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      document.body.classList.toggle("dark-mode", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <div className={styles.SettingsContainer}>
      <h2 className={styles.Title}>Settings</h2>

      <div className={styles.Option}>
        <label>Dark Mode</label>
        <button onClick={toggleTheme} className={styles.ToggleButton}>
          {isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </button>
      </div>

      {user && (
        <div className={styles.Option}>
          <label>Account</label>
          <button onClick={logoutUser} className={styles.LogoutButton}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
