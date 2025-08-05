// src/components/Auth/SignInModal.js
import React, { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";

export default function SignInModal() {
  const { startAuthSession, markGmailVerified } = useAuth();

  // Form state
  const [form, setForm] = useState({ username: "", gmail: "", password: "" });
  const [gmailValid, setGmailValid] = useState(null);
  const [submissionStage, setSubmissionStage] = useState("form"); // "form" | "wait" | "success" | "error"
  const [error, setError] = useState("");

  // Add scroll lock to body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []); // Only runs on mount/unmount

  // Live Gmail validation
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "gmail") {
      setGmailValid(/^[\w.+-]+@gmail\.com$/.test(value));
    }
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmissionStage("wait");
    try {
      await axios.post("/api/register", {
        username: form.username,
        gmail: form.gmail,
        password: form.password,
      });
      startAuthSession({ username: form.username, gmail: form.gmail });
      setSubmissionStage("success");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error! Try again or use a different Gmail."
      );
      setSubmissionStage("error");
    }
  }

  // Checking for Gmail verification
  async function checkVerification() {
    try {
      const res = await axios.get("/api/check-gmail-verified", {
        params: { gmail: form.gmail },
      });
      if (res.data.verified) {
        markGmailVerified();
      } else {
        setError("Gmail not verified yet. Check your mailbox.");
      }
    } catch (err) {
      setError("Verification check failed. Try again.");
    }
  }

  // Modal UI
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {submissionStage === "form" && (
          <form onSubmit={handleSubmit} autoComplete="off">
            <h2>Sign In to Continue</h2>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              autoFocus
            />
            <input
              name="gmail"
              value={form.gmail}
              onChange={handleChange}
              placeholder="Gmail address"
              type="email"
              required
              style={{ borderColor: gmailValid === false ? "red" : undefined }}
            />
            {gmailValid === false && (
              <div style={{ color: "red", fontSize: 12 }}>
                Enter a valid Gmail address!
              </div>
            )}
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              required
            />
            <button
              type="submit"
              disabled={
                !gmailValid || !form.username || !form.password
              }
            >
              Sign In &amp; Verify Gmail
            </button>
            {error && <div className="error-msg">{error}</div>}
          </form>
        )}

        {submissionStage === "wait" && (
          <p>Sending verification email to <b>{form.gmail}</b>...</p>
        )}

        {submissionStage === "success" && (
          <>
            <p>
              Please check your Gmail (<b>{form.gmail}</b>) and click the verification link.
              <br /><br />
              Once done, click below:
            </p>
            <button onClick={checkVerification}>I Verified My Gmail</button>
            {error && <div className="error-msg">{error}</div>}
          </>
        )}

        {submissionStage === "error" && (
          <div>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => setSubmissionStage("form")}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
