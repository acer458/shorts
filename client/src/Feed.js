import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// Simple icons; in real use, swap with SVGs or Icon libraries
function HeartIcon({ filled, animate }) {
  // Bump/pop style animation when liked
  return (
    <span
      className={`heart-icon ${filled ? "filled" : ""} ${animate ? "animate" : ""}`}
      style={{
        display: "inline-block",
        transition: "transform 0.2s",
        color: filled ? "red" : "white",
        fontSize: 28,
        ...(animate ? { transform: "scale(1.23)" } : {}),
        filter: "drop-shadow(0 0 4px red)",
      }}
    >
      {filled ? "❤️" : "🤍"}
    </span>
  );
}
function CommentIcon() {
  return <span style={{
    fontSize: 25, color: "#fff", filter: "drop-shadow(0 0 3px #222)"
  }}>💬</span>;
}
function ShareIcon() {
  return <span style={{
    fontSize: 23, color: "#fff", filter: "drop-shadow(0 0 2px #222)"
  }}>🔗</span>;
}

function isLiked(filename) { /* ...same as before... */ }
function setLiked(filename, yes) { /* ...same as before... */ }

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [lastTapTime, setLastTapTime] = useState(0);
  const [animateHeart, setAnimateHeart] = useState({});

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending((l) => ({ ...l, [filename]: true }));

    // Animate the heart icon
    setAnimateHeart((prev) => ({ ...prev, [filename]: true }));
    setTimeout(() => setAnimateHeart((prev) => ({ ...prev, [filename]: false })), 240);

    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShor
