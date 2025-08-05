// src/components/Auth/useAuth.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [auth, setAuth] = useState({
    isSignedIn: false,
    isGmailVerified: false,
    user: null,
  });

  // Call this when user signs in, pending verification
  function startAuthSession(user) {
    setAuth({ isSignedIn: true, isGmailVerified: false, user });
  }

  // Call this after Gmail verification
  function markGmailVerified() {
    setAuth((prev) => ({ ...prev, isGmailVerified: true }));
    setShowModal(false);
  }

  const value = {
    auth,
    showModal,
    setShowModal,
    startAuthSession,
    markGmailVerified,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
