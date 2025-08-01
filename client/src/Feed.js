import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com"; // Your backend URL

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  // Like functionality: update UI and send to backend if endpoint exists
  const [likePending, setLikePending] = useState({});
  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    setLikePending((l) => ({ ...l, [filename]: true }));
    // Example: Send like to backend (if implemented)
    axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
      setShorts((prev) =>
        prev.map((v, i) =>
          i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v
        )
      );
      setLikePending((l) => ({ ...l, [filename]: false }));
    });
  }

  // Play/pause video on tap
  function handleVideoClick(idx) {
    const vid = videoRefs.current[idx];
    if (vid) {
      if (vid.paused) vid.play();
      else vid.pause();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}
      >
        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop();
          return (
            <div
              key={idx}
              style={{
                minHeight: "100vh",
                width: "100vw",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Video element */}
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                autoPlay={idx === 0}
                playsInline
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "cover",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                }}
                onClick={() => handleVideoClick(idx)}
              />
              {/* Overlay actions (right) */}
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 90,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  zIndex: 4,
                }}
              >
                {/* User avatar (placeholder) */}
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#81ecec,#0984e3)",
                    marginBottom: 12,
                    border: "2px solid #fff8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  {v.author?.[0]?.toUpperCase() || "👤"}
                </div>
                {/* Like */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 32,
                    padding: 0,
                  }}
                  onClick={() => handleLike(idx, filename)}
                >
                  ❤️
                  <div style={{ fontSize: 16, marginTop: 2 }}>
                    {v.likes || 0}
                  </div>
                </button>
                {/* Comment */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 30,
                    padding: 0,
                  }}
                  // Add your own comment modal/flow
                >
                  💬
                  <div style={{ fontSize: 16, marginTop: 2 }}>
                    {(v.comments && v.comments.length) || 0}
                  </div>
                </button>
                {/* Share */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 28,
                  }}
                  onClick={() => {
                    const url =
                      window.location.origin + "/?v=" + filename;
                    if (navigator.share) {
                      navigator.share({ url });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Link copied!");
                    }
                  }}
                >
                  <span role="img" aria-label="share">
                    📤
                  </span>
                </button>
              </div>
              {/* Bottom overlay: author/caption/comments */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(0deg,#000c 68%,#0002 97%,transparent)",
                  color: "#fff",
                  padding: "22px 18px 38px 18px",
                  zIndex: 6,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Username/@handle */}
                <div style={{ fontWeight: "bolder", fontSize: 18 }}>
                  @{v.author || "anonymous"}
                </div>
                {/* Caption */}
                <div style={{ fontSize: 17, margin: "5px 0 8px 0" }}>
                  {v.caption}
                </div>
                {/* Comment preview */}
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 15, color: "#bbdefb" }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "#b2bec3",
                    fontSize: 15,
                    marginTop: 1,
                  }}
                >
                  View all {v.comments ? v.comments.length : 0} comments
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

