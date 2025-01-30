import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { signInWithGoogle, logout, auth } from "../../firebase"; // Import Firebase authentication

export function Sidebar({ messages = [], setMessages = () => {}, user, setUser }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Listen for Firebase Auth state changes to update user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  // Toggle sidebar expansion
  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  // Handle Chat Selection
  const handleChatSelection = (chatId) => {
    const selectedChat = messages.find((msg) => msg.id === chatId);
    if (selectedChat) {
      setMessages([selectedChat]);
    }
  };

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
      className={`${styles.Sidebar} ${isExpanded ? styles.Expanded : styles.Collapsed}`}
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
                onClick={() => handleChatSelection(chat.id)}
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

      {/* 🔹 User Section at Bottom */}
      <div className={styles.BottomSection}>
        {user ? (
          <div className={styles.UserInfo}>
            <img
              className={styles.UserAvatar}
              src={user.photoURL || "/default-avatar.png"}
              alt="User Avatar"
            />
            {isExpanded && <span className={styles.UserEmail}>{user.email}</span>}
            <button className={styles.AuthButton} onClick={handleLogout}>
              Logout
            </button>
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
