import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// --- ICONS ---
function HeartIcon({ filled }) {
  return filled ? (
    <svg viewBox="0 0 24 24" width={36} height={36}>
      <path
        d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5
        10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5c2 0 4.5 1.5 4.5 4.5
        0 5-7.5 11.5-7.5 11.5Z"
        fill="#e11d48"
        stroke="#e11d48"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={36} height={36} fill="none">
      <path
        d="M12 21C12 21 4.5 14.5 4.5 9.5
          4.5 6.5 7 5 9 5
          10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5
          c2 0 4.5 1.5 4.5 4.5 0 5-7.5 11.5-7.5 11.5Z"
        stroke="#fff"
        strokeWidth="2"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff">
      <rect x="3" y="5" width="18" height="12" rx="4" strokeWidth="2" />
      <path d="M8 21l2-4h4l2 4" strokeWidth="2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff">
      <path d="M13 5l7 7-7 7" strokeWidth="2" />
      <path d="M5 12h15" strokeWidth="2" />
    </svg>
  );
}

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
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => { axios.get(HOST + "/shorts").then(res => setShorts(res.data)); }, []);
  
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) { 
        vid.muted = false; 
        vid.play().catch(()=>{}); 
        // Force progress bar to show immediately
        if (vid.currentTime === 0) vid.currentTime = 0.001;
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
  }, [currentIdx]);

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
      }, { threshold: [0, 0.5, 0.7, 1] }
    );
    wrapperRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length]);

  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev => prev.map((v, i) => i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v));
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
    } else {
      setShorts(prev => prev.map((v, i) =>
        i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
      ));
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }

  // ... [keep all other functions exactly the same] ...

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#000",
        overflow: "hidden",
        touchAction: 'none' // Prevent dragging
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          background: "#000",
        }}
      >
        {shorts.length === 0 && (
          <div style={{
            color: "#bbb",
            textAlign: "center",
            marginTop: 120,
            fontSize: 20
          }}>No shorts uploaded yet.</div>
        )}
        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop();
          const liked = isLiked(filename);
          const prog = videoProgress[filename] || 0;

          return (
            <div
              key={idx}
              data-idx={idx}
              ref={el => (wrapperRefs.current[idx] = el)}
              style={{
                width: "100vw",
                height: "100dvh",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#000",
                overflow: "hidden"
              }}
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />

              {/* Progress bar - now always visible */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 60,
                  height: 2,
                  background: "rgba(255,255,255,0.3)",
                  zIndex: 10
                }}
              >
                <div
                  style={{
                    width: `${Math.min(prog * 100, 100)}%`,
                    height: "100%",
                    background: "#fff",
                    transition: "width 0.1s linear"
                  }}
                />
              </div>

              {/* Right action buttons */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 24,
                  zIndex: 10
                }}
              >
                {/* Like button */}
                <button
                  onClick={() => handleLike(idx, filename)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0
                  }}
                >
                  <HeartIcon filled={liked} />
                </button>
                <div style={{
                  color: liked ? "#e11d48" : "#fff",
                  fontSize: 12,
                  marginTop: 4
                }}>
                  {v.likes || 0}
                </div>

                {/* Comment button */}
                <button
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0
                  }}
                >
                  <CommentIcon />
                </button>
                <div style={{
                  color: "#fff",
                  fontSize: 12,
                  marginTop: 4
                }}>
                  {(v.comments && v.comments.length) || 0}
                </div>

                {/* Share button */}
                <button
                  onClick={() => {
                    const url = window.location.origin + "/?v=" + filename;
                    if (navigator.share) {
                      navigator.share({ url, title: "Watch this short!" });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0
                  }}
                >
                  <ShareIcon />
                </button>
                <div style={{
                  color: "#fff",
                  fontSize: 12,
                  marginTop: 4
                }}>
                  Share
                </div>
              </div>

              {/* Bottom info section - no shadow */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 60,
                  padding: "12px 16px",
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 5
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  @{v.author || "anonymous"}
                </div>
                <div style={{ fontSize: 14, margin: "4px 0" }}>
                  {v.caption}
                </div>
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 14 }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 14,
                    marginTop: 4,
                    cursor: "pointer"
                  }}
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                >
                  View all {v.comments ? v.comments.length : 0} comments
                </div>
              </div>

              {/* Comments modal - keep your existing modal code */}
              {showComments[filename] && (
                // ... [keep your existing comments modal code] ...
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
