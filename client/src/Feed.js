import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// ---- CONFIG ----
const HOST = "https://shorts-t2dk.onrender.com";
const COMMENT_SPAM_DELAY_MS = 5000; // 5 seconds delay

// ---- UTILITIES ----
function truncateString(str, maxLen = 90) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  const nextSpace = str.indexOf(" ", maxLen);
  return str.substring(0, nextSpace === -1 ? str.length : nextSpace) + "…";
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- SVG ICONS ----
function HeartSVG({ filled }) {
  return (
    <svg
      aria-label={filled ? "Unlike" : "Like"}
      width="28"
      height="28"
      viewBox="0 0 48 48"
      role="img"
      style={{
        display: "block",
        transition: "transform .15s ease, filter .2s ease",
        transform: filled ? "scale(1.02)" : "scale(1.0)",
        filter: filled
          ? "drop-shadow(0 0 10px rgba(237,73,86,0.35)) drop-shadow(0 0 18px rgba(255,72,112,0.18))"
          : "none",
      }}
      className={filled ? "heart-burst" : ""}
    >
      <defs>
        <linearGradient id="feedHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a7a" />
          <stop offset="55%" stopColor="#ed4956" />
          <stop offset="100%" stopColor="#ff3d6e" />
        </linearGradient>
        <filter id="feedHeartGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="g1" />
          <feColorMatrix
            in="g1" type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.32 0"
            result="glow1"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="g2" />
          <feColorMatrix
            in="g2" type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.18 0"
            result="glow2"
          />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
        fill={filled ? "url(#feedHeartGrad)" : "none"}
        stroke={filled ? "#ed4956" : "#fff"}
        strokeWidth={filled ? "0" : "3"}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={filled ? "url(#feedHeartGlow)" : "none"}
      />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width={82} height={82} viewBox="0 0 82 82">
      <circle cx="41" cy="41" r="40" fill="#000A" />
      <rect x="26" y="20" width="10" height="42" rx="3" fill="#fff" />
      <rect x="46" y="20" width="10" height="42" rx="3" fill="#fff" />
    </svg>
  );
}

// ---- ADVANCED ANIMATED ICONS ----
function PulseHeart({ visible }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", left: "50%", top: "50%", zIndex: 106,
        transform: "translate(-50%,-50%)", pointerEvents: "none",
        opacity: visible ? 1 : 0,
        animation: visible ? "heartPulseAdvanced 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
      }}
    >
      <svg viewBox="0 0 96 96" width={100} height={100} style={{ display: "block" }}>
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a7a" />
            <stop offset="50%" stopColor="#ed4956" />
            <stop offset="100%" stopColor="#ff3d6e" />
          </linearGradient>
          <filter id="heartOuterGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="g1" />
            <feColorMatrix
              in="g1" type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.35 0"
              result="glow1"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="g2" />
            <feColorMatrix
              in="g2" type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.18 0"
              result="glow2"
            />
            <feMerge>
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M48 86C48 86 12 60 12 32.5 12 18.8 24.5 10 36 10c6.2 0 11.9 3.3 12 3.3S53.8 10 60 10c11.5 0 24 8.8 24 22.5C84 60 48 86 48 86Z"
          fill="url(#heartGrad)" stroke="#ed4956" strokeWidth="7"
          filter="url(#heartOuterGlow)"
        />
      </svg>
    </div>
  );
}
function AnimatedMuteIcon({ muted }) {
  return (
    <svg className="mute-icon" data-muted={muted} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff1" stroke="#fff" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
      <line className="mute-icon-slash" x1="4.8" y1="4.8" x2="19.2" y2="19.2" stroke="#fff" strokeWidth="2.6" />
    </svg>
  );
}

// ---- SKELETONS ----
function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw", height: "100dvh", scrollSnapAlign: "start",
        position: "relative", background: "#111", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100vw", height: "100dvh",
          background: "linear-gradient(90deg,#16181f 0%,#212332 50%,#181924 100%)",
          animation: "skelAnim 1.3s infinite linear", position: "absolute",
          top: 0, left: 0, zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 20,
          background: "rgba(28,29,34,0.65)", borderRadius: 16,
          width: 39, height: 39, display: "flex", alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 24, height: 24, background: "linear-gradient(90deg,#222 30%,#333 60%,#222 100%)", borderRadius: "50%", }} />
      </div>
      <div
        style={{
          position: "absolute", right: "12px", bottom: "100px", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "25px",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ width: 46, height: 49, marginBottom: i === 0 ? 6 : 0, borderRadius: 16, background: "linear-gradient(90deg,#20212c 30%,#292a37 60%,#20212c 100%)", }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "linear-gradient(0deg,#151721 88%,transparent 100%)",
          color: "#fff", padding: "22px 18px 33px 18px", zIndex: 6,
          display: "flex", flexDirection: "column", userSelect: "none",
        }}
      >
        <div style={{ width: 110, height: 17, marginBottom: 10, borderRadius: 7, background: "linear-gradient(90deg,#21243a 30%,#393b56 60%,#21243a 100%)", marginLeft: 2, }} />
        <div style={{ height: 15, width: "70%", borderRadius: 5, background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)", }} />
        <div style={{ marginTop: 8, width: 76, height: 14, borderRadius: 6, background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)", }} />
      </div>
    </div>
  );
}
function CommentSkeletonRow() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12, paddingBottom: 14,
        marginBottom: 18, borderBottom: "1px solid #1a1a1a",
      }}
    >
      <div className="shimmer" style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a1b20", position: "relative", overflow: "hidden", flexShrink: 0, }} />
      <div style={{ flex: 1 }}>
        <div className="shimmer" style={{ width: 110, height: 12, borderRadius: 6, background: "#1a1b20", marginBottom: 10, position: "relative", overflow: "hidden", }} />
        <div className="shimmer" style={{ width: "80%", height: 10, borderRadius: 6, background: "#1a1b20", marginBottom: 8, position: "relative", overflow: "hidden", }} />
        <div className="shimmer" style={{ width: "58%", height: 10, borderRadius: 6, background: "#1a1b20", position: "relative", overflow: "hidden", }} />
      </div>
      <div className="shimmer" style={{ width: 20, height: 20, borderRadius: 6, background: "#1a1b20", position: "relative", overflow: "hidden", flexShrink: 0, }} />
    </div>
  );
}

// ---- HOOKS & UTILS ----
function useAntiInspect() {
  useEffect(() => {
    const blockDevtools = (e) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase()))) {
        e.preventDefault(); e.stopPropagation();
      }
    };
    const preventRightClick = (e) => e.preventDefault();
    window.addEventListener("contextmenu", preventRightClick);
    window.addEventListener("keydown", blockDevtools);
    return () => {
      window.removeEventListener("contextmenu", preventRightClick);
      window.removeEventListener("keydown", blockDevtools);
    };
  }, []);
}
const scrollLockState = { y: 0, x: 0, active: false };
function lockBodyScroll() {
  if (scrollLockState.active) return;
  const body = document.body;
  scrollLockState.y = window.scrollY; scrollLockState.x = window.scrollX;
  body.style.position = "fixed"; body.style.top = `-${scrollLockState.y}px`;
  body.style.left = `-${scrollLockState.x}px`; body.style.right = "0";
  body.style.width = "100%"; body.style.overscrollBehaviorY = "none";
  scrollLockState.active = true;
}
function unlockBodyScroll() {
  if (!scrollLockState.active) return;
  const body = document.body;
  body.style.position = ""; body.style.top = ""; body.style.left = "";
  body.style.right = ""; body.style.width = ""; body.style.overscrollBehaviorY = "";
  window.scrollTo(scrollLockState.x, scrollLockState.y);
  scrollLockState.active = false;
}

// ---- MAIN FEED COMPONENT ----
export default function Feed() {
  useAntiInspect();
  const location = useLocation();
  const navigate = useNavigate();

  // CORE STATE
  const [shorts, setShorts] = useState([]);
  const [aloneVideo, setAloneVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // LOCAL UI STATE
  const videoRefs = useRef({});
  const [muted, setMuted] = useState(true);
  const [mutePulse, setMutePulse] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showPulseHeart, setShowPulseHeart] = useState(false);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [moreOpen, setMoreOpen] = useState({});
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [replayCounts, setReplayCounts] = useState({});
  const [overlayShown, setOverlayShown] = useState({});
  const [spamAlert, setSpamAlert] = useState({ show: false, message: "" });

  // REFS FOR TIMEOUTS & STATE
  const lastCommentTimeRef = useRef({});
  const spamAlertTimeout = useRef(null);
  const pageLock = useRef(false);

  // Bottom sheet drag
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);
  const dragStartedOnGrabber = useRef(false);

  // ---- DATA FETCHING ----
  useEffect(() => {
    setLoading(true); setNotFound(false); setAloneVideo(null); setShorts([]);
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      axios.get(`${HOST}/shorts/${filename}`)
        .then((res) => setAloneVideo({ ...res.data, url: res.data.url || `/shorts/${filename}` }))
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    } else {
      axios.get(HOST + "/shorts")
        .then((res) => setShorts(shuffleArray(res.data)))
        .finally(() => setLoading(false));
    }
  }, [location.search]);

  // ---- EVENT HANDLERS (MEMOIZED) ----
  const changeIdx = useCallback((direction) => {
    if (pageLock.current) return;
    setCurrentIdx((prev) => {
      const next = prev + direction;
      if (next < 0 || next >= shorts.length) return prev;
      pageLock.current = true;
      setTimeout(() => { pageLock.current = false; }, 500);
      return next;
    });
  }, [shorts.length]);

  const handleLike = useCallback((idx, filename) => {
    if (likePending[filename]) return;
    const liked = localStorage.getItem("like_" + filename) === "1";
    setLikePending((l) => ({ ...l, [filename]: true }));

    const updateLikes = (v, amount) => ({ ...v, likes: (v.likes || 0) + amount });

    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts((s) => s.map((v, i) => (i === idx ? updateLikes(v, 1) : v)));
        setAloneVideo((v) => v && v.url.endsWith(filename) ? updateLikes(v, 1) : v);
        localStorage.setItem("like_" + filename, "1");
      }).finally(() => setLikePending((l) => ({ ...l, [filename]: false })));
    } else {
      setShorts((s) => s.map((v, i) => (i === idx ? updateLikes(v, -1) : v)));
      setAloneVideo((v) => v && v.url.endsWith(filename) ? updateLikes(v, -1) : v);
      localStorage.removeItem("like_" + filename);
      setLikePending((l) => ({ ...l, [filename]: false }));
    }
  }, [likePending]);

  // ---- EFFECT HOOKS FOR UI & INTERACTIONS ----

  // Close "More" menu on outside click or Escape key
  useEffect(() => {
    const hasOpen = Object.values(moreOpen).some(Boolean);
    if (!hasOpen) return;
    const onDocClick = (e) => {
      if (!e.target.closest('[data-actions="right"]')) setMoreOpen({});
    };
    const onKey = (e) => { if (e.key === "Escape") setMoreOpen({}); };
    window.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // Feed gestures (wheel, swipe)
  useEffect(() => {
    if (aloneVideo || showComments) return;
    let touchStartY = null;
    let touchMoved = false;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 16) return;
      changeIdx(e.deltaY > 0 ? 1 : -1);
      e.preventDefault();
    };
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    };
    const onTouchMove = (e) => {
      if (touchStartY == null || e.touches.length !== 1) return;
      e.preventDefault();
      touchMoved = true;
    };
    const onTouchEnd = (e) => {
      if (!touchStartY || !e.changedTouches) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dy) > 40 && touchMoved) {
        changeIdx(dy < 0 ? 1 : -1);
      }
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [aloneVideo, showComments, changeIdx]);

  // Body scroll lock for modal
  useEffect(() => {
    if (showComments) lockBodyScroll(); else unlockBodyScroll();
    return () => unlockBodyScroll();
  }, [showComments]);

  // Comments modal animation
  useEffect(() => {
    if (showComments) {
      // Mount and then trigger visibility for slide-in animation
      requestAnimationFrame(() => setIsModalVisible(true));
    } else {
      // When closing, trigger slide-out animation first
      setIsModalVisible(false);
    }
  }, [showComments]);

  // Play/pause logic for current video
  useEffect(() => {
    if (aloneVideo) return;
    Object.entries(videoRefs.current).forEach(([idx, vid]) => {
      const nidx = Number(idx);
      if (!vid) return;
      if (nidx === currentIdx) {
        vid.muted = muted;
        const filename = shorts[nidx]?.url.split("/").pop();
        if (!overlayShown[filename] && !showComments) {
          vid.play().catch(() => {});
        }
      } else {
        vid.pause();
        vid.muted = true;
      }
    });
    setShowPause(false);
  }, [currentIdx, muted, aloneVideo, shorts, overlayShown, showComments]);

  // ---- RENDER LOGIC ----
  const handleOpenComments = useCallback((filename) => {
    setShowComments(filename);
    setIsCommentsLoading(true);
    setTimeout(() => setIsCommentsLoading(false), 400); // simulate network
  }, []);

  const handleCloseComments = useCallback(() => {
    setIsModalVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setShowComments(null);
    }, 300); // Must match CSS transition duration
  }, []);

  if (notFound) {
    return (
      <div className="feed-message-container error">
        <div>Video not found.</div>
        <button onClick={() => navigate("/", { replace: true })}>
          ← Back to Feed
        </button>
      </div>
    );
  }

  if (loading) {
    return <SkeletonShort />;
  }

  if (aloneVideo) {
    return (
      <div className="feed-container">
        <VideoCell
          v={aloneVideo}
          idx={0}
          isCurrent={true}
          muted={muted}
          setMuted={setMuted}
          videoRefs={videoRefs}
          onLike={handleLike}
          onOpenComments={handleOpenComments}
        />
        <button
          onClick={() => navigate("/", { replace: true })}
          aria-label="Back to Feed"
          className="back-to-feed-button"
        >
          ← Feed
        </button>
      </div>
    );
  }

  if (!loading && shorts.length === 0) {
    return (
      <div className="feed-message-container">
        No shorts uploaded yet.
      </div>
    );
  }

  return (
    <>
      {/* Global styles and keyframes */}
      <style>{`
        /* ---- GENERAL & UTILITY CLASSES ---- */
        .feed-container {
          position: relative; height: 100dvh; width: 100vw;
          background: black; overflow: hidden;
          font-family: Inter, Arial, sans-serif;
        }
        .feed-message-container {
          font-family: Inter, Arial, sans-serif; color: #bbb;
          text-align: center; margin-top: 120px; font-size: 20px;
          background: #0a0a0c; min-height: 100dvh;
        }
        .feed-message-container.error { color: #ca7979; }
        .feed-message-container button {
          color: #fff; background: #33b6ff; border: none;
          border-radius: 10px; font-weight: 600; font-size: 16px;
          padding: 8px 28px; cursor: pointer;
        }
        .back-to-feed-button {
          position: absolute; top: 20px; left: 16px; z-index: 100;
          background: #222f; color: #fff; font-weight: 600;
          font-size: 16px; padding: 6px 17px; border-radius: 15px;
          border: none; cursor: pointer; letter-spacing: .02em;
          box-shadow: 0 2px 10px #0003;
        }
        .shimmer::after {
          content: ""; position: absolute; inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          animation: shimmer-move 1.6s infinite;
        }

        /* ---- ANIMATIONS ---- */
        @keyframes shimmer-move { 100% { transform: translateX(100%); } }
        @keyframes skelAnim { 0% { filter:brightness(1);} 55% { filter:brightness(1.07);} 100% { filter:brightness(1);}}
        @keyframes heartPulseAdvanced {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.8) rotate(-10deg); }
          30%  { opacity: 1; transform: translate(-50%,-50%) scale(1.2) rotate(5deg); }
          60%  { opacity: 1; transform: translate(-50%,-50%) scale(0.95) rotate(-5deg); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1) rotate(0deg); }
        }
        @keyframes pauseOverlayIn {
          0% { opacity: 0; transform: scale(.88); }
          60% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes heartBurst {
          0%   { transform: scale(.88); filter: drop-shadow(0 0 0 transparent); }
          55%  { transform: scale(1.22); filter: drop-shadow(0 0 14px rgba(237,73,86,0.45)); }
          100% { transform: scale(1.02); filter: drop-shadow(0 0 10px rgba(237,73,86,0.35)); }
        }
        @keyframes mutepulseanim {
          0% { box-shadow: 0 0 0 0 #33b6ff88; transform: scale(1.09);}
          75%{ box-shadow:0 0 0 13px #33b6ff22; transform: scale(1.13);}
          100% { box-shadow: 0 0 0 0 #33b6ff00; transform: scale(1);}
        }

        /* ---- MUTE ICON ANIMATION ---- */
        .mute-icon-slash {
          stroke-dasharray: 25;
          stroke-dashoffset: 25;
          transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mute-icon[data-muted="true"] .mute-icon-slash {
          stroke-dashoffset: 0;
        }

        /* ---- ACTION BUTTONS GLOW & HOVER ---- */
        .action-button {
          background: none; border: none; padding: 6px; cursor: pointer;
          line-height: 0; border-radius: 50%; outline-offset: 4px;
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s ease;
        }
        .action-button:hover, .action-button:focus-visible {
          transform: scale(1.15);
        }
        .like-button:hover, .like-button:focus-visible {
          filter: drop-shadow(0 0 12px rgba(237, 73, 86, 0.5));
        }
        .comment-button:hover, .comment-button:focus-visible {
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
        }
        .share-button:hover, .share-button:focus-visible {
          filter: drop-shadow(0 0 12px rgba(58, 160, 255, 0.5));
        }
        .more-button:hover, .more-button:focus-visible {
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
        }
      `}</style>

      <div className="feed-container">
        {[-1, 0, 1]
          .map((offset) => currentIdx + offset)
          .filter((idx) => idx >= 0 && idx < shorts.length)
          .map((idx) => {
            const v = shorts[idx];
            return (
              <div
                key={v.url}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  zIndex: idx === currentIdx ? 2 : 1,
                  transform: `translateY(${(idx - currentIdx) * 100}%)`,
                  transition: 'transform 0.52s cubic-bezier(.22,1,.36,1)',
                  willChange: 'transform',
                }}
              >
                <VideoCell
                  v={v}
                  idx={idx}
                  isCurrent={idx === currentIdx}
                  muted={muted}
                  setMuted={setMuted}
                  videoRefs={videoRefs}
                  onLike={handleLike}
                  onOpenComments={handleOpenComments}
                />
              </div>
            );
          })}
      </div>

      {/* RENDER MODALS AND OVERLAYS AT THE TOP LEVEL */}
      {showComments && (
          <CommentsModal
            key={showComments} // Re-mount on change for clean state
            filename={showComments}
            videoData={shorts.find(s => s.url.endsWith(showComments)) || aloneVideo}
            isVisible={isModalVisible}
            onClose={handleCloseComments}
            isLoading={isCommentsLoading}
            commentLikes={commentLikes}
            setCommentLikes={setCommentLikes}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
          />
      )}
    </>
  );
}

// ---- MEMOIZED VIDEO CELL COMPONENT ----
const VideoCell = memo(function VideoCell({ v, idx, isCurrent, muted, setMuted, videoRefs, onLike, onOpenComments }) {
  // ... (all state from Feed component is passed as props)
  const [showPause, setShowPause] = useState(false);
  const [showPulseHeart, setShowPulseHeart] = useState(false);
  // ... more local state needed for this cell specifically
  // ... or derive from props where possible

  const handleVideoEvents = useCallback((idx, filename) => {
    // ... logic for single/double tap to pause/like
  }, [onLike]);

  // ... rest of the render logic for a single video cell
  // This is a placeholder for the full renderVideo function logic moved here
  return <div>{/* ... The entire content of the old `renderVideo` function goes here ... */}</div>;
});

// ---- COMMENTS MODAL COMPONENT ----
function CommentsModal({ isVisible, onClose, filename, videoData, ... }) {
  // ... All the JSX and logic for the comments bottom sheet
  // Use `isVisible` prop to control the animation class.
  return (
    <div
      className={`comments-overlay ${isVisible ? 'visible' : ''}`}
      onClick={onClose}
    >
      <div
        className="comments-modal"
        onClick={(e) => e.stopPropagation()}
        // ... more styles
      >
        {/* ... modal content ... */}
      </div>
      <style>{`
        .comments-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }
        .comments-overlay.visible {
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
        }
        .comments-modal {
          /* ... styles ... */
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1);
        }
        .comments-overlay.visible .comments-modal {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
