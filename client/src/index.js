// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const isDev = process.env.NODE_ENV === "development";

// ── Dark mode class for Tailwind dark: variants ──
document.documentElement.classList.add("dark");

// ── Apply base background immediately to prevent flash of light ──
document.documentElement.style.backgroundColor = "#020c14";
document.documentElement.style.colorScheme = "dark";

// ── Mount ──
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "[StackQuery] Root element #root not found.\n" +
    "Check public/index.html for <div id=\"root\"></div>."
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  isDev ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);

// ── Dev-only diagnostics ──
if (isDev) {
  // Global uncaught error logger
  window.addEventListener("error", (e) => {
    console.error("[StackQuery] Uncaught error:", e.error);
  });

  // Unhandled promise rejection logger
  window.addEventListener("unhandledrejection", (e) => {
    console.error("[StackQuery] Unhandled promise rejection:", e.reason);
  });

  console.info(
    "%c StackQuery %c dev mode ",
    "background:#020c14;color:#00ffc8;font-family:monospace;font-size:12px;padding:4px 8px;border:1px solid #00ffc8;",
    "background:#00ffc8;color:#020c14;font-family:monospace;font-size:12px;padding:4px 8px;"
  );
}