import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
html, body, #root {
  background: #000 !important;
  padding: 0;
  margin: 0;
}
::-webkit-scrollbar { width: 0; background: transparent; }
