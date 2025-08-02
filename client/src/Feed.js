import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// ICONS as before...
function HeartIcon({ filled }) { /* ...[same as given above]... */ }
function CommentIcon() { /* ...[same as given above]... */ }
function ShareIcon() { /* ...[same as given above]... */ }

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
  const wrapperRefs = useRef([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  // Play only the video in view
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleIdx = Number(entry.target.dataset.idx);
          }
        });
        if (maxRatio > 0.7) setCurrentIdx(visibleIdx);
      },
      { threshold: [0, 0.5, 0.7, 1] }
    );
    wrapperRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length]);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) vid.play().catch(()=>{});
      else vid.pause();
    });
  }, [currentIdx]);

  // Like logic is toggle: double tap likes/unlikes
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
    // Double tap in 350ms toggles like/unlike:
    if (now - lastTapTime < 350) {
      handleLike(idx, filename);
    } else {
      // Single tap: play/pause
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
              ? { ...v, comments: [...(v.comments || []), { name: "Anonymous", text }] }
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
        background: "#000",
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
          background: "#000",
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
              data-idx={idx}
              ref={el => wrapperRefs.current[idx] = el}
              style={{
                width: "100vw",
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
              }}
            >
              <video
                ref={el => videoRefs.current[idx] = el}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  // Prevent browser zoom on double tap/pinch
                  touchAction: "manipulation"
                }}
                onClick={() => handleVideoDoubleTap(idx, filename)}
                onTouchEnd={() => handleVideoDoubleTap(idx, filename)}
                // You may add onDoubleClick if needed on desktop (but onClick covers both)
              />

              {/* Right: Like, comment, share stack ... [as in code above, omit 3-dots] */}
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  bottom: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 24,
                  zIndex: 10,
                  userSelect: "none",
                }}
              >
                {/* Like */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    filter: liked ? "drop-shadow(0 0 12px #e11d4880)" : "none",
                    transition: "filter 0.18s",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => handleLike(idx, filename)}
                >
                  <HeartIcon filled={liked} />
                  <div
                    style={{
                      fontSize: 16,
                      marginTop: 2,
                      color: liked ? "#e11d48" : "#fff",
                      fontWeight: liked ? 700 : 400,
                      textShadow: liked ? "0 0 8px #e11d4890" : "none",
                    }}
                  >
                    {v.likes || 0}
                  </div>
                </button>
                {/* ... (Comment and share, as before) ... */}
                {/* Copy rest of the stack from the previous answer */}
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
                  onClick={() =>
                    setShowComments((cur) => ({
                      ...cur,
                      [filename]: !cur[filename],
                    }))
                  }
                >
                  <CommentIcon />
                  <span style={{ fontSize: 15, marginTop: 1 }}>
                    {(v.comments && v.comments.length) || 0}
                  </span>
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 28,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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

              {/* ... Caption/etc. at bottom, comment modal ... leave as in previous code ... */}
              {/* [Copy these sections from your working UI, everything else remains unchanged] */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
