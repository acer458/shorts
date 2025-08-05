import axios from "axios";

// --------- CONFIG
export const HOST = "https://shorts-t2dk.onrender.com";

// --------- CAPTION TRUNCATE
// Paste these directly below import axios at the top

export function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(' ', maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isLiked(filename) {
  return localStorage.getItem("like_" + filename) === "1";
}

export function setLiked(filename, yes) {
  if (yes) localStorage.setItem("like_" + filename, "1");
  else localStorage.removeItem("like_" + filename);
}

// Add any other helpers like fetchFeed, fetchSingle, serverLike, serverAddComment below

// --------- CAPTION TRUNCAT

export function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

// -------- Fisher-Yates SHUFFLE --------
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Like status (localStorage)
export function isLiked(filename) {
  return localStorage.getItem("like_" + filename) === "1";
}
export function setLiked(filename, yes) {
  if (yes) localStorage.setItem("like_" + filename, "1");
  else localStorage.removeItem("like_" + filename);
}

// Avatars and time helpers
export function getProfilePic(v) {
  return v.avatar || v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}
export function fakeAvatar(i) {
  const urls = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/18.jpg"
  ];
  return urls[i % urls.length];
}
export function fakeTime(i) {
  return ["2h ago", "1h ago", "45m ago", "30m ago", "15m ago", "Just now"][i % 6] || "Just now";
}

// API helpers
export async function fetchFeed() {
  const res = await axios.get(HOST + "/shorts");
  return shuffleArray(res.data);
}
export async function fetchSingle(filename) {
  const res = await axios.get(`${HOST}/shorts/${filename}`);
  return { ...res.data, url: res.data.url || `/shorts/${filename}` };
}
export async function serverLike(filename) {
  await axios.post(`${HOST}/shorts/${filename}/like`);
}
export async function serverAddComment(filename, comment) {
  await axios.post(`${HOST}/shorts/${filename}/comment`, comment);
}

