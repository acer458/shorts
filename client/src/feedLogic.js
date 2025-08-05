// feedLogic.js
import axios from "axios";

// ---- CONFIG ----
export const HOST = "https://shorts-t2dk.onrender.com";

// ---- String helpers ----
export function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

// Fisher-Yates shuffle
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Likes (localStorage) ----
export function isLiked(filename) {
  return localStorage.getItem("like_" + filename) === "1";
}
export function setLiked(filename, yes) {
  if (yes) localStorage.setItem("like_" + filename, "1");
  else localStorage.removeItem("like_" + filename);
}

// ---- Profile Avatars ----
export function getProfilePic(v) {
  return v.avatar || v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}

// ---- Fake Data For UI preview ----
export function fakeAvatar(i) {
  // Provide a unique avatar per index
  return `https://api.dicebear.com/8.x/thumbs/svg?seed=User${i}`;
}
export function fakeTime(i) {
  // Return friendly time strings
  if (i === 0) return "just now";
  if (i === 1) return "2 min ago";
  if (i === 2) return "15 min ago";
  return (6 * i + 4) + " min ago";
}

// ---- API: Feed ----
export async function fetchFeed() {
  const res = await axios.get(HOST + "/shorts");
  // Optionally shuffle or sort newest first, etc.
  return shuffleArray(res.data);
}
export async function fetchSingle(filename) {
  const res = await axios.get(`${HOST}/shorts/${filename}`);
  // Normalize .url always present:
  return { ...res.data, url: res.data.url || `${HOST}/shorts/${filename}` };
}

// ---- API LIKE/COMMENT STUBS (extend for real backend as needed) ----
export async function serverLike(filename, like = true) {
  // Example payload: { like: true/false }
  try {
    await axios.post(`${HOST}/shorts/${filename}/like`, { like });
  } catch (e) {
    // Optionally swallow (for demo), or handle error gracefully
  }
}
export async function serverAddComment(filename, { name, text }) {
  try {
    await axios.post(`${HOST}/shorts/${filename}/comment`, { name, text });
  } catch (e) {
    // Optionally show error
  }
}
