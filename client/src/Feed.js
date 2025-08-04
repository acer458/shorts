import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const HOST = "https://shorts-t2dk.onrender.com";
const MAX_AUTOPLAY = 2;
const APP_FONT = `'Inter', system-ui, sans-serif`;

// Google Fonts loader
if (!document.getElementById('feedjs-inter-font')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.id = 'feedjs-inter-font';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
  document.head.appendChild(link);
}

// SVG and Icon Components (unchanged, expanded here)
function HeartSVG({ filled }) {
  return (
    <svg aria-label={filled ? "Unlike" : "Like"} height="28" width="28" viewBox="0 0 48 48">
      <path
        fill={filled ? "#ed4956" : "none"}
        stroke={filled ? "#ed4956" : "#fff"}
        strokeWidth="3"
        d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
      />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width={82} height={82} viewBox="0 0 82 82">
      <circle cx="41" cy="41" r="40" fill="#000A" />
      <rect x="26" y="20" width="10" height="42" rx="3" fill="#fff"/>
      <rect x="46" y="20" width="10" height="42" rx="3" fill="#fff"/>
    </svg>
  );
}
function PulseHeart({ visible }) {
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", zIndex: 106,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        animation: visible ? "heartPulseAnim .75s cubic-bezier(.1,1.6,.6,1)" : "none"
      }}
    >
      <svg viewBox="0 0 96 96" width={90} height={90} style={{ display: "block" }}>
        <path
          d="M48 86C48 86 12 60 12 32.5 12 18.8 24.5 10 36 10c6.2 0 11.9 3.3 12 3.3S53.8 10 60 10c11.5 0 24 8.8 24 22.5C84 60 48 86 48 86Z"
          fill="#ed4956"
          stroke="#ed4956"
          strokeWidth="7"
        />
      </svg>
      <style>
        {`
        @keyframes heartPulseAnim {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
          14% { opacity: 0.92; transform: translate(-50%,-50%) scale(1.22);}
          27% { opacity: 1; transform: translate(-50%,-50%) scale(0.89);}
          44%, 82% { opacity: 0.92; transform: translate(-50%,-50%) scale(1);}
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
        }
        `}
      </style>
    </div>
  );
}
function ReplayFAB({ onClick }) {
  return (
    <button
      aria-label="Replay"
      onClick={onClick}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        background: "#191919e0",
        border: "none",
        borderRadius: "50%",
        width: 56,
        height: 56,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 24px #0008",
        zIndex: 120,
        cursor: "pointer",
        transition: "background .2s, transform .2s"
      }}
    >
      <svg width="34" height="34" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="#fff2" />
        <path
          d="M22 12a12 12 0 1 1-8.5 20.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polygon points="13,27 21,28 16,33" fill="#fff"/>
      </svg>
    </button>
  );
}
function MuteMicIcon({ muted }) {
  return muted ? (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff2" stroke="#fff"/>
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff"/>
      <line x1="4.8" y1="4.8" x2="19.2" y2="19.2" stroke="#fff" strokeWidth="2.6"/>
    </svg>
  ) : (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff1" stroke="#fff"/>
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff"/>
    </svg>
  );
}

// Utility functions...
function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fakeAvatar(i) {
  const urls = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/18.jpg"
  ];
  return urls[i % urls.length];
}
function fakeTime(i) {
  return ["2h ago", "1h ago", "45m ago", "30m ago", "15m ago", "Just now"][i % 6] || "Just now";
}
function getProfilePic(v) {
  return v.avatar || v.profilePic || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}

const fontStyle = {
  fontFamily: APP_FONT,
  letterSpacing: '-0.01em',
  WebkitFontSmoothing: "antialiased"
};

export default function Feed() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const videoRefs = useRef([]);
  const wrapperRefs = useRef([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [mutePulse, setMutePulse] = useState(false);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [showPause, setShowPause] = useState(false);
  const [showPulseHeart, setShowPulseHeart] = useState(false);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);

  // ...continue to "next" for fetch/random logic & all event handlers, and the full render...

    // --- MAIN RANDOMIZATION + LINK-TO-VIDEO ---
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    const params = new URLSearchParams(location.search);
    const filename = params.get('v');
    axios.get(HOST + "/shorts").then(res => {
      let allShorts = res.data;
      if (filename) {
        const idx = allShorts.findIndex(v => (v.url.split("/").pop() === filename || v.filename === filename));
        if (idx === -1) { setNotFound(true); setShorts([]); setLoading(false); return; }
        const picked = allShorts.splice(idx, 1)[0];
        allShorts = [picked, ...shuffleArray(allShorts)];
      } else {
        allShorts = shuffleArray(allShorts);
      }
      setShorts(allShorts);
      setCurrentIdx(0);
      setTimeout(() => setLoading(false), 160);
    });
  }, [location.search]);

  // --- IntersectionObserver for vertical scrolling ---
  useEffect(() => {
    if (!shorts.length) return;
    const observer = new window.IntersectionObserver(
      entries => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach(entry => {
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

  // --- Video auto-play/pause logic ---
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        vid.play().catch(()=>{});
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPulseHeart(false);
  }, [currentIdx, muted, shorts.length]);

  // --- Handlers ---
  function isLiked(filename) { return localStorage.getItem("like_" + filename) === "1"; }
  function setLiked(filename, yes) { if (yes) localStorage.setItem("like_" + filename, "1"); else localStorage.removeItem("like_" + filename); }
  function handleLike(idx, filename, wantPulse = false) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev => prev.map((v, i) => i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v));
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
      if (wantPulse) { setShowPulseHeart(true); setTimeout(() => setShowPulseHeart(false), 720);}
    } else {
      setShorts(prev => prev.map((v, i) =>
        i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
      ));
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }
  function handleShare(filename) {
    const url = window.location.origin + "/?v=" + filename;
    if (navigator.share) { navigator.share({ url, title: "Watch this short!" }); }
    else { navigator.clipboard.writeText(url); alert("Link copied to clipboard!"); }
  }
  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: () => {
        if (tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) { vid.play(); setShowPause(false); }
          else { vid.pause(); setShowPause(true); }
        }, 240);
      },
      onDoubleClick: () => {
        if (tapTimeout) { clearTimeout(tapTimeout); tapTimeout = null; }
        if (!isLiked(filename)) handleLike(idx, filename, true);
        setShowPulseHeart(true);
        setTimeout(() => setShowPulseHeart(false), 700);
      },
      onTouchEnd: e => {
        if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
        if (tapTimeout) {
          clearTimeout(tapTimeout); tapTimeout = null;
          if (!isLiked(filename)) handleLike(idx, filename, true);
          setShowPulseHeart(true);
          setTimeout(() => setShowPulseHeart(false), 700);
        } else {
          tapTimeout = setTimeout(() => {
            const vid = videoRefs.current[idx];
            if (vid) {
              if (vid.paused) { vid.play(); setShowPause(false); }
              else { vid.pause(); setShowPause(true); }
            }
            tapTimeout = null;
          }, 250);
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
      [filename]: vid && vid.duration && isFinite(vid.duration)
        ? vid.currentTime / vid.duration : 0,
    }));
  }
  function handleAddComment(idx, filename) {
    const text = (commentInputs[filename] || "").trim();
    if (!text) return;
    axios.post(`${HOST}/shorts/${filename}/comment`, { name: "You", text })
      .then(() => {
        setShorts(prev =>
          prev.map((v, i) =>
            i === idx
              ? { ...v, comments: [...(v.comments || []), { name: "You", text }] }
              : v
          )
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      });
  }
  const handleCaptionExpand = (filename) => setExpandedCaptions(prev => ({ ...prev, [filename]: !prev[filename] }));
  // Modal drag-to-close handlers
  function handleModalTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    dragStartY.current = e.touches[0].clientY;
    setIsDraggingModal(true);
  }
  function handleModalTouchMove(e) {
    if (!isDraggingModal || !e.touches || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setModalDragY(dy);
  }
  function handleModalTouchEnd() {
    setIsDraggingModal(false);
    if (modalDragY > 65) setShowComments(null);
    setModalDragY(0);
  }

  // --- Continue with rendering code in next part! ---

    if (loading) return (
    <>
      <SkeletonShort />
      <SkeletonShort />
    </>
  );
  if (notFound)
    return <div style={{ color: "#e11d48", textAlign: "center", marginTop: 180 }}>Video not found.</div>;
  if (shorts.length === 0)
    return <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20 }}>No shorts uploaded yet.</div>;

  return (
    <div style={{ minHeight: "100dvh", width: "100vw", background: "#000", margin: 0, padding: 0, overflow: "hidden" }}>
      <div style={{
        width: "100vw",
        height: "100dvh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: "#000"
      }}>
        {shorts.map((v, idx) => {
          // --- Per-video local state
          const filename = v.url.split('/').pop();
          const liked = isLiked(filename);
          const prog = videoProgress[filename] || 0;
          const comments = v.comments || [];
          const allComments = comments.map((c, i) => ({
            ...c,
            avatar: fakeAvatar(i),
            time: fakeTime(i)
          }));
          const caption = v.caption || "";
          const isTruncated = caption.length > 90;
          const showFull = expandedCaptions[filename];
          const displayedCaption = showFull ? caption : truncateString(caption, 90);
          const isCurrent = idx === currentIdx;

          return (
            <div key={idx} data-idx={idx} ref={el => (wrapperRefs.current[idx] = el)}
              style={{
                width: "100vw", height: "100dvh", scrollSnapAlign: "start",
                position: "relative", background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
              }}>
              {/* VIDEO ELEMENT */}
              <video ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                playsInline
                loop
                style={{ width: "100vw", height: "100dvh", objectFit: "contain", background: "#000", cursor: "pointer", display: "block" }}
                muted={muted}
                autoPlay={isCurrent}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
                {...handleVideoEvents(idx, filename)}
              />

              {/* Mute/Unmute Button */}
              {isCurrent && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setMuted(m => !m);
                    setMutePulse(true);
                    setTimeout(() => setMutePulse(false), 350);
                  }}
                  aria-label={muted ? "Unmute" : "Mute"}
                  style={{
                    position: "absolute", top: 20, right: 20, zIndex: 60,
                    background: "rgba(28,29,34,0.65)", border: "none", borderRadius: 16, width: 39, height: 39,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                  }}
                >
                  <MuteMicIcon muted={muted} />
                </button>
              )}

              {/* Likes, Comments, Share bar */}
              <div style={{
                position: 'absolute', right: '12px', bottom: '100px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 10
              }}>
                <div style={{
                  marginBottom: 6, width: 48, height: 48,
                  borderRadius: "50%", overflow: "hidden"
                }}>
                  <img src={getProfilePic(v)} alt="dp"
                    style={{
                      width: "100%", height: "100%",
                      borderRadius: "50%", objectFit: "cover"
                    }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); if (!liked) handleLike(idx, filename, true); else handleLike(idx, filename, false); }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <HeartSVG filled={liked} />
                  </button>
                  <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px' }}>{v.likes || 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); setShowComments(filename); }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>{v.comments?.length || 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => handleShare(filename)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>Share</span>
                </div>
              </div>

              {/* Bottom caption/comments */}
              <div style={{
                position: "absolute",
                left: 0, right: 0, bottom: 0,
                background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
                color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6,
                display: "flex", flexDirection: "column", userSelect: "none"
              }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
                  @{v.author || "anonymous"}
                </div>
                {caption && (
                  <div style={{
                    display: "flex", alignItems: "flex-end", minHeight: "26px", maxWidth: 500
                  }}>
                    <div
                      style={{
                        fontWeight: 400,
                        fontSize: 16,
                        color: "#fff",
                        lineHeight: 1.4,
                        maxHeight: showFull ? "none" : "2.8em",
                        overflow: showFull ? "visible" : "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: showFull ? "unset" : 2,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word",
                        marginRight: isTruncated ? 10 : 0,
                        whiteSpace: "pre-line"
                      }}
                    >
                      {displayedCaption}
                    </div>
                    {isTruncated && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#33b6ff",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          marginLeft: 2,
                          padding: 0,
                          lineHeight: 1.3,
                          textDecoration: "underline",
                          transition: "color .15s"
                        }}
                        onClick={() => handleCaptionExpand(filename)}
                        tabIndex={0}>
                        {showFull ? "less" : "more"}
                      </button>
                    )}
                  </div>
                )}
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 14, color: "#bae6fd" }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "#b2bec3", fontSize: 15, marginTop: 3, cursor: "pointer"
                  }}
                  onClick={() => setShowComments(filename)}
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>
              {/* Comments modal */}
              {showComments === filename &&
                <CommentsModal
                  comments={allComments}
                  onClose={() => setShowComments(null)}
                  onSubmit={txt => handleAddComment(idx, filename, txt)}
                />
              }
            </div>
          );
        })}
      </div>
      <style>
        {`
          html, body, #root {
            font-family: 'Inter', system-ui, sans-serif !important;
            letter-spacing: -0.02em;
            background: #000;
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}

// Comments modal as a subcomponent
function CommentsModal({ comments, onClose, onSubmit }) {
  const [commentInput, setCommentInput] = React.useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (commentInput.trim()) {
      onSubmit(commentInput.trim());
      setCommentInput("");
    }
  }
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.93)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 1000
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: '#111',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: 16,
        color: '#fff'
      }}>
        <h3 style={{ margin: 0, marginBottom: 16, fontWeight: 600 }}>Comments</h3>
        {comments.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>No comments yet.</div>
        ) : (
          comments.map((comment, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <img src={comment.avatar} alt="" style={{ width: 28, height: 28, borderRadius: 14, marginRight: 7, verticalAlign: "middle" }} />
              <b>{comment.name}</b>: {comment.text}
              <span style={{ color: "#aaa", marginLeft: 6, fontSize: 12 }}>{comment.time}</span>
            </div>
          ))
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: 16 }}>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 20,
              border: 'none',
              fontSize: 14
            }}
          />
          <button type="submit" disabled={!commentInput.trim()} style={{ marginLeft: 8, fontWeight: 600 }}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
// ---- Helper: getProfilePic, avatars, and times ---
function getProfilePic(v) {
  return v.avatar || v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}
function fakeAvatar(i) {
  const urls = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/18.jpg"
  ];
  return urls[i % urls.length];
}
function fakeTime(i) {
  return ["2h ago", "1h ago", "45m ago", "30m ago", "15m ago", "Just now"][i % 6] || "Just now";
}

// ---- Utility for LIKE localStorage management ----
function isLiked(filename) {
  return localStorage.getItem("like_" + filename) === "1";
}
function setLiked(filename, yes) {
  if (yes) localStorage.setItem("like_" + filename, "1");
  else localStorage.removeItem("like_" + filename);
}

// ---- If this is the last file: export default Feed ----
export default Feed;

