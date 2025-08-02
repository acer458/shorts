import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
