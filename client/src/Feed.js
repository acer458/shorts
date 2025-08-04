import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// --------- CONFIG
const HOST = "https://shorts-t2dk.onrender.com";

// ----- Styles & Font Injection (once at root)
if (!window.__FEED_ROOT_STYLES__) {
  window.__FEED_ROOT_STYLES__ = true;
  // Google Inter font
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Roboto:wght@400;500;600&display=swap";
  document.head.appendChild(fontLink);

  // Inject global CSS for font & context-menu/devtools prevention
  const rootStyle = document.createElement("style");
  rootStyle.innerHTML = `
    html, body, #root, #app, #__next {
      font-family: 'Inter', 'Roboto', 'SF Pro', 'Segoe UI', Arial, sans-serif !important;
      letter-spacing: .01em;
      background: #090b10;
    }
    body {
      -webkit-user-select: none;
      user-select: none;
      overscroll-behavior: none;
      background: #090b10;
    }
    * {
      font-family: inherit !important;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(rootStyle);

  // Block context menu/inspect/devtools everywhere
  window.addEventListener("contextmenu", e => e.preventDefault(), true);
  window.addEventListener("keydown", e => {
    // Block F12, Ctrl+U, Ctrl+Shift+I/J/C, Ctrl+Alt+I/J, etc
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
      (e.metaKey && e.altKey && ["I", "J"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && ["U"].includes(e.key.toUpperCase()))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Block Cmd+Opt+I/J on Mac
    if ((e.metaKey && e.altKey && (e.key === "I" || e.key === "J"))) {
      e.preventDefault();
      return false;
    }
    // Block Ctrl+Shift+K (Webconsole in Firefox)
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") {
      e.preventDefault();
      return false;
    }
    return undefined;
  }, true);
}

// --------- UI SVGS & Utility components
function HeartSVG({ filled }) {
  return (
    <svg aria-label={filled ? "Unlike" : "Like"} height="25" width="25" viewBox="0 0 48 48">
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
// -- Continue Overlay
function ContinueOverlay({ onContinue }) {
  // Glassmorphic, uses global font
  return (
    <div className="overlay" style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99,
      pointerEvents: "auto",
      background: "rgba(0,0,0,0.0)"
    }}>
      <div className="continue-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          minWidth: 260,
          minHeight: 92,
          background: "rgba(30,30,38,0.44)",
          borderRadius: 16,
          boxShadow: "0 8px 32px 0 rgba(12,16,30,0.21), 0 1.5px 11px #0004",
          backdropFilter: "blur(14px) saturate(160%)",
          border: "1.6px solid rgba(80,80,86,0.16)",
          padding: "24px 26px 18px 26px",
          animation: "glassRise .36s cubic-bezier(.61,2,.22,1.02)",
        }}>
        <span className="continue-title"
          style={{
            color: "#fff",
            fontSize: "1.11rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            marginBottom: 6,
            fontFamily: "inherit"
          }}>
          Continue watching?
        </span>
        <button className="continue-btn"
          style={{
            background: "rgba(0,0,0, 0.30)",
            color: "#fff",
            fontFamily: "inherit",
            padding: "8px 28px",
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: 12,
            border: "1.1px solid rgba(255,255,255,0.085)",
            boxShadow: "0 1.5px 8px #0004",
            outline: "none",
            marginTop: 1,
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.18s, border 0.14s, box-shadow .16s, transform .1s",
            backdropFilter: "blur(4.5px)",
          }}
          onClick={onContinue}
        >Continue</button>
        <style>{`
          @keyframes glassRise {
          from { opacity: 0; transform: translateY(60px) scale(1.07);}
          to   { opacity: 1; transform: translateY(0) scale(1);}
        }
        .continue-btn:hover, .continue-btn:focus {
          background: rgba(40,40,48, 0.55);
          border: 1.6px solid rgba(255,255,255,0.15);
          outline: none;
          box-shadow: 0 6px 14px #0002;
          transform: scale(.98);
        }
        `}</style>
      </div>
    </div>
  );
}

// --------- CAPTION TRUNCATE
function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

// -------- SKELETON COMPONENT -----------
function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw", height: "100dvh",
        scrollSnapAlign: "start",
        position: "relative",
        background: "#14151f",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
      }}
    >
      {/* Video skeleton */}
      <div style={{
        width: "100vw",
        height: "100dvh",
        background: "linear-gradient(90deg,#16181f 0%,#212332 50%,#181924 100%)",
        animation: "skelAnim 1.3s infinite linear",
        position: "absolute",
        top: 0, left: 0,
        zIndex: 1
      }} />
      <style>
        {`
        @keyframes skelAnim { 
          0% { filter:brightness(1); }
          55% { filter: brightness(1.07); }
          100% { filter:brightness(1);}
        }
        `}
      </style>
      {/* Skeleton Mute button */}
      <div
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 20,
          background: "rgba(28,29,34,0.65)",
          borderRadius: 16, width: 39, height: 39,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <div style={{
          width: 24, height: 24,
          background: "linear-gradient(90deg,#222 30%,#333 60%,#222 100%)",
          borderRadius: "50%"
        }} />
      </div>
      {/* Side action skeletons */}
      <div
        style={{
          position: 'absolute', right: '12px', bottom: '100px', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px'
        }}
      >
        {Array.from({length:3}).map((_,i) => (
          <div key={i} style={{
            width: 46, height: 49, marginBottom: i===0?6:0,
            borderRadius: 16,
            background: "linear-gradient(90deg,#20212c 30%,#292a37 60%,#20212c 100%)"
          }} />
        ))}
      </div>
      {/* Bottom caption */}
      <div style={{
        position: "absolute",
        left: 0, right: 0, bottom: 0,
        background: "linear-gradient(0deg,#151721 88%,transparent 100%)",
        color: "#fff", padding: "22px 18px 33px 18px", zIndex: 6,
        display: "flex", flexDirection: "column", userSelect: "none"
      }}>
        <div style={{
          width: 110, height: 17, marginBottom: 10, borderRadius: 7,
          background: "linear-gradient(90deg,#21243a 30%,#393b56 60%,#21243a 100%)",
          marginLeft: 2
        }} />
        <div style={{
          height: 15, width: "70%", borderRadius: 5,
          background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)"
        }}/>
        <div style={{marginTop:8, width:76, height:14, borderRadius:6, background:"linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)"}}/>
      </div>
    </div>
  );
}

// -------- Fisher-Yates SHUFFLE ---------
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fakeAvatar(i) { const urls = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/63.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
  "https://randomuser.me/api/portraits/men/18.jpg"
]; return urls[i % urls.length]; }
function fakeTime(i) {
  return ["2h ago", "1h ago", "45m ago", "30m ago", "15m ago", "Just now"][i % 6] || "Just now";
}
function getProfilePic(v) {
  return v.avatar || v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}

// -- Utility for localStorage key (for comment like)
function commentLikeKey(fname, i) {
  return `commentlike_${fname}_${i}`;
}
function commentReplyKey(fname, i) {
  return `commentreply_${fname}_${i}`;
}

// ========== MAIN COMPONENT ==========
export default function Feed() {
  const location = useLocation();
  const navigate = useNavigate();

  // ========== FEED STATE ==========
  const [shorts, setShorts] = useState([]);
  const [aloneVideo, setAloneVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Playback/UI states
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
  // modal drag-to-close
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);

  // -------- Advanced: Continue overlay after 3 plays --------
  // Map filename -> [play count, last reset timestamp]
  const [playCounts, setPlayCounts] = useState({});
  const [blockPlayback, setBlockPlayback] = useState({}); // filename => true
  // When 'continue' button is pressed
  function handleContinue(filename) {
    setPlayCounts(pc => {
      const clone = { ...pc };
      clone[filename] = 0;
      return clone;
    });
    setBlockPlayback(bp => {
      const clone = { ...bp };
      delete clone[filename];
      return clone;
    });
    // Resume video
    let vref = null;
    if (aloneVideo && videoRefs.current[0]) vref = videoRefs.current[0];
    else if (videoRefs.current[currentIdx]) vref = videoRefs.current[currentIdx];
    if (vref) vref.play().catch(()=>{});
  }

  // -------- DATA LOADING, Feed/Single --------
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setAloneVideo(null);
    setShorts([]);

    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      axios.get(`${HOST}/shorts/${filename}`)
        .then(res => {
          setAloneVideo({ ...res.data, url: res.data.url || `/shorts/${filename}` });
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    } else {
      axios.get(HOST + "/shorts")
        .then(res => setShorts(shuffleArray(res.data)))
        .finally(() => setLoading(false));
    }
  }, [location.search]);

  // ---- Intersection observer in FEED only (pick currentIdx) ----
  useEffect(() => {
    if (aloneVideo) return;
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
  }, [shorts.length, aloneVideo]);

  // ---- Mute/play/pause logic per currentIdx/muted change ----
  useEffect(() => {
    // Don't touch in single mode
    if (aloneVideo) return;
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        if (!blockPlayback[shorts[idx]?.url?.split("/").pop()]) {
          vid.play().catch(()=>{});
        }
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPulseHeart(false);
  }, [currentIdx, muted, aloneVideo, blockPlayback, shorts]);

  // --- Track play-count (for Continue overlay) per video
  function handleTimeUpdate(idx, filename, e) {
    const vid = videoRefs.current[idx];
    // Update linear progress
    setVideoProgress((prev) => ({
      ...prev,
      [filename]: vid && vid.duration && isFinite(vid.duration)
        ? vid.currentTime / vid.duration : 0,
    }));

    // -- Count uninterrupted plays: If progress near end
    if (vid?.currentTime && vid.duration && vid.duration > 3) {
      if (vid.currentTime > vid.duration - 0.3) {
        // Only once per complete!
        let counted = playCounts[filename] || 0;
        if (!vid._lastCompleted || vid._lastCompleted !== Math.floor(Date.now()/777)) {
          let nextCount = counted+1;
          setPlayCounts(pc => ({...pc, [filename]: nextCount}));
          vid._lastCompleted = Math.floor(Date.now()/777);
          // console.log('played', filename, nextCount);
          if (nextCount >= 3) {
            setBlockPlayback(bp => ({...bp, [filename]: true}));
            setTimeout(() => {if (vid) vid.pause();}, 160);
          }
        }
      }
    }
  }

  // ========== FEED LOGIC: LIKE/SHARE/COMMENTS/REPLIES ===========
  function isLiked(filename) { return localStorage.getItem("like_" + filename) === "1"; }
  function setLiked(filename, yes) {
    if (yes) localStorage.setItem("like_" + filename, "1");
    else localStorage.removeItem("like_" + filename);
  }
  function handleLike(idx, filename, wantPulse = false) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev => prev.map((v, i) => i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v));
        setAloneVideo(prev => prev && prev.url && prev.url.endsWith(filename) ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
      if (wantPulse) {
        setShowPulseHeart(true);
        setTimeout(() => setShowPulseHeart(false), 720);
      }
    } else {
      setShorts(prev => prev.map((v, i) =>
        i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
      ));
      setAloneVideo(prev => prev && prev.url && prev.url.endsWith(filename) && (prev.likes || 0) > 0
        ? { ...prev, likes: prev.likes - 1 }
        : prev
      );
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }
  function handleShare(filename) {
    const url = window.location.origin + "/?v=" + filename;
    if (navigator.share) {
      navigator.share({ url, title: "Watch this short!" });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
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

  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({ ...prev, [filename]: !prev[filename] }));
  };

  // -------- MODAL - Drag down handlers
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
    if (modalDragY > 65) { setShowComments(null); }
    setModalDragY(0);
  }

  // ========== --- COMMENT LIKE + REPLY UI/UX LOGIC ==========

  // Comment "like" in localStorage; reply tree in per-session state/LS
  function isCommentLiked(fname, i) {
    return localStorage.getItem(commentLikeKey(fname, i)) === "1";
  }
  function toggleCommentLike(fname, i) {
    const key = commentLikeKey(fname, i);
    if (localStorage.getItem(key) === "1") localStorage.removeItem(key);
    else localStorage.setItem(key, "1");
    setShowComments(s => s ? s + "" : s); // force modal render
  }

  // Replies are pure-client-side for demo - stored in localStorage
  function getRepliesFor(fname, i) {
    try {
      const jsn = localStorage.getItem(commentReplyKey(fname, i));
      if (!jsn) return [];
      const arr = JSON.parse(jsn);
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }
  function addReply(fname, i, replyObj) {
    let arr = getRepliesFor(fname, i);
    arr = [...arr, replyObj];
    localStorage.setItem(commentReplyKey(fname, i), JSON.stringify(arr));
    setShowComments(s => s ? s + "" : s); // force modal render
  }


  // --- During comment add in modal
  function handleAddComment(idx, filename, replyTo) {
    const text = (commentInputs[filename+':'+replyTo] || commentInputs[filename] || "").trim();
    if (!text) return;
    if (replyTo !== undefined && replyTo !== null) {
      // Add as reply (persistent only in localStorage)
      addReply(filename, replyTo, { name: "You", text, time: "Just now", avatar: fakeAvatar(0) });
      setCommentInputs(prev => ({ ...prev, [filename+":"+replyTo]: "" }));
      return;
    }
    // Normal comment post
    axios.post(`${HOST}/shorts/${filename}/comment`, { name: "You", text })
      .then(() => {
        setShorts(prev =>
          prev.map((v, i) =>
            i === idx
              ? { ...v, comments: [...(v.comments || []), { name: "You", text }] }
              : v
          )
        );
        setAloneVideo(prev =>
          prev && prev.url && prev.url.endsWith(filename)
            ? { ...prev, comments: [...(prev.comments || []), { name: "You", text }] }
            : prev
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      });
  }

  // ========== --- UI RENDER HELPERS ==========

  // Get all comments + replies, as nested tree
  function renderComments({ comments, filename, idx }) {
    // Each top-level comment:
    return (comments || []).map((c, i) => {
      const liked = isCommentLiked(filename, i);
      const replies = getRepliesFor(filename, i);
      return (
        <div key={i} className="comment-item"
          style={{
            display: 'flex', alignItems: 'flex-start', marginBottom: 16,
            fontFamily: "inherit", borderRadius: 10, transition: ".15s box-shadow",
            position: "relative", paddingBottom: replies.length > 0 ? 2 : 0
          }}>
          <img
            src={c.avatar || fakeAvatar(i)}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              marginRight: 12, marginTop: 3
            }}
            alt="avatar"
          />
          <div style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{c.name}</span>
                <span style={{
                  fontSize: 14, color: "#fff", marginLeft: 7
                }}>{c.text}</span>
              </div>
              <button
                style={{
                  background: "none", border: "none", color: liked ? "#ed4956" : "#c5c7ca",
                  marginLeft: 14, display: "flex", alignItems: "center", minWidth: 42, fontWeight: 500,
                  padding: 0, cursor: "pointer", gap: 2, fontSize: "15px",
                  transition: "color .14s", borderRadius: 7,
                  outline: "none"
                }}
                aria-label="Like comment"
                tabIndex={0}
                onClick={() => toggleCommentLike(filename, i)}
                onMouseDown={e => e.preventDefault()}
                onMouseUp={e => e.preventDefault()}
              >
                <svg width={18} height={18} viewBox="0 0 48 48" style={{ marginRight: 3 }}>
                  <path
                    fill={liked ? "#ed4956" : "none"}
                    stroke={liked ? "#ed4956" : "#c5c7ca"}
                    strokeWidth="2"
                    d="M34.3 7.8c-3.1 0-5.9 1.6-7.5 4.1-1.6-2.5-4.4-4.1-7.5-4.1-5 0-9 4.2-9 9.4 0 4.3 2.7 7.6 6.5 11.1C23.2 39 24 39.7 24 39.7s.8-.7 13.1-11.4c3.8-3.5 6.5-6.8 6.5-11.1 0-5.2-4-9.4-9-9.4z"
                  />
                </svg>
                <span style={{
                  fontWeight: 600, color: liked ? "#ed4956" : "#c5c7ca", fontSize: 14
                }}>{Number(localStorage.getItem(commentLikeKey(filename, i)) === "1")}</span>
              </button>
            </div>
            {/* Time, Reply actions */}
            <div style={{ display: 'flex', fontSize: 12, color:'#a8a8a8', gap: 12, marginTop: 2 }}>
              <span>{c.time || fakeTime(i)}</span>
              <span
                style={{
                  cursor: "pointer", color:"#23aae6",
                  fontWeight: 500, marginLeft: 5,
                  borderRadius: 6, padding: "0 5px",
                  transition: "background .18s", fontSize: 12
                }}
                tabIndex={0}
                onClick={() => setActiveReply(filename, i)}
                onMouseDown={e => e.preventDefault()}
              >Reply</span>
            </div>
            {/* --- Replies underneath --- */}
            {replies.length ? (
              <div className="comment-replies" style={{
                marginLeft: 9, marginTop: 9, paddingLeft: 8, borderLeft: "1.5px solid #202636", fontSize: 14
              }}>
                {replies.map((r, j) =>
                  <div key={j} style={{marginBottom:8,display:"flex",alignItems:'flex-start',gap:8}}>
                    <img src={r.avatar || fakeAvatar(j+7)} alt="avatar" style={{width:26,height:26,borderRadius:'50%'}} />
                    <div>
                      <span style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{r.name}</span>
                      <span style={{fontSize:13, color:"#eceffa", marginLeft:5}}>{r.text}</span>
                      <div style={{fontSize:11, color:"#99a6b9",marginTop:1}}>{r.time || "just now"}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            {/* Reply input UI */}
            {showActiveReply && activeReply[0] === filename && activeReply[1] === i && (
              <div style={{marginTop:8, marginLeft:-5}}>
                <input
                  type="text"
                  placeholder="Write a reply…"
                  style={{
                    width: "86%",
                    background: "#1d2232",
                    border: "none",
                    borderRadius: 20,
                    padding: "6px 15px",
                    color: "#fff",
                    fontSize: 14,
                    marginRight: 7
                  }}
                  value={commentInputs[filename+":"+i] || ""}
                  autoFocus
                  onChange={e => setCommentInputs(prev => ({ ...prev, [filename+":"+i]: e.target.value }))}
                  onKeyDown={e =>
                    e.key === "Enter" && (commentInputs[filename+":"+i]||"").trim() !== "" && (() => {
                      addReply(filename, i, { name:"You", text: (commentInputs[filename+":"+i] || "").trim(), time:"Just now", avatar:fakeAvatar(2) });
                      setCommentInputs(prev => ({ ...prev, [filename+":"+i]: "" }));
                      setActiveReply(null, null);
                    })()
                  }
                />
                <button
                  style={{
                    color: "#4fd4ff",
                    fontWeight: 600,
                    fontSize: 14,
                    background: "none",
                    border: "none",
                    cursor: (commentInputs[filename+":"+i]||"").trim() !== "" ? "pointer" : "default",
                    opacity: (commentInputs[filename+":"+i]||"").trim() !== "" ? 1 : 0.52
                  }}
                  disabled={(commentInputs[filename+":"+i]||"").trim() === ""}
                  onClick={() => {
                    addReply(filename, i, { name:"You", text: (commentInputs[filename+":"+i]||"").trim(), time:"Just now", avatar:fakeAvatar(2) });
                    setCommentInputs(prev => ({ ...prev, [filename+":"+i]: "" }));
                    setActiveReply(null, null);
                  }}
                >Post</button>
                <button onClick={() => setActiveReply(null,null)} style={{
                  marginLeft:7, background:'none', border:'none', color:"#a2b3c3",fontSize:12,cursor:'pointer'
                }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  // For reply action per comment
  const [activeReply, setActiveReply] = useState([null,null]);
  const showActiveReply = activeReply && activeReply[0] && typeof activeReply[1] === 'number';

  // ========== RENDER LOGIC ==========

  if (notFound) {
    return (
      <div style={{
        color: "#ca7979", textAlign: "center", marginTop: 120, fontSize: 22,
        background: "#000", minHeight: "100dvh", fontFamily: "inherit"
      }}>
        <div style={{marginBottom:12}}>Video not found.</div>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            color: "#fff", background: "#33b6ff",
            border: "none", borderRadius: 10, fontWeight: 600,
            fontSize: 16, padding: "8px 28px", cursor: "pointer", fontFamily:'inherit'
          }}>
          Back to Feed
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <>
        {Array.from({ length: 2 }).map((_, idx) => <SkeletonShort key={idx} />)}
      </>
    );
  }

  // ----- SINGLE VIDEO MODE -----
  if (aloneVideo) {
    const v = aloneVideo;
    const urlParts = (v.url || "").split("/");
    const filename = urlParts[urlParts.length - 1];
    const liked = isLiked(filename);
    const prog = videoProgress[filename] || 0;
    const allComments = (v.comments || []).map((c, i) => ({
      ...c, avatar: fakeAvatar(i), time: fakeTime(i)
    }));
    const caption = v.caption || "";
    const previewLimit = 90;
    const isTruncated = caption && caption.length > previewLimit;
    const showFull = expandedCaptions[filename];
    const displayedCaption = !caption ? "" : showFull ? caption : truncateString(caption, previewLimit);

    return (
      <div style={{
        width: "100vw", height: "100dvh", background: "#101114",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", fontFamily: "inherit"
      }}>
        {/* -- BACK BUTTON -- */}
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            position: "absolute", top: 20, left: 16, zIndex: 100,
            background: "#222f", color: "#fff",
            fontWeight: 600, fontSize: 16, padding: "6px 17px",
            borderRadius: 15, border: "none", cursor: "pointer"
          }}>
          ← Feed
        </button>
        {/* -- VIDEO -- */}
        <video
          ref={el => (videoRefs.current[0] = el)}
          src={HOST + v.url}
          loop playsInline
          style={{
            width: "100vw", height: "100dvh", objectFit: "contain",
            background: "#000", cursor: "pointer", display: "block", fontFamily: "inherit"
          }}
          muted={muted}
          autoPlay
          onTimeUpdate={e => handleTimeUpdate(0, filename, e)}
          {...handleVideoEvents(0, filename)}
        />
        {/* Continue overlay (single mode) */}
        {blockPlayback[filename] && (
          <ContinueOverlay onContinue={() => handleContinue(filename)} />
        )}
        {/* ---- SIDE BAR ---- */}
        <button
          onClick={e => { e.stopPropagation(); setMuted(m => !m); setMutePulse(true); setTimeout(() => setMutePulse(false), 350); }}
          aria-label={muted ? "Unmute" : "Mute"}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 60,
            background: "rgba(28,29,34,0.65)",
            border: "none",
            borderRadius: 16,
            width: 39,
            height: 39,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px #0002",
            outline: "none",
            transition: "box-shadow .22s,ease",
            ...(mutePulse
              ? {
                  animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)",
                  boxShadow: "0 0 0 9px #33b6ff27"
                }
              : {})
          }}
        >
          <MuteMicIcon muted={muted} />
          <style>
            {`
              @keyframes mutepulseanim {
                0% { box-shadow: 0 0 0 0 #33b6ff88; transform: scale(1.09);}
                75%{ box-shadow:0 0 0 13px #33b6ff22; transform: scale(1.13);}
                100% { box-shadow: 0 0 0 0 #33b6ff00; transform: scale(1);}
              }
            `}
          </style>
        </button>
        {/* Pause Anim */}
        {showPause && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 105, background: 'rgba(0,0,0,0.26)', pointerEvents: "none",
            animation: 'fadeInPause .29s'
          }}>
            <PauseIcon />
            <style>{`@keyframes fadeInPause { from {opacity:0; transform:scale(.85);} to {opacity:1; transform:scale(1);} }`}</style>
          </div>
        )}
        <PulseHeart visible={showPulseHeart} />
        {/* Progress Bar */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: 4, background: "rgba(255,255,255,0.18)", zIndex: 32,
          borderRadius: 2, overflow: "hidden", cursor: "pointer"
        }}
          onClick={e => handleSeek(0, e, false)}
          onTouchStart={e => handleSeek(0, e, true)}>
          <div style={{
            width: `${Math.min(prog * 100, 100)}%`,
            height: "100%",
            background: "rgb(42, 131, 254)",
            transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
            pointerEvents: "none"
          }} />
        </div>
        {/* Actions side */}
        <div style={{
          position: 'absolute', right: '12px', bottom: '100px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '24px', zIndex: 10
        }}>
          <div style={{
            marginBottom: 6, width: 48, height: 48,
            borderRadius: "50%", overflow: "hidden"
          }}>
            <img src={getProfilePic(v)}
              alt="dp"
              style={{
                width: "100%", height: "100%",
                borderRadius: "50%", objectFit: "cover"
              }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={e => { e.stopPropagation(); if (!liked) handleLike(0, filename, true); else handleLike(0, filename, false); }}
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
        {/* Bottom bar */}
        <div style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
          color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6,
          display: "flex", flexDirection: "column", userSelect: "none", fontFamily: "inherit"
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
                  tabIndex={0}
                >
                  {showFull ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          {v.comments && v.comments.length > 0 && (
            <div style={{ fontSize: 14, color: "#bae6fd" }}>
              {v.comments[0].name === "You" ? (
                <>{v.comments[0].text}</>
              ) : (
                <><b>{v.comments[0].name}:</b> {v.comments[0].text}</>
              )}
            </div>
          )}
          <div
            style={{
              color: "#b2bec3", fontSize: 15, marginTop: 3, cursor: "pointer"
            }}
            onClick={() => setShowComments(filename)}
          >View all {v.comments ? v.comments.length : 0} comments</div>
        </div>
        {/* ------ Comments Modal -------- */}
        {showComments === filename &&
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background: "rgba(0,0,0,0.91)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              fontFamily: "inherit"
            }}
            onClick={() => setShowComments(null)}
          >
            <div
              className="comments-modal"
              style={{
                backgroundColor: "#111",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                padding: 15,
                minHeight: '36vh', height: '70vh',
                display: 'flex', flexDirection: 'column',
                maxWidth: 500, width: "97vw", margin: "0 auto",
                border: '1px solid #262626',
                touchAction: "none",
                transition: isDraggingModal ? "none" : "transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                transform: modalDragY? `translateY(${Math.min(modalDragY, 144)}px)`:"translateY(0)"
              }}
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 15,
                  borderBottom: '1px solid #262626'
                }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Comments</h2>
                <span
                  className="fas fa-times"
                  style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                  onClick={() => setShowComments(null)}
                >×</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', fontFamily: "inherit" }}>
                {allComments.length === 0 ? (
                  <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0", fontSize:15 }}>
                    No comments yet.</div>
                ) : renderComments({ comments: allComments, filename, idx: 0 })}
              </div>
              {/* Add Comment */}
              <div style={{
                display: 'flex', alignItems: 'center',
                paddingTop: 10, borderTop: '1px solid #262626', marginTop: 1, fontFamily: "inherit"
              }}>
                <input
                  type="text"
                  placeholder="Add a comment…"
                  style={{
                    flex: 1,
                    backgroundColor: "#23263a",
                    border: "none",
                    borderRadius: 20,
                    padding: "10px 15px",
                    color: "white",
                    fontSize: 14
                  }}
                  value={commentInputs[filename] || ""}
                  onChange={e => setCommentInputs(prev => ({
                    ...prev, [filename]: e.target.value
                  }))}
                  onKeyDown={e =>
                    e.key === "Enter" && (commentInputs[filename] || "").trim() !== "" && handleAddComment(0, filename)
                  }
                />
                <button
                  style={{
                    color: "#0095f6",
                    fontWeight: 600,
                    marginLeft: 10,
                    fontSize: 14,
                    background: "none",
                    border: "none",
                    cursor: (commentInputs[filename] || "").trim() !== "" ? "pointer" : "default",
                    opacity: (commentInputs[filename] || "").trim() !== "" ? 1 : 0.5
                  }}
                  disabled={(commentInputs[filename] || "").trim() === ""}
                  onClick={() => handleAddComment(0, filename)}
                >Post</button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  // ----- FEED MODE -----

  if (!loading && shorts.length === 0) {
    return (
      <div style={{
        color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20,
        fontFamily: "inherit"
      }}>No shorts uploaded yet.</div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh", width: "100vw", background: "#090b10",
      margin: 0, padding: 0, overflow: "hidden", fontFamily: "inherit"
    }}>
      <div style={{
        width: "100vw",
        height: "100dvh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: "#101114",
        fontFamily: "inherit"
      }}>
      {shorts.map((v, idx) => {
        const filename = v.url.split("/").pop();
        const liked = isLiked(filename);
        const prog = videoProgress[filename] || 0;
        const allComments = (v.comments || []).map((c, i) => ({
          ...c, avatar: fakeAvatar(i), time: fakeTime(i)
        }));
        const caption = v.caption || "";
        const previewLimit = 90;
        const isTruncated = caption && caption.length > previewLimit;
        const showFull = expandedCaptions[filename];
        const displayedCaption = !caption ? "" : showFull ? caption : truncateString(caption, previewLimit);
        const isCurrent = idx === currentIdx;

        return (
          <div key={idx} data-idx={idx} ref={el => (wrapperRefs.current[idx] = el)}
            style={{
              width: "100vw", height: "100dvh", scrollSnapAlign: "start",
              position: "relative", background: "#0b101d",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              fontFamily: "inherit"
            }}>
            <video ref={el => (videoRefs.current[idx] = el)}
              src={HOST + v.url}
              loop playsInline
              style={{ width: "100vw", height: "100dvh", objectFit: "contain",
                background: "#101114", cursor: "pointer", display: "block", fontFamily: "inherit"
              }}
              {...handleVideoEvents(idx, filename)}
              onTimeUpdate={e => handleTimeUpdate(idx, filename, e)}
              muted={muted}
              autoPlay
              // If over-play threshold, pause and show overlay
              onPlay={e => {
                if (blockPlayback[filename]) {
                  e.target.pause();
                }
              }}
            />
            {/* Continue overlay */}
            {blockPlayback[filename] && isCurrent && (
              <ContinueOverlay onContinue={() => handleContinue(filename)} />
            )}
            {/* Mute Button */}
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
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 60,
                  background: "rgba(28,29,34,0.65)",
                  border: "none",
                  borderRadius: 16,
                  width: 39,
                  height: 39,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px #0002",
                  outline: "none",
                  transition: "box-shadow .22s,ease",
                  ...(mutePulse
                    ? {
                        animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)",
                        boxShadow: "0 0 0 9px #33b6ff27"
                      }
                    : {})
                }}
              >
                <MuteMicIcon muted={muted} />
                <style>
                  {`
                    @keyframes mutepulseanim {
                      0% { box-shadow: 0 0 0 0 #33b6ff88; transform: scale(1.09);}
                      75%{ box-shadow:0 0 0 13px #33b6ff22; transform: scale(1.13);}
                      100% { box-shadow: 0 0 0 0 #33b6ff00; transform: scale(1);}
                    }
                  `}
                </style>
              </button>
            )}
            {/* Pause Anim */}
            {isCurrent && showPause && (
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 105, background: 'rgba(0,0,0,0.26)', pointerEvents: "none",
                animation: 'fadeInPause .29s'
              }}>
                <PauseIcon />
                <style>{`@keyframes fadeInPause { from {opacity:0; transform:scale(.85);} to {opacity:1; transform:scale(1);} }`}</style>
              </div>
            )}
            {/* Heart Pulse */}
            {isCurrent && <PulseHeart visible={showPulseHeart} />}
            {/* Progress Bar */}
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              height: 4, background: "rgba(255,255,255,0.18)", zIndex: 32,
              borderRadius: 2, overflow: "hidden", cursor: "pointer"
            }}
              onClick={e => handleSeek(idx, e, false)}
              onTouchStart={e => handleSeek(idx, e, true)}>
              <div style={{
                width: `${Math.min(prog * 100, 100)}%`,
                height: "100%",
                background: "rgb(42, 131, 254)",
                transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
                pointerEvents: "none"
              }} />
            </div>
            {/* ACTIONS */}
            <div style={{
              position: 'absolute', right: '12px', bottom: '100px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '24px', zIndex: 10
            }}>
              <div style={{
                marginBottom: 6, width: 48, height: 48,
                borderRadius: "50%", overflow: "hidden"
              }}>
                <img src={getProfilePic(v)}
                  alt="dp"
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
            {/* Caption/username/comments bar */}
            <div style={{
              position: "absolute",
              left: 0, right: 0, bottom: 0,
              background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
              color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6,
              display: "flex", flexDirection: "column", userSelect: "none", fontFamily:"inherit"
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
                      tabIndex={0}
                    >
                      {showFull ? "less" : "more"}
                    </button>
                  )}
                </div>
              )}
              {v.comments && v.comments.length > 0 && (
                <div style={{ fontSize: 14, color: "#bae6fd" }}>
                  {v.comments[0].name === "You" ? (
                    <>{v.comments[0].text}</>
                  ) : (
                    <><b>{v.comments[0].name}:</b> {v.comments[0].text}</>
                  )}
                </div>
              )}
              <div
                style={{
                  color: "#b2bec3", fontSize: 15, marginTop: 3, cursor: "pointer"
                }}
                onClick={() => setShowComments(filename)}
              >View all {v.comments ? v.comments.length : 0} comments</div>
            </div>
            {showComments === filename &&
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 500,
                  background: "rgba(0,0,0,0.91)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  fontFamily: "inherit"
                }}
                onClick={() => setShowComments(null)}
              >
                <div
                  className="comments-modal"
                  style={{
                    backgroundColor: "#111",
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    padding: 15,
                    minHeight: '36vh', height: '70vh',
                    display: 'flex', flexDirection: 'column',
                    maxWidth: 500, width: "97vw", margin: "0 auto",
                    border: '1px solid #262626',
                    touchAction: "none",
                    transition: isDraggingModal ? "none" : "transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                    transform: modalDragY? `translateY(${Math.min(modalDragY, 144)}px)`:"translateY(0)"
                  }}
                  onTouchStart={handleModalTouchStart}
                  onTouchMove={handleModalTouchMove}
                  onTouchEnd={handleModalTouchEnd}
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 15,
                      borderBottom: '1px solid #262626'
                    }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Comments</h2>
                    <span
                      className="fas fa-times"
                      style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                      onClick={() => setShowComments(null)}
                    >×</span>
                  </div>
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px 0',
                    fontFamily: "inherit"
                  }}>
                    {allComments.length === 0 ? (
                      <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0", fontSize:15 }}>No comments yet.</div>
                    ) : renderComments({ comments: allComments, filename, idx })}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    paddingTop: 10, borderTop: '1px solid #262626', marginTop:1, fontFamily:'inherit'
                  }}>
                    <input
                      type="text"
                      placeholder="Add a comment…"
                      style={{
                        flex: 1,
                        backgroundColor: "#23263a",
                        border: "none",
                        borderRadius: 20,
                        padding: "10px 15px",
                        color: "white",
                        fontSize: 14
                      }}
                      value={commentInputs[filename] || ""}
                      onChange={e => setCommentInputs(prev => ({
                        ...prev, [filename]: e.target.value
                      }))}
                      onKeyDown={e =>
                        e.key === "Enter" && (commentInputs[filename] || "").trim() !== "" && handleAddComment(idx, filename)
                      }
                    />
                    <button
                      style={{
                        color: "#0095f6",
                        fontWeight: 600,
                        marginLeft: 10,
                        fontSize: 14,
                        background: "none",
                        border: "none",
                        cursor: (commentInputs[filename] || "").trim() !== "" ? "pointer" : "default",
                        opacity: (commentInputs[filename] || "").trim() !== "" ? 1 : 0.5
                      }}
                      disabled={(commentInputs[filename] || "").trim() === ""}
                      onClick={() => handleAddComment(idx, filename)}
                    >Post</button>
                  </div>
                </div>
              </div>
            }
          </div>
        );
      })}
      </div>
    </div>
  );
}
