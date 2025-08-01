
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Adjust to your backend API
const HOST = "https://shorts-t2dk.onrender.com";

// ---- ICONS (SVG, styled similar to what you described) ----
function HeartIcon({ filled, ...props }) {
  return filled ? (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" {...props}>
      <path
        d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5 10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5c2 0 4.5 1.5 4.5 4.5 0 5-7.5 11.5-7.5 11.5Z"
        strokeWidth="2"
        strokeLinejoin="round"
        filter="url(#glow-heart)"
      />
      <defs>
        <filter id="glow-heart" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  ) : (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" {...props}>
      <path
        d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5 10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5c2 0 4.5 1.5 4.5 4.5 0 5-7.5 11.5-7.5 11.5Z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CommentIcon(props) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" {...props}>
      <rect x="3" y="5" width="18" height="12" rx="4" strokeWidth="2"/>
      <path d="M8 21l2-4h4l2 4" strokeWidth="2"/>
    </svg>
  );
}
function ShareIcon(props) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" {...props}>
      <path d="M13 5l7 7-7 7" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M5 12h15" strokeWidth="2"/>
    </svg>
  );
}

// ---- LocalStorage like utils (for demo, real apps use accounts/db) ----
function isLiked(filename) {
  return localStorage.getItem("like_" + filename) === "1";
}
function setLiked(filename, yes) {
  if (yes) localStorage.setItem("like_" + filename, "1");
  else localStorage.removeItem("like_" + filename);
}

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  // Like (one per browser, toggle like/unlike)
  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending((l) => ({ ...l, [filename]: true }));

    if (!liked) {
      // Like
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts((prev) =>
          prev.map((v, i) =>
            i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v
          )
        );
        setLiked(filename, true);
        setLikePending((l) => ({ ...l, [filename]: false }));
      });
    } else {
      // Unlike: local only (unless you have an unlike endpoint)
      setShorts((prev) =>
        prev.map((v, i) =>
          i === idx && (v.likes || 0) > 0
            ? { ...v, likes: v.likes - 1 }
            : v
        )
      );
      setLiked(filename, false);
      setLikePending((l) => ({ ...l, [filename]: false }));
    }
  }

  // Double-tap handler for like/unlike
  function handleVideoDoubleTap(idx, filename) {
    const now = Date.now();
    const liked = isLiked(filename);
    if (now - lastTapTime < 350) {
      // Double-tap: toggle like
      handleLike(idx, filename);
    } else {
      // Single tap: pause/play
      const vid = videoRefs.current[idx];
      if (vid) {
        if (vid.paused) vid.play();
        else vid.pause();
      }
    }
    setLastTapTime(now);
  }

  // Comment logic
  function handleAddComment(idx, filename) {
    const text = (commentInputs[filename] || "").trim();
    if (!text) return;
    axios
      .post(`${HOST}/shorts/${filename}/comment`, {
        name: "Anonymous",
        text,
      })
      .then(() => {
        setShorts((prev) =>
          prev.map((v, i) =>
            i === idx
              ? {
                  ...v,
                  comments: [...(v.comments || []), { name: "Anonymous", text }],
                }
              : v
          )
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "clamp(320px, 28vw, 430px)",
          aspectRatio: "9/16",
          background: "#111",
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "90vh",
          height: "min(90vh, 900px)",
          boxShadow: "0 0 32px #000c",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          scrollSnapType: "y mandatory",
          overflowY: "scroll",
        }}
      >
        {shorts.length === 0 && (
          <div
            style={{
              color: "#bbb",
              textAlign: "center",
              marginTop: 120,
              fontSize: 20,
            }}
          >
            No shorts uploaded yet.
          </div>
        )}

        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop();
          const liked = isLiked(filename);

          return (
            <div
              key={idx}
              style={{
                width: "100%",
                height: "100%",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#181D23",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Video full-screen */}
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                autoPlay={idx === 0}
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                }}
                onClick={() => handleVideoDoubleTap(idx, filename)}
                onTouchEnd={() => handleVideoDoubleTap(idx, filename)}
              />

              {/* Overlay: Actions (right side vertical) */}
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 110,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  zIndex: 10,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#81ecec,#0984e3 90%)",
                    border: "2px solid #ffffffda",
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {v.author?.[0]?.toUpperCase() || "👤"}
                </div>
                {/* Like (Glowing, pink, toggles and with animation) */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    filter: liked
                      ? "drop-shadow(0 0 18px #e11d4890)"
                      : "none",
                    transition: "filter 0.18s",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                  onClick={() => handleLike(idx, filename)}
                >
                  <HeartIcon filled={liked} />
                  <div
                    style={{
                      fontSize: 16,
                      marginTop: 0,
                      color: liked ? "#e11d48" : "#fff",
                      fontWeight: liked ? 700 : 400,
                      textShadow: liked ? "0 0 8px #e11d4890" : "none"
                    }}
                  >
                    {v.likes || 0}
                  </div>
                </button>
                {/* Comments */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => setShowComments(o => ({
                    ...o,
                    [filename]: !o[filename],
                  }))}
                >
                  <CommentIcon />
                  <span style={{ fontSize: 15, marginTop: "-3px" }}>
                    {(v.comments && v.comments.length) || 0}
                  </span>
                </button>
                {/* Share */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 28,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                  onClick={() => {
                    const url = window.location.origin + "/?v=" + filename;
                    if (navigator.share) {
                      navigator.share({
                        url,
                        title: "Watch this short!",
                      });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }
                  }}
                >
                  <ShareIcon />
                </button>
              </div>

              {/* Bottom overlay: Caption/User/Comment */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(0deg,#000c 76%,#0005 94%,transparent)",
                  color: "#fff",
                  padding: "22px 18px 38px 18px",
                  zIndex: 6,
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  @{v.author || "anonymous"}
                </div>
                <div style={{ fontSize: 17, margin: "5px 0 8px 0" }}>
                  {v.caption}
                </div>
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 15, color: "#bae6fd" }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "#b2bec3",
                    fontSize: 15,
                    marginTop: 1,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setShowComments((cur) => ({
                      ...cur,
                      [filename]: true,
                    }))
                  }
                >
                  View all {v.comments ? v.comments.length : 0} comments
                </div>
              </div>

              {/* Comments modal */}
              {showComments[filename] && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 100,
                    background: "#000c",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                  onClick={() =>
                    setShowComments((cur) => ({
                      ...cur,
                      [filename]: false,
                    }))
                  }
                >
                  <div
                    style={{
                      background: "#202030",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      maxHeight: "55%",
                      overflowY: "auto",
                      boxShadow: "0 -4px 24px #000a",
                      padding: "22px 12px 10px 14px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 19,
                        marginBottom: 12,
                        color: "#aee0ff",
                      }}
                    >
                      Comments
                    </div>
                    {(v.comments || []).length === 0 && (
                      <div style={{ color: "#ccc", fontSize: 15 }}>
                        No comments yet.
                      </div>
                    )}
                    {(v.comments || []).map((c, ci) => (
                      <div key={ci} style={{ margin: "7px 0", fontSize: 16 }}>
                        <b style={{ color: "#9fd1ff" }}>{c.name}</b>{" "}
                        <span style={{ color: "#fff" }}>{c.text}</span>
                      </div>
                    ))}
                    {/* Comment input box */}
                    <div
                      style={{
                        marginTop: 15,
                        display: "flex",
                        gap: 4,
                        background: "none",
                      }}
                    >
                      <input
                        value={commentInputs[filename] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [filename]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                        style={{
                          flex: 1,
                          borderRadius: 7,
                          border: "1px solid #333",
                          fontSize: 15,
                          color: "#fff",
                          background: "#14151b",
                          padding: "5px 11px",
                          outline: "none",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleAddComment(idx, filename);
                        }}
                      />
                      <button
                        style={{
                          background: "#47a3f3",
                          color: "#fff",
                          border: "none",
                          borderRadius: 7,
                          padding: "7px 16px",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                        onClick={() => handleAddComment(idx, filename)}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
