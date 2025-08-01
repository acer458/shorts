import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Your backend URL:
const HOST = "https://shorts-t2dk.onrender.com";

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);

  // For likes and comments form state
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Fetch all videos on mount
  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  // Like a video
  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    setLikePending((l) => ({ ...l, [filename]: true }));
    axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
      setShorts((prev) =>
        prev.map((v, i) =>
          i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v
        )
      );
      setLikePending((l) => ({ ...l, [filename]: false }));
    });
  }

  // Add a comment
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

  // Play/pause on tap/click
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
          return (
            <div
              key={idx}
              style={{
                width: "100%",
                height: "100%",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#1b2029",
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
                onClick={() => handleVideoClick(idx)}
                onTouchEnd={() => handleVideoClick(idx)}
              />

              {/* Overlay: Actions (right side vertical) */}
              <div
                style={{
                  position: "absolute",
                  right: 10,
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
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#81ecec,#0984e3 90%)",
                    border: "2.5px solid #ffffffda",
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
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
                    fontSize: 36,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => handleLike(idx, filename)}
                >
                  ❤️
                  <span
                    style={{
                      fontSize: 17,
                      marginTop: "-3px",
                      color: "#fff",
                    }}
                  >
                    {v.likes || 0}
                  </span>
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
                  onClick={() => {
                    setShowComments((cur) => ({
                      ...cur,
                      [filename]: !cur[filename],
                    }));
                  }}
                >
                  💬
                  <span style={{ fontSize: 17, marginTop: "-3px" }}>
                    {(v.comments && v.comments.length) || 0}
                  </span>
                </button>
                {/* Share */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 30,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                  onClick={() => {
                    const url =
                      window.location.origin + "/?v=" + filename;
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
                  <span role="img" aria-label="share">
                    📤
                  </span>
                </button>
              </div>

              {/* Bottom overlay: Caption, user, comment preview */}
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
                {/* Username/@handle */}
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  @{v.author || "anonymous"}
                </div>
                {/* Caption */}
                <div style={{ fontSize: 17, margin: "5px 0 8px 0" }}>
                  {v.caption}
                </div>
                {/* Latest comment preview */}
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 15, color: "#bae6fd" }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                {/* View all comments link */}
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
