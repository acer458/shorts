// client/src/Feed.js

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// For smooth scroll snapping, some basic CSS (see below)
const HOST = "https://shorts-t2dk.onrender.com";

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const [likePending, setLikePending] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const videoRefs = useRef([]);

  useEffect(() => {
    axios.get(HOST + "/shorts").then(res => setShorts(res.data));
  }, []);

  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    setLikePending(l => ({ ...l, [filename]: true }));
    axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
      setShorts(shorts =>
        shorts.map((v, i) =>
          i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v
        )
      );
      setLikePending(l => ({ ...l, [filename]: false }));
    });
  }

  function handleAddComment(idx, filename) {
    const text = commentInputs[filename];
    if (!text) return;
    axios
      .post(`${HOST}/shorts/${filename}/comment`, {
        name: "Anonymous", // you can extend with user login later
        text,
      })
      .then((res) => {
        setShorts((prev) =>
          prev.map((v, i) =>
            i === idx
              ? { ...v, comments: [...(v.comments || []), { name: "Anonymous", text }] }
              : v
          )
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      });
  }

  // Snap to current video on scroll
  const feedRef = useRef(null);

  // Pause/play on tap
  function handleVideoClick(idx) {
    const vid = videoRefs.current[idx];
    if (vid.paused) vid.play();
    else vid.pause();
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Feed Container: vertical scroll snap */}
      <div
        ref={feedRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop();
          return (
            <div
              key={idx}
              style={{
                position: "relative",
                minHeight: "100vh",
                width: "100vw",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#000",
                overflow: "hidden",
              }}
            >
              {/* Video full-screen */}
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                controls={false}
                autoPlay={idx === 0}
                loop
                preload="metadata"
                playsInline
                style={{
                  width: "100vw",
                  maxWidth: 500,
                  height: "100vh",
                  objectFit: "cover",
                  background: "#111",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onClick={() => handleVideoClick(idx)}
                onTouchEnd={() => handleVideoClick(idx)}
              />

              {/* Overlay UI Controls */}
              <div
                style={{
                  position: "absolute",
                  bottom: 48,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  color: "#fff",
                  padding: 20,
                  pointerEvents: "none",
                  background: "linear-gradient(0deg, #000d 65%, #0009 95%, transparent)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {/* Caption */}
                <div
                  style={{
                    fontSize: 18,
                    marginBottom: 6,
                    fontWeight: 600,
                    pointerEvents: "auto",
                  }}
                >
                  {v.caption || ""}
                </div>
                {/* Action Bar */}
                <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 2 }}>
                  {/* Like */}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: likePending[filename] ? "#aaa" : "#fff",
                      fontSize: 22,
                      cursor: "pointer",
                      pointerEvents: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    onClick={() => handleLike(idx, filename)}
                  >
                    ❤️ <span style={{ fontSize: 17 }}>{v.likes || 0}</span>
                  </button>
                  {/* Comment */}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: 22,
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={() =>
                      setShowComments(o => ({
                        ...o,
                        [filename]: !o[filename],
                      }))
                    }
                  >
                    💬 {v.comments ? v.comments.length : 0}
                  </button>
                  {/* Share */}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: 22,
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={() => {
                      const url = window.location.origin + "/?v=" + filename;
                      if (navigator.share) {
                        navigator.share({
                          url,
                          title: "Checkout this short!",
                        });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    🔗
                  </button>
                </div>
                {/* Comments: show/hide */}
                {showComments[filename] && (
                  <div style={{
                    width: "100%",
                    maxWidth: 400,
                    marginTop: 8,
                    background: "#0009",
                    padding: 8,
                    borderRadius: 10,
                    pointerEvents: "auto",
                  }}>
                    <div style={{ maxHeight: 140, overflowY: "auto", marginBottom: 7 }}>
                      {(v.comments || []).length === 0 ? (
                        <div style={{ color: "#ccc", fontSize: 13 }}>No comments yet.</div>
                      ) : (
                        v.comments.map((c, ci) => (
                          <div key={ci} style={{ fontSize: 15, margin: "4px 0" }}>
                            <b style={{ color: "#83e" }}>{c.name}</b>: {c.text}
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <input
                        value={commentInputs[filename] || ""}
                        onChange={e =>
                          setCommentInputs(i => ({
                            ...i,
                            [filename]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                        style={{
                          flex: 1,
                          borderRadius: 5,
                          border: "1px solid #333",
                          padding: 5,
                          fontSize: 13,
                          background: "#181C23",
                          color: "#fff"
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleAddComment(idx, filename);
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(idx, filename)}
                        style={{
                          background: "#47a3f3",
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          padding: "3px 12px",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
