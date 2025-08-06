// ==== COMPONENT: AuthPopup ====
// Renders a modal with the Login/Signup forms, styled after your attached design.

import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const popupStyle = {
  // ...STYLE CODE, use your UI colors (blue bg, white cards), see comments below
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(0,0,0,0.15)", zIndex: 1001
};

const boxStyle = {
  // White rounded box, shadowed, as per your image
  background: "#056DFF", borderRadius: 24, padding: 32, minWidth: 350,
  boxShadow: "0 8px 32px rgba(5, 109, 255, 0.18)", color: "#fff"
};

function AuthPopup({ open, onClose }) {
  const [mode, setMode] = useState("signup"); // "signup" or "login"
  if (!open) return null;
  return (
    <div style={popupStyle}>
      <div style={boxStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <span
            style={{
              fontWeight: "bold", fontSize: 26,
              textDecoration: mode === "signup" ? "underline" : "",
              color: "#fff", cursor: "pointer"
            }}
            onClick={() => setMode("signup")}
          >Sign Up</span>
          <span
            style={{
              fontSize: 24,
              textDecoration: mode === "login" ? "underline" : "",
              color: "#fff", cursor: "pointer"
            }}
            onClick={() => setMode("login")}
          >Log in</span>
        </div>
        {mode === "signup" ? <SignupForm onDone={onClose} /> : <LoginForm onDone={onClose} />}
      </div>
    </div>
  );
}

export default AuthPopup;
