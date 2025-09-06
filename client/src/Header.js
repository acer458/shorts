import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => navigate("/")}>Shorts</div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name}</span>
            <button className="header-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="header-btn" onClick={() => navigate("/login")}>
            Login / Sign Up
          </button>
        )}
      </nav>
    </header>
  );
}
