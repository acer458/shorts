// ==== COMPONENT: SignupForm ====
// Allows user to sign up with username, Gmail, and password.
// Calls backend /api/register and shows confirmation message.

import React, { useState } from "react";
import axios from "axios";

export default function SignupForm({ onDone }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  async function handleSignup(e) {
    e.preventDefault();
    setInfo("Signing up...");
    try {
      await axios.post("/api/register", { username, email, password });
      setInfo("Verification email sent – check your inbox!");
    } catch (err) {
      setInfo("Signup failed: " + (err?.response?.data || err.toString()));
    }
  }
  return (
    <form onSubmit={handleSignup}>
      <input required placeholder="Username"
        value={username} onChange={e => setUsername(e.target.value)} autoFocus
        style={{ width: "100%", margin: "7px 0", padding: 12, borderRadius: 8, border: "none" }}
      />
      <input required type="email" placeholder="Gmail"
        value={email} onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", margin: "7px 0", padding: 12, borderRadius: 8, border: "none" }}
      />
      <input required type="password" placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", margin: "7px 0", padding: 12, borderRadius: 8, border: "none" }}
      />
      <button type="submit"
        style={{ width: "100%", background: "#fff", color: "#056DFF", fontWeight: "bold", fontSize: 20, padding: 12, margin: "13px 0", borderRadius: 16, border: "none" }}>
        Sign Up
      </button>
      <div style={{ color: "#fff", marginTop: 12 }}>{info}</div>
    </form>
  );
}
