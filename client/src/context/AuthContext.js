import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const HOST = "https://shorts-t2dk.onrender.com"; // replace if needed

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const login = async (email, password) => {
    const { data } = await axios.post(`${HOST}/auth/login`, { email, password });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };
  const signup = async (email, password, username) => {
    const { data } = await axios.post(`${HOST}/auth/signup`, { email, password, username });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };
  const logout = () => {
    setUser(null); setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
