import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable Fast Refresh for the root component
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
