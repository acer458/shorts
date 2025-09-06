import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import About from "./About";
import Community from "./Community";
import Login from "./Login";
import Signup from "./Signup";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Feed />} />
        <Route path="/shorts/:filename" element={<VideoPlayer user={user} />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected Routes */}
        <Route path="/community" element={
          <ProtectedRoute user={user}>
            <Community user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          // You will need a separate AdminAuth component to check for admin status
          <AdminDashboard user={user} onLogout={handleLogout} />
        } />
        
        {/* Catch-all path */}
        <Route path="*" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}
