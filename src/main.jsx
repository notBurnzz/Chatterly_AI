import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import "./styles/global.css"; // Ensure the correct import path

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
);
