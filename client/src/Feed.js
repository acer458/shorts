import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  // Like functionality via localStorage
  function isLiked(filename) {
    return localStorage.getItem("like_" + filename) === "1";
  }
  function setLiked(filename, yes) {
    if (yes) localStorage.setItem("like_" + filename, "1");
    else localStorage.removeItem("like_" + filename);
  }
  const [likePending, setLikePending] = useState({});
  const [lastTapTime, setLastTapTime] = useState(0);

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
          i === idx && (v.likes || 0) > 0
            ? { ...v, likes: v.likes - 1 }
            : v
        )
      );
      setLiked(filename, false);
      setLikePending((l) => ({ ...l, [filename]: false }));
    }
  }

  function handleVideoDoubleTap(idx, filename) {
    const now = Date.now();
    if (now - lastTapTime < 350) {
      handleLike(idx, filename); // double-tap = like/unlike
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
          aspectRatio: "9/16", // Still phone-size frame, but video fits any shape
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Flexible wrapper to center video with letterbox/pillarbox */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#181D23",
                  position: "relative",
                }}
              >
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={HOST + v.url}
                  loop
                  autoPlay={idx === 0}
                  playsInline
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain", // Handles any aspect ratio, always fits, never stretches
                    background: "#000",
                    cursor: "pointer",
                    display: "block",
                    borderRadius: 6,
                  }}
                  onClick={() => handleVideoDoubleTap(idx, filename)}
                  onTouchEnd={() => handleVideoDoubleTap(idx, filename)}
                />
              </div>
              {/* Overlay UI: Like, Comment, Share etc. (add your design as per previous code) */}
              {/* ... (same as before) ... */}
              {/* Bottom caption/user/comments, modals, etc. */}
              {/* ... (same as before) ... */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
