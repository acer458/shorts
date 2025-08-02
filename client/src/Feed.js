import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// ICON COMPONENTS
function HeartIcon({ filled }) {/* ...Same as before... */}
function CommentIcon() {/* ...Same as before... */}
function ShareIcon() {/* ...Same as before... */}

// One-like-per-browser helpers
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

  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending((l) => ({ ...l, [filename]: true }));

    if (!liked) {
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
      setShorts((prev) =>
        prev.map((v, i) =>
          i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
        )
      );
      setLiked(filename, false);
      setLikePending((l) => ({ ...l, [filename]: false }));
    }
  }

  function handleVideoDoubleTap(idx, filename) {
    const now = Date.now();
    if (now - lastTapTime < 350) {
      handleLike(idx, filename);
    } else {
      const vid = videoRefs.current[idx];
      if (vid) {
        if (vid.paused) vid.play();
        else vid.pause();
      }
    }
    setLastTapTime(now);
  }

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
        width: "100vw",
        background: "#000", // redundant but safe
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          margin: 0,
          padding: 0,
          background: "#000", // add here too, just in case
        }}
      >
        {shorts.length === 0 && (
          <div style={{
            color: "#bbb",
            textAlign: "center",
            marginTop: 120,
            fontSize: 20,
          }}>
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
                width: "100vw",
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#000", // <- For letterbox/pillarbox, this must be black!
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
              }}
            >
              {/* Video element with background explicitly set */}
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                autoPlay={idx === 0}
                playsInline
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  background: "#000", // <- critical for the white bars issue!
                  cursor: "pointer",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "none",
                }}
                onClick={() => handleVideoDoubleTap(idx, filename)}
                onTouchEnd={() => handleVideoDoubleTap(idx, filename)}
              />

              {/* ...the rest of your overlays/buttons/modal remain unchanged... */}
              {/* Copy the overlays and modals code here from your original component */}
              {/* For brevity, it’s omitted -- use your existing code for overlays, buttons, comments */}
              
              {/* Overlays and comments ... (same as before) */}
              {/* TIP: see previous code for overlays and comments modal */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
