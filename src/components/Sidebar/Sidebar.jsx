import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
<<<<<<< HEAD
import { signInWithGoogle, logout, auth } from "../../firebase";

export function Sidebar({ messages = [], setMessages = () => {}, user, setUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
=======
import { signInWithGoogle, logout, auth, fetchChatSessions } from "../../firebase";

export function Sidebar({ user, setUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
>>>>>>> eabef92 (03/02-changes)

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
<<<<<<< HEAD
=======
      if (currentUser) {
        fetchChatSessions(currentUser.uid).then(setChatSessions);
      }
>>>>>>> eabef92 (03/02-changes)
    });
    return () => unsubscribe();
  }, [setUser]);

  // Toggle sidebar expansion
  const toggleSidebar = () => setIsExpanded((prev) => !prev);

  // Handle Google Login
  const handleLogin = async () => {
    try {
<<<<<<< HEAD
      const loggedInUser = await signInWithGoogle();
      setUser(loggedInUser);
=======
      const { user, chatSessions } = await signInWithGoogle();
      setUser(user);
      setChatSessions(chatSessions);
>>>>>>> eabef92 (03/02-changes)
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
<<<<<<< HEAD
=======
  
>>>>>>> eabef92 (03/02-changes)

  // Handle Google Logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
<<<<<<< HEAD
      setMessages([]); // Clear messages on logout
=======
      setChatSessions([]); // Clear chat sessions on logout
>>>>>>> eabef92 (03/02-changes)
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
<<<<<<< HEAD
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
=======
        {chatSessions.length === 0 ? (
          <p className={styles.EmptyMessage}>No chats available</p>
        ) : (
          <ul className={styles.ChatList}>
            {chatSessions.map((chat) => (
              <li key={chat.id} className={styles.ChatItem}>
                <span className={styles.ModelName}>{chat.title}</span> {/* First message as title */}
>>>>>>> eabef92 (03/02-changes)
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
<<<<<<< HEAD
                <button
                  className={styles.DropdownButton}
                  onClick={handleLogout}
                >
=======
                <button className={styles.DropdownButton} onClick={handleLogout}>
>>>>>>> eabef92 (03/02-changes)
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
