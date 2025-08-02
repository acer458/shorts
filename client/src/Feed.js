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
        style={{ filter: "drop-shadow(0 0 16px #e11d4890)" }}
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={36} height={36} fill="none">
      <path
        d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5
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

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = false;
        vid.play().catch(()=>{});
      } else {
        vid.pause();
        vid.currentTime = 0;
        vid.muted = true;
      }
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
      },
      { threshold: [0, 0.5, 0.7, 1] }
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
      setShorts(prev => prev.map((v, i) => i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v));
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }
  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: e => {
        setTimeout(() => {
          if (e.detail === 1) {
            const vid = videoRefs.current[idx];
            if (vid) vid.paused ? vid.play() : vid.pause();
          }
        }, 275);
      },
      onDoubleClick: () => handleLike(idx, filename),
      onTouchEnd: () => {
        let now = Date.now();
        let vid = videoRefs.current[idx];
        if (!vid) return;
        let last = vid.__lastTapTime || 0;
        vid.__lastTapTime = now;
        if (now - last < 350) {
          clearTimeout(tapTimeout);
          handleLike(idx, filename);
        } else {
          tapTimeout = setTimeout(() => {
            if (Date.now() - vid.__lastTapTime >= 350) {
              if (vid.paused) vid.play();
              else vid.pause();
            }
          }, 360);
        }
      }
    };
  }
  function handleSeek(idx, e, isTouch = false) {
    let clientX;
    if (isTouch) {
      if (!e.touches || e.touches.length !== 1) return;
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = x / rect.width;
    const vid = videoRefs.current[idx];
    if (vid && vid.duration && isFinite(vid.duration)) {
      vid.currentTime = Math.max(0, Math.min(percent, 1)) * vid.duration;
    }
  }
  function handleTimeUpdate(idx, filename) {
    const vid = videoRefs.current[idx];
    setVideoProgress((prev) => ({
      ...prev,
      [filename]:
        vid && vid.duration && !isNaN(vid.duration) && isFinite(vid.duration)
          ? vid.currentTime / vid.duration
          : 0,
    }));
  }
  function handleAddComment(idx, filename) {
    const text = (commentInputs[filename] || "").trim();
    if (!text) return;
    axios
      .post(`${HOST}/shorts/${filename}/comment`, { name: "Anonymous", text })
      .then(() => {
        setShorts(prev =>
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
        minHeight: "100dvh",
        width: "100vw",
        background: "#000",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          margin: 0,
          padding: 0,
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0, padding: 0, overflow: "hidden"
              }}
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: "100vw",
                  height: "100dvh",
                  objectFit: "contain",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  touchAction: "manipulation"
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />
              {/* Seekable progress bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 4,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 32,
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  touchAction: "none"
                }}
                onClick={e => handleSeek(idx, e, false)}
                onTouchStart={e => handleSeek(idx, e, true)}
              >
                <div
                  style={{
                    width: `${Math.min(prog * 100, 100)}%`,
                    height: "100%",
                    background: "rgb(42, 131, 254)",
                    transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              {/* --- LIKE/COMMENT/SHARE STACK --- */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: "20%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 34,
                  zIndex: 10,
                  userSelect: "none",
                  pointerEvents: "auto",
                }}
              >
                {/* Like */}
                <button
                  style={{
                    background: "#181b29",
                    border: "none",
                    borderRadius: "50%",
                    width: 52,
                    height: 52,
                    boxShadow: "0 1px 5px #0004",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 1,
                    cursor: "pointer",
                    outline: "none"
                  }}
                  onClick={() => handleLike(idx, filename)}
                  tabIndex={-1}
                >
                  <HeartIcon filled={liked} />
                </button>
                <div style={{
                  color: liked ? "#e11d48" : "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center"
                }}>
                  {v.likes || 0}
                </div>
                {/* Comment */}
                <button
                  style={{
                    background: "#181b29",
                    border: "none",
                    borderRadius: "50%",
                    width: 52,
                    height: 52,
                    boxShadow: "0 1px 5px #0004",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 1,
                    cursor: "pointer",
                    outline: "none"
                  }}
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                  tabIndex={-1}
                >
                  <CommentIcon />
                </button>
                <div style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center"
                }}>
                  {(v.comments && v.comments.length) || 0}
                </div>
                {/* Share */}
                <button
                  style={{
                    background: "#181b29",
                    border: "none",
                    borderRadius: "50%",
                    width: 52,
                    height: 52,
                    boxShadow: "0 1px 5px #0004",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 1,
                    cursor: "pointer",
                    outline: "none"
                  }}
                  onClick={() => {
                    const url = window.location.origin + "/?v=" + filename;
                    if (navigator.share) {
                      navigator.share({ url, title: "Watch this short!" });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  tabIndex={-1}
                >
                  <ShareIcon />
                </button>
                <div style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: "center",
                  opacity: 0.8
                }}>
                  Share
                </div>
              </div>
              {/* Info/caption/comments PREVIEW */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
                  color: "#fff",
                  padding: "20px 18px 28px 18px",
                  zIndex: 6,
                  display: "flex",
                  flexDirection: "column",
                  userSelect: "none",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 17 }}>
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
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>

              {/* --- COMMENTS MODAL --- */}
              {showComments[filename] && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 500,
                    background: "#000b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overscrollBehavior: "contain"
                  }}
                  onClick={() =>
                    setShowComments(cur => ({ ...cur, [filename]: false }))
                  }
                >
                  <div
                    style={{
                      background: "#181b29",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      minHeight: 270,
                      maxHeight: "70vh",
                      width: "100vw",
                      boxShadow: "0 -4px 18px #000c",
                      padding: 0,
                      position: 'relative',
                      left: 0,
                      bottom: 0,
                      transition: "0.22s cubic-bezier(.48,1.5,0.5,1)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 54,
                      borderBottom: "1px solid #22263c",
                      color: "#8cd9ff",
                      fontWeight: 600,
                      fontSize: 18,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      position: "relative"
                    }}>
                      Comments
                      <button
                        onClick={() => setShowComments(cur => ({ ...cur, [filename]: false }))}
                        style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 23,
                          background: "none",
                          color: "#fff",
                          border: "none",
                          borderRadius: 18,
                          width: 36, height: 36,
                          cursor: "pointer"
                        }}
                      >×</button>
                    </div>
                    {/* Comments list: all comments, IG-style */}
                    <div style={{
                      overflowY: "auto",
                      maxHeight: "33vh",
                      padding: "4px 0 0 0"
                    }}>
                      {(v.comments || []).length === 0 && (
                        <div style={{ color: "#ccc", fontSize: 15, textAlign: "center", padding: 20 }}>No comments yet.</div>
                      )}
                      {(v.comments || []).map((comment, ci) => (
                        <div key={ci} style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "13px 18px 13px 18px", borderBottom: "1px solid #22263c"
                        }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "#111a", marginRight: 0, flexShrink: 0
                          }}>
                            <img src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(comment.name || "anon")}`}
                              alt="avatar"
                              style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ color: "#9fd1ff", fontWeight: 600, fontSize: 16 }}>{comment.name}</span>
                            {" "}
                            <span style={{ color: "#fff", fontSize: 16 }}>{comment.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Modern pull-up input bar */}
                    <div
                      style={{
                        position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 3,
                        background: "#23243f", padding: "13px 11px 16px 11px", borderRadius: "0 0 14px 14px",
                        display: "flex", alignItems: "center", gap: 10, width: "99%", margin: "auto"
                      }}
                    >
                      <input
                        value={commentInputs[filename] || ""}
                        onChange={e =>
                          setCommentInputs(prev => ({ ...prev, [filename]: e.target.value }))
                        }
                        placeholder="Add a comment…"
                        style={{
                          flex: 1,
                          border: "none",
                          borderRadius: 22,
                          fontSize: 18,
                          padding: "13px 16px",
                          outline: "none",
                          background: "#1a202f",
                          color: "#fff"
                        }}
                        onKeyDown={e => { if (e.key === "Enter") handleAddComment(idx, filename); }}
                        inputMode="text"
                      />
                      <button
                        style={{
                          background: commentInputs[filename]?.trim()
                            ? "#2983fe" : "#7daefc",
                          color: "#fff",
                          border: "none",
                          borderRadius: 22,
                          padding: "12px 22px",
                          fontWeight: 700,
                          fontSize: 17,
                          cursor: commentInputs[filename]?.trim() ? "pointer" : "not-allowed"
                        }}
                        disabled={!commentInputs[filename]?.trim()}
                        onClick={() => handleAddComment(idx, filename)}
                      >Send</button>
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
