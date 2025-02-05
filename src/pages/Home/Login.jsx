import React, { useState } from "react";
import styles from "./Login.module.css";
import { handleLogin } from "../../services/login";

export function Login({ setUser, setMessages }) {
  const [error, setError] = useState(null);

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.LoginBox}>
        <h2 className={styles.LoginTitle}>Welcome to Chatterly AI</h2>
        <p className={styles.LoginDescription}>Sign in to start chatting</p>

        {/* Error Message Display */}
        {error && <p className={styles.ErrorMessage}>{error}</p>}

        {/* Google Login Button */}
        <button className={styles.LoginButton} onClick={() => handleLogin(setUser, setMessages, setError)}>
          <img src="/google-icon.png" alt="Google Logo" className={styles.GoogleLogo} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
