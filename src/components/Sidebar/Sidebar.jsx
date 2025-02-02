import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { signInWithGoogle, logout, auth } from "../../firebase";

export function Sidebar({ messages = [], setMessages = () => {}, user, setUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  // Toggle sidebar expansion
  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  // Handle Google Login
  const handleLogin = async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Handle Google Logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setMessages([]); // Clear messages on logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      className={`${styles.Sidebar} ${
        isExpanded ? styles.Expanded : styles.Collapsed
      }`}
      onMouseEnter={toggleSidebar}
      onMouseLeave={toggleSidebar}
    >
      {/* 🔹 Chat History Section */}
      <div className={styles.TopSection}>
        <h3 className={styles.SidebarTitle}>Chat History</h3>
        {messages.length === 0 ? (
          <p className={styles.EmptyMessage}>No chats available</p>
        ) : (
          <ul className={styles.ChatList}>
            {messages.map((chat) => (
              <li
                key={chat.id}
                className={styles.ChatItem}
                onClick={() => setMessages([chat])}
              >
                <span className={styles.ModelName}>{chat.model}</span>
                <span className={styles.Timestamp}>
                  {new Date(chat.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔹 User Section */}
      <div className={styles.BottomSection}>
        {user ? (
          <div
            className={styles.UserInfo}
            onMouseEnter={() => setIsDropdownVisible(true)}
            onMouseLeave={() => setIsDropdownVisible(false)}
          >
            <img
              className={styles.UserAvatar}
              src={user.photoURL || "/default-avatar.png"}
              alt="User Avatar"
            />
            {isExpanded && <span className={styles.UserEmail}>{user.email}</span>}

            {/* Dropdown for Logout */}
            {isDropdownVisible && (
              <div className={styles.Dropdown}>
                <button
                  className={styles.DropdownButton}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.AuthButton} onClick={handleLogin}>
            {isExpanded ? "Login with Google" : "Login"}
          </button>
        )}
      </div>
    </div>
  );
}
