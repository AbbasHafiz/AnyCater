import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./shared/context/auth-context";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
    
      <App />
      
    </AuthProvider>
    
  </React.StrictMode>
);
