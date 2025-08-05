// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import VideoPlayer from "./VideoPlayer";
import AdminDashboard from "./AdminDashboard";
import { AuthProvider } from "./components/Auth/useAuth";
// If you have NotFound component, you can import here
// import NotFound from "./NotFound";
