// ==== COMPONENT: LoginForm ====
// Allows user to login with Gmail and password. Calls backend /api/login.

import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setInfo("Logging in...");
    try {
      const res = await axios.post("/api/login", { email, password });
      // Save token to localStorage or context for API use:
      localStorage.setItem("token", res.data.token);
      setInfo("Login success!");
      setTimeout(onDone, 700);
    } catch (err) {
      setInfo("Login failed: " + (err?.response?.data || err.toString()));
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <input required type="email" placeholder="Gmail"
        value={email} onChange={e => setEmail(e.target.value)} autoFocus
        style={{ width: "100%", margin: "7px 0", padding: 12, borderRadius: 8, border: "none" }}
      />
      <input required type="password" placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", margin: "7px 0", padding: 12, borderRadius: 8, border: "none" }}
      />
      <button type="submit"
        style={{ width: "100%", background: "#fff", color: "#056DFF", fontWeight: "bold", fontSize: 20, padding: 12, margin: "13px 0", borderRadius: 16, border: "none" }}>
        Log In
      </button>
      <div style={{ color: "#fff", marginTop: 12 }}>{info}</div>
    </form>
  );
}
