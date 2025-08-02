import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Feed from "./Feed";
import AdminDashboard from "./AdminDashboard";
import LoginPage from "./LoginPage";

const ADMIN_EMAIL = "youradmin@email.com"; // set this to your admin's email

function isAdmin(session) {
  return session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {!session && <Route path="*" element={<LoginPage onLogin={setSession} />} />}
        {session && (
          <>
            <Route path="/" element={<Feed />} />
            <Route path="/admin" element={
              isAdmin(session) ? <AdminDashboard /> : <Navigate to="/" />
            } />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
