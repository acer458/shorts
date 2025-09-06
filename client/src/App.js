import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import About from "./About";
import Community from "./Community";
import Login from "./Login";
import Signup from "./Signup";
import Header from "./Header";

// A component to protect routes that require authentication
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    // This effect runs once on load
    const timer = setTimeout(() => {
      if (!user) {
        // If user is not logged in after 5 seconds, show prompt
        alert("Sign up or log in to like and comment on videos!");
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      <main className="app-main-content">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          
          {/* Public Routes */}
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/shorts/:filename" element={<VideoPlayer user={user} />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/community" element={
            <ProtectedRoute user={user}>
              <Community user={user} />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            // You will need a separate AdminAuth component to check for admin status
            <AdminDashboard user={user} onLogout={handleLogout} />
          } />
          
          {/* Catch-all path */}
          <Route path="*" element={<Feed />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
