// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import { AuthProvider } from "./components/Auth/useAuth";
// If you have NotFound component, you can import here
// import NotFound from "./NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main (random order, all videos) */}
          <Route path="/" element={<Feed />} />
          {/* Single video by filename */}
          <Route path="/shorts/:filename" element={<VideoPlayer />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Optional: Not found route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
