// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// // Simple modal login/signup dialog
// export default function AuthDialog({ onClose }) {
//   const { login, signup } = useAuth();
//   const [mode, setMode] = useState("login");
//   const [fields, setFields] = useState({ email: "", password: "", username: "" });
//   const [error, setError] = useState("");
//   const doSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (mode === "login") {
//         await login(fields.email, fields.password);
//       } else {
//         await signup(fields.email, fields.password, fields.username);
//       }
//       onClose();
//     } catch (e) {
//       setError(e.response?.data?.error || "Error");
//     }
//   };
//   return (
//     <div style={{
//       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
//     }}>
//       <form onSubmit={doSubmit} style={{
//         width: 320, background: '#181a23', borderRadius: 12, padding: 24,
//         boxShadow: "0 4px 28px #0008", display: 'flex', flexDirection: 'column', gap: 11
//       }}>
//         <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
//         <input placeholder="Email" value={fields.email} autoComplete="email"
//           onChange={e => setFields(f => ({ ...f, email: e.target.value }))} required />
//         <input type="password" autoComplete="current-password" placeholder="Password" value={fields.password}
//           onChange={e => setFields(f => ({ ...f, password: e.target.value }))} required />
//         {mode === "signup" && (
//           <input placeholder="Username" value={fields.username}
//             onChange={e => setFields(f => ({ ...f, username: e.target.value }))} required />
//         )}
//         <button type="submit" style={{ marginTop: 11 }}>{mode === "login" ? "Login" : "Sign Up"}</button>
//         <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
//           style={{ background: "none", color: "#33b6ff", marginTop: 0, border: "none", fontSize: 14 }}>
//           {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
//         </button>
//         {error && <div style={{ color: "#e53935", fontSize: 15 }}>{error}</div>}
//         <button type="button" onClick={onClose} style={{
//           background: "none", border: "none", color: "#888", fontSize: 15, marginTop: 9
//         }}>Close</button>
//       </form>
//     </div>
//   );
// }
