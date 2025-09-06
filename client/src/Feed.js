import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";



// ---- CONFIG ----
const HOST = "https://shorts-t2dk.onrender.com";
const COMMENT_SPAM_DELAY_MS = 5000; // 5 seconds delay between each comment per video

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
function getProfilePic(v) {
  return (
    v.avatar ||
    v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(
      v.author || "propscholar-user"
    )}`
  );
}
function fakeAvatar(i) {
  const urls = [
    "https://res.cloudinary.com/dzozyqlqr/image/upload/v1754503052/PropScholarUser_neup6j.png",
  ];
  return urls[i % urls.length];
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
        // Optional extra CSS glow
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
            in="g1"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.32 0
            "
            result="glow1"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="g2" />
          <feColorMatrix
            in="g2"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.18 0
            "
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
function PulseHeart({ visible }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 106,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-out",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "240px",
        height: "240px",
      }}
    >
      {/* Main Heart */}
      <div
        style={{
          position: "absolute",
          fontSize: "100px",
          zIndex: 4,
          background: "linear-gradient(135deg, #ff5252 0%, #ff6b6b 25%, #ff8e8e 50%, #ff5252 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 15px rgba(255, 80, 80, 0.5))",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0)",
          animation: visible ? "heartAppear 3.2s cubic-bezier(0.21, 0.61, 0.35, 1) forwards" : "none",
        }}
      >
        ❤️
      </div>

      {/* Child Hearts */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            fontSize: "36px",
            zIndex: 3,
            background: "linear-gradient(135deg, #ff5252 0%, #ff6b6b 25%, #ff8e8e 50%, #ff5252 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 8px rgba(255, 80, 80, 0.4))",
            opacity: 0,
            transform: "scale(0)",
            animation: visible ? `childHeartAppear 3.4s cubic-bezier(0.21, 0.61, 0.35, 1) ${i * 0.25}s forwards` : "none",
            ...(i === 1 && { "--ty": "-70px", "--tx": "-30px" }),
            ...(i === 2 && { "--ty": "-80px", "--tx": "40px" }),
            ...(i === 3 && { "--ty": "70px", "--tx": "-40px" }),
          }}
        >
          ❤️
        </div>
      ))}

      {/* Gradient Rings */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`gradient-ring ring-${i}`}
          style={{
            position: "absolute",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            opacity: 0,
            zIndex: 2,
            animation: visible ? `ringPulse 3.6s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.15}s forwards` : "none",
            ...(i === 1 && { background: "radial-gradient(circle, rgba(255, 82, 82, 0.7) 0%, rgba(255, 107, 107, 0.4) 40%, transparent 70%)" }),
            ...(i === 2 && { background: "radial-gradient(circle, rgba(255, 107, 107, 0.5) 0%, rgba(255, 142, 142, 0.3) 30%, transparent 60%)" }),
            ...(i === 3 && { background: "radial-gradient(circle, rgba(255, 142, 142, 0.4) 0%, rgba(255, 82, 82, 0.2) 20%, transparent 50%)" }),
          }}
        />
      ))}

      {/* Particles */}
      {[
        { tx: -60, ty: -50, bg: "#ff5252" },
        { tx: -70, ty: 20, bg: "#ff6b6b" },
        { tx: 50, ty: -60, bg: "#ff5252" },
        { tx: 40, ty: 60, bg: "#ff8e8e" }
      ].map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            opacity: 0,
            zIndex: 1,
            background: particle.bg,
            animation: visible ? `particleFloat 3s ease-out ${i * 0.2}s forwards` : "none",
            "--tx": `${particle.tx}px`,
            "--ty": `${particle.ty}px`,
          }}
        />
      ))}

      {/* Glow Effect */}
      <div
        className="glow-effect"
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 82, 82, 0.3) 0%, rgba(255, 107, 107, 0.2) 30%, rgba(255, 142, 142, 0.1) 60%, transparent 80%)",
          opacity: 0,
          zIndex: 0,
          filter: "blur(20px)",
          animation: visible ? "glowPulse 3.8s cubic-bezier(0.23, 1, 0.32, 1) forwards" : "none",
        }}
      />

      <style>{`
        @keyframes heartAppear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-10deg);
          }
          15% {
            opacity: 1;
            transform: scale(1.25) rotate(3deg);
          }
          25% {
            transform: scale(0.92) rotate(-1deg);
          }
          35% {
            transform: scale(1.08) rotate(1deg);
          }
          45%, 65% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          75% {
            opacity: 0.9;
            transform: scale(1);
          }
          85% {
            opacity: 0.6;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(1.4) rotate(3deg);
          }
        }
        
        @keyframes childHeartAppear {
          0% {
            opacity: 0;
            transform: scale(0) translateY(0) translateX(0);
          }
          25% {
            opacity: 0.9;
            transform: scale(1) translateY(var(--ty)) translateX(var(--tx));
          }
          65% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.4;
            transform: scale(1.1) translateY(var(--ty)) translateX(var(--tx));
          }
          100% {
            opacity: 0;
            transform: scale(1.15) translateY(var(--ty)) translateX(var(--tx));
          }
        }
        
        @keyframes ringPulse {
          0% {
            opacity: 0.7;
            transform: scale(0);
          }
          40% {
            opacity: 0.5;
          }
          70% {
            opacity: 0.3;
            transform: scale(2.2);
          }
          100% {
            opacity: 0;
            transform: scale(2.4);
          }
        }
        
        @keyframes particleFloat {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          25% {
            opacity: 0.9;
          }
          75% {
            opacity: 0.5;
            transform: translate(var(--tx), var(--ty)) scale(1.4);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(1.6);
          }
        }
        
        @keyframes glowPulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          35% {
            opacity: 0.6;
          }
          75% {
            opacity: 0.3;
            transform: scale(2.0);
          }
          100% {
            opacity: 0;
            transform: scale(2.2);
          }
        }
        
        @keyframes oscillate {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.03) rotate(0.8deg);
          }
          75% {
            transform: scale(0.98) rotate(-0.8deg);
          }
        }
      `}</style>
    </div>
  );
}

function MuteMicIcon({ muted }) {
  return muted ? (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff2" stroke="#fff" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
      <line x1="4.8" y1="4.8" x2="19.2" y2="19.2" stroke="#fff" strokeWidth="2.6" />
    </svg>
  ) : (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff1" stroke="#fff" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
    </svg>
  );
}

// ---- SKELETON SHORT ----
function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        scrollSnapAlign: "start",
        position: "relative",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          background: "linear-gradient(90deg,#16181f 0%,#212332 50%,#181924 100%)",
          animation: "skelAnim 1.3s infinite linear",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <style>{`
        @keyframes skelAnim { 0% { filter:brightness(1);} 55% { filter:brightness(1.07);} 100% { filter:brightness(1);}}
      `}</style>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 20,
          background: "rgba(28,29,34,0.65)",
          borderRadius: 16,
          width: 39,
          height: 39,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            background: "linear-gradient(90deg,#222 30%,#333 60%,#222 100%)",
            borderRadius: "50%",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: "12px",
          bottom: "100px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 46,
              height: 49,
              marginBottom: i === 0 ? 6 : 0,
              borderRadius: 16,
              background: "linear-gradient(90deg,#20212c 30%,#292a37 60%,#20212c 100%)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(0deg,#151721 88%,transparent 100%)",
          color: "#fff",
          padding: "22px 18px 33px 18px",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 110,
            height: 17,
            marginBottom: 10,
            borderRadius: 7,
            background: "linear-gradient(90deg,#21243a 30%,#393b56 60%,#21243a 100%)",
            marginLeft: 2,
          }}
        />
        <div
          style={{
            height: 15,
            width: "70%",
            borderRadius: 5,
            background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)",
          }}
        />
        <div
          style={{
            marginTop: 8,
            width: 76,
            height: 14,
            borderRadius: 6,
            background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)",
          }}
        />
      </div>
    </div>
  );
}
// COMMENT_ROW_COMPONENTS
function CommentSkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingBottom: 14,
        marginBottom: 18,
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {/* Avatar circle */}
      <div
        className="shimmer"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#1a1b20",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      />
      {/* Lines */}
      <div style={{ flex: 1 }}>
        <div
          className="shimmer"
          style={{
            width: 110,
            height: 12,
            borderRadius: 6,
            background: "#1a1b20",
            marginBottom: 10,
            position: "relative",
            overflow: "hidden",
          }}
        />
        <div
          className="shimmer"
          style={{
            width: "80%",
            height: 10,
            borderRadius: 6,
            background: "#1a1b20",
            marginBottom: 8,
            position: "relative",
            overflow: "hidden",
          }}
        />
        <div
          className="shimmer"
          style={{
            width: "58%",
            height: 10,
            borderRadius: 6,
            background: "#1a1b20",
            position: "relative",
            overflow: "hidden",
          }}
        />
      </div>
      {/* Right-side heart placeholder */}
      <div
        className="shimmer"
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          background: "#1a1b20",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
// ---- ANTI-INSPECT ----
function useAntiInspect() {
  useEffect(() => {
    const blockDevtools = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
        e.stopPropagation();
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

// ---- BODY SCROLL LOCK UTILS (iOS-safe) ----
const scrollLockState = { y: 0, x: 0, active: false };
function lockBodyScroll() {
  if (scrollLockState.active) return;
  const body = document.body;
  scrollLockState.y = window.scrollY || window.pageYOffset;
  scrollLockState.x = window.scrollX || window.pageXOffset;
  body.style.position = "fixed";
  body.style.top = `-${scrollLockState.y}px`;
  body.style.left = `-${scrollLockState.x}px`;
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overscrollBehaviorY = "none";
  scrollLockState.active = true;
}
function unlockBodyScroll() {
  if (!scrollLockState.active) return;
  const body = document.body;
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.overscrollBehaviorY = "";
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
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [commentLikes, setCommentLikes] = useState({});

  const [moreOpen, setMoreOpen] = useState({});


  // Bottom sheet drag
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);
  const dragStartedOnGrabber = useRef(false);
  
  // COMMENTS_LOADING_STATE
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  // Replay overlay
  const [replayCounts, setReplayCounts] = useState({});
  const [overlayShown, setOverlayShown] = useState({});

  // Spam protection
  const lastCommentTimeRef = useRef({});
  const [spamAlert, setSpamAlert] = useState({ show: false, message: "" });
  const spamAlertTimeout = useRef(null);

  // ---- FETCH ----
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setAloneVideo(null);
    setShorts([]);
    setReplayCounts({});
    setOverlayShown({});
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      axios
        .get(`${HOST}/shorts/${filename}`)
        .then((res) =>
          setAloneVideo({
            ...res.data,
            url: res.data.url || `/shorts/${filename}`,
          })
        )
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    } else {
      axios
        .get(HOST + "/shorts")
        .then((res) => setShorts(shuffleArray(res.data)))
        .finally(() => setLoading(false));
    }
  }, [location.search]);

  // ---- Feed paging lock ----
  const pageLock = useRef(false);
  function changeIdx(direction) {
    if (pageLock.current) return;
    let next = currentIdx + direction;
    if (next < 0 || next >= shorts.length) return;
    pageLock.current = true;
    setCurrentIdx(next);
    setTimeout(() => (pageLock.current = false), 500);
  }


    // Close the More menu when clicking anywhere outside the actions column
  useEffect(() => {
    const hasOpen = Object.values(moreOpen).some(Boolean);
    if (!hasOpen) return;
  
    function onDocClick(e) {
      // Ignore clicks within the menu popover
      if (e.target.closest('[aria-label="Navigation menu"]')) return;

      const actions = document.querySelector('[data-actions="right"]');
      if (!actions) return;
      if (!actions.contains(e.target)) setMoreOpen({});
    }
  
    window.addEventListener("click", onDocClick);
    window.addEventListener("touchstart", onDocClick, { passive: true });
  
    return () => {
      window.removeEventListener("click", onDocClick);
      window.removeEventListener("touchstart", onDocClick);
    };
  }, [moreOpen]);

  useEffect(() => {
    const openKey = Object.keys(moreOpen).find(k => moreOpen[k]);
    if (!openKey) return;
    const onKey = (e) => { if (e.key === "Escape") setMoreOpen({}); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);
  


  // ---- Wheel and swipe listeners for feed ----
  // FEED_GESTURES_GUARD
  useEffect(() => {
    if (aloneVideo) return;
    if (showComments) return; // disable feed gestures when modal is open

    let touchStartY = null;
    let touchMoved = false;

    function onWheel(e) {
      if (Math.abs(e.deltaY) < 16) return;
      if (e.deltaY > 0) changeIdx(1);
      else if (e.deltaY < 0) changeIdx(-1);
      e.preventDefault();
    }

    function onTouchStart(e) {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    }
    function onTouchMove(e) {
      if (touchStartY == null || e.touches.length !== 1) return;
      e.preventDefault();
      touchMoved = true;
    }
    function onTouchEnd(e) {
      if (!touchStartY || !e.changedTouches) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dy) > 40 && touchMoved) {
        if (dy < 0) changeIdx(1);
        if (dy > 0) changeIdx(-1);
      }
      touchStartY = null;
    }

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
  }, [currentIdx, shorts.length, aloneVideo, showComments]);

  // ---- Body scroll management ----
  // iOS-safe lock when modal open
  useEffect(() => {
    if (showComments) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [showComments]);

  // FEED_TOUCH_BLOCKER
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
      return false;
    };
    const shouldBlock = !aloneVideo && !showComments;
    if (shouldBlock) {
      document.body.style.overscrollBehaviorY = "none";
      document.body.style.touchAction = "none";
      window.addEventListener("touchmove", preventScroll, { passive: false });
    }
    return () => {
      document.body.style.overscrollBehaviorY = "";
      document.body.style.touchAction = "";
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [aloneVideo, showComments]);

  // Pause on tab hidden
  useEffect(() => {
    function visibilityHandler() {
      if (document.visibilityState !== "visible") {
        Object.values(videoRefs.current).forEach((vid) => vid && vid.pause());
      }
    }
    document.addEventListener("visibilitychange", visibilityHandler);
    return () => document.removeEventListener("visibilitychange", visibilityHandler);
  }, []);

  // Pause when comments modal opens
  useEffect(() => {
    if (!showComments) return;
    const vid = videoRefs.current[currentIdx];
    if (vid && !vid.paused) vid.pause();
  }, [showComments, currentIdx]);

  // ---- Video control: play/pause current only ----
  useEffect(() => {
    if (aloneVideo) return;
    Object.entries(videoRefs.current).forEach(([idx, vid]) => {
      const nidx = Number(idx);
      if (!vid) return;
      if (nidx === currentIdx) {
        vid.muted = muted;
        const filename = shorts[nidx] && shorts[nidx].url.split("/").pop();
        if (!overlayShown[filename] && !showComments) {
          vid.play().catch(() => {});
        }
      } else {
        vid.pause && vid.pause();
        vid.muted = true;
      }
    });
    setShowPause(false);
    setShowPulseHeart(false);
  }, [currentIdx, muted, aloneVideo, shorts, overlayShown, showComments]);

  // Cleanup spam timer
  useEffect(() => {
    return () => {
      if (spamAlertTimeout.current) {
        clearTimeout(spamAlertTimeout.current);
        spamAlertTimeout.current = null;
      }
    };
  }, []);

  // ---- LIKE / COMMENT / SHARE ----
  function isLiked(filename) {
    return localStorage.getItem("like_" + filename) === "1";
  }
  function setLiked(filename, yes) {
    if (yes) localStorage.setItem("like_" + filename, "1");
    else localStorage.removeItem("like_" + filename);
  }
  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending((l) => ({ ...l, [filename]: true }));

    if (!liked) {
      axios
        .post(`${HOST}/shorts/${filename}/like`)
        .then(() => {
          setShorts((prev) =>
            prev.map((v, i) => (i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v))
          );
          setAloneVideo((prev) =>
            prev && prev.url && prev.url.endsWith(filename)
              ? { ...prev, likes: (prev.likes || 0) + 1 }
              : prev
          );
          setLiked(filename, true);
        })
        .finally(() => {
          setLikePending((l) => ({ ...l, [filename]: false }));
        });
    } else {
      setShorts((prev) =>
        prev.map((v, i) => (i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v))
      );
      setAloneVideo((prev) =>
        prev && prev.url && prev.url.endsWith(filename) && (prev.likes || 0) > 0
          ? { ...prev, likes: prev.likes - 1 }
          : prev
      );
      setLiked(filename, false);
      setLikePending((l) => ({ ...l, [filename]: false }));
    }
  }
  function handleShare(filename) {
    const url = window.location.origin + "/?v=" + filename;
    if (navigator.share) {
      navigator.share({ url, title: "Watch this short!" });
    } else {
      navigator.clipboard.writeText(url);
      const temp = document.createElement("div");
      temp.innerText = "Link copied!";
      temp.style =
        "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222c;padding:8px 26px;border-radius:17px;color:white;font-weight:600;z-index:9999;font-size:15px;box-shadow:0 4px 16px #0004";
      document.body.appendChild(temp);
      setTimeout(() => document.body.removeChild(temp), 1200);
    }
  }
  function handleAddComment(idx, filename) {
    const text = (commentInputs[filename] || "").trim();
    if (!text) return;

    const now = Date.now();
    const lastTime = lastCommentTimeRef.current[filename] || 0;
    if (now - lastTime < COMMENT_SPAM_DELAY_MS) {
      handleSpam(
        `Please wait ${Math.ceil((COMMENT_SPAM_DELAY_MS - (now - lastTime)) / 1000)}s before commenting again.`
      );
      return;
    }

    lastCommentTimeRef.current[filename] = now;
    axios
      .post(`${HOST}/shorts/${filename}/comment`, { name: " PropScholar User", text })
      .then(() => {
        setShorts((prev) =>
          prev.map((v, i) =>
            i === idx
              ? {
                  ...v,
                  comments: [
                    ...(v.comments || []),
                    { name: "PropScholar User", text, createdAt: Date.now() },
                  ],
                }
              : v
          )
        );
        setAloneVideo((prev) =>
          prev && prev.url && prev.url.endsWith(filename)
            ? {
                ...prev,
                comments: [
                  ...(prev.comments || []),
                  { name: "PropScholar User", text, createdAt: Date.now() },
                ],
              }
            : prev
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      })
      .catch(() => {
        lastCommentTimeRef.current[filename] = 0;
      });
  }
  function handleSpam(message) {
    setSpamAlert({ show: true, message });
    if (spamAlertTimeout.current) clearTimeout(spamAlertTimeout.current);
    spamAlertTimeout.current = setTimeout(
      () => setSpamAlert({ show: false, message: "" }),
      2300
    );
  }
  const handleCaptionExpand = (filename) =>
    setExpandedCaptions((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));

  // ---- Bottom Sheet Drag (grabber only) ----
  function handleModalGrabberTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    dragStartY.current = e.touches[0].clientY;
    setIsDraggingModal(true);
    dragStartedOnGrabber.current = true;
  }
  function handleModalGrabberTouchMove(e) {
    if (!isDraggingModal || !dragStartedOnGrabber.current || !e.touches || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setModalDragY(dy);
    e.preventDefault();
    e.stopPropagation();
  }
  function handleModalGrabberTouchEnd() {
    if (!dragStartedOnGrabber.current) return;
    setIsDraggingModal(false);
    const closeThreshold = 56;
    if (modalDragY > closeThreshold) {
      setShowComments(null);
    }
    setModalDragY(0);
    dragStartedOnGrabber.current = false;
  }

  // Prevent scroll chaining on comments list edges
  function preventListEdgeScroll(e) {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const up = "deltaY" in e ? e.deltaY < 0 : false;
    const down = "deltaY" in e ? e.deltaY > 0 : false;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight;
    if ((up && atTop) || (down && atBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // ---- Video Progress ----
  function handleTimeUpdate(idx, filename) {
    const vid = videoRefs.current[idx];
    setVideoProgress((prev) => ({
      ...prev,
      [filename]:
        vid && vid.duration && isFinite(vid.duration)
          ? vid.currentTime / vid.duration
          : 0,
    }));
  }

  // ---- Replay protection ----
  function handleVideoEnded(idx, filename) {
    setReplayCounts((prev) => {
      const prevCount = prev[filename] || 0;
      if (prevCount < 2) {
        if (videoRefs.current[idx]) {
          videoRefs.current[idx].currentTime = 0;
          videoRefs.current[idx].play().catch(() => {});
        }
        return { ...prev, [filename]: prevCount + 1 };
      } else {
        setOverlayShown((prevOverlay) => ({
          ...prevOverlay,
          [filename]: true,
        }));
        if (videoRefs.current[idx]) {
          videoRefs.current[idx].pause();
        }
        return { ...prev, [filename]: prevCount + 1 };
      }
    });
  }
  function handleOverlayContinue(idx, filename) {
    setReplayCounts((prev) => ({ ...prev, [filename]: 0 }));
    setOverlayShown((prev) => ({ ...prev, [filename]: false }));
    if (videoRefs.current[idx]) {
      videoRefs.current[idx].currentTime = 0;
      videoRefs.current[idx].play().catch(() => {});
    }
  }

  // ---- Tap + Heart UI ----
  function handleVideoEvents(idx, filename) {
    let clickTimer = null;
    let lastTap = 0;
    const SINGLE_DELAY = 600;
  
    const likeThenPulse = () => {
      if (!isLiked(filename)) {
        handleLike(idx, filename);
      }
      setShowPulseHeart(true);
      requestAnimationFrame(() => {
        setTimeout(() => setShowPulseHeart(false), 700);
      });
    };
  
    return {
      onClick: (e) => {
        // Always block bubbling so nested buttons don't cause parent toggles
        e.preventDefault();
        e.stopPropagation();
    
        // If a timer already exists, do nothing (waiting to see if dblclick happens)
        if (clickTimer) return;
    
        // Schedule single click (pause/play) — will be canceled by dblclick
        clickTimer = setTimeout(() => {
          clickTimer = null;
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) {
            vid.play();
            setShowPause(false);
          } else {
            vid.pause();
            setShowPause(true);
          }
        }, SINGLE_DELAY);
      },
    
      onDoubleClick: (e) => {
        // Treat as like-only, kill pending single click
        e.preventDefault();
        e.stopPropagation();
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        likeThenPulse();
      },
    
      onTouchEnd: (e) => {
        if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
        const now = Date.now();
        const isDouble = now - lastTap < 260;
        lastTap = now;
    
        if (isDouble) {
          // Double tap: like only, never pause
          e.preventDefault();
          e.stopPropagation();
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
          }
          likeThenPulse();
          return;
        }
    
        // Single tap: schedule pause/play, cancellable if a second tap arrives
        clickTimer = setTimeout(() => {
          // Check if another tap occurred during the delay (double tap)
          if (Date.now() - lastTap < 260) {
            clickTimer = null;
            return; // Don't execute single tap action if it was actually a double tap
          }
          
          clickTimer = null;
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) {
            vid.play();
            setShowPause(false);
          } else {
            vid.pause();
            setShowPause(true);
          }
        }, SINGLE_DELAY);
      },
    };
  }
  // ---- Seek ----
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
    if (!rect.width) return;
    const x = clientX - rect.left;
    const percent = x / rect.width;
    const vid = videoRefs.current[idx];
    if (vid && vid.duration && isFinite(vid.duration)) {
      vid.currentTime = Math.max(0, Math.min(percent, 1)) * vid.duration;
    }
  }

  // ---- Paging render helper ----
  function getPagedShorts() {
    if (shorts.length === 0) return [];
    return [currentIdx - 1, currentIdx, currentIdx + 1]
      .filter((idx) => idx >= 0 && idx < shorts.length)
      .map((idx) => ({ ...shorts[idx], _idx: idx }));
  }

  // ---- Render Video Cell ----
  function renderVideo({
    v,
    idx,
    filename,
    prog,
    liked,
    isCurrent,
    allComments,
    caption,
    showFull,
    isTruncated,
    displayedCaption,
  }) {
    const isOverlayShown = overlayShown[filename];
    const mappedComments = (allComments || []).map((c, i) => ({
      ...c,
      index: i,
    }));

    return (
      <div
        key={filename}
        style={{
          width: "100vw",
          height: "100dvh",
          position: "absolute",
          left: 0,
          top: 0,
          transition: "transform 0.52s cubic-bezier(.22,1,.36,1)",
          willChange: "transform",
          background: "black",
          overflow: "hidden",
        }}
      >
        {/* Spam Alert */}
        {isCurrent && spamAlert.show && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(22,24,28,0.92)",
              color: "#fff",
              fontWeight: 500,
              padding: "10px 28px",
              borderRadius: "13px",
              fontSize: 15,
              boxShadow: "0 3px 24px #0005",
              zIndex: 5005,
              minWidth: 120,
              letterSpacing: "0.02em",
              textAlign: "center",
              backdropFilter: "blur(6px)",
            }}
          >
            {spamAlert.message || "Please wait before commenting again."}
          </div>
        )}

        <video
          ref={(el) => {
            if (el) {
              videoRefs.current[idx] = el;
            } else {
              if (videoRefs.current[idx]) delete videoRefs.current[idx];
            }
          }}
          src={HOST + v.url}
          loop={false}
          playsInline
          preload="metadata"
          style={{
            width: "100vw",
            height: "100dvh",
            objectFit: "contain",
            background: "#000",
            cursor: "pointer",
            display: "block",
          }}
          muted={muted}
          autoPlay
          onTimeUpdate={() => handleTimeUpdate(idx, filename)}
          onEnded={() => handleVideoEnded(idx, filename)}
          {...handleVideoEvents(idx, filename)}
        />

        {isOverlayShown && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1002,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                minWidth: "260px",
                minHeight: "92px",
                background: "rgba(30,30,38,0.41)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px 0 rgba(12,16,30,0.21), 0 1.5px 11px #0004",
                backdropFilter: "blur(14px) saturate(160%)",
                border: "1.6px solid rgba(80,80,86,0.16)",
                padding: "24px 26px 18px 26px",
                animation: "glassRise .36s cubic-bezier(.61,2,.22,1.02)",
              }}
            >
              <span style={{ color: "#fff", fontSize: "1.11rem", fontWeight: 600, marginBottom: "6px" }}>
                Continue watching?
              </span>
              <button
                onClick={() => handleOverlayContinue(idx, filename)}
                style={{
                  background: "rgba(0,0,0,0.30)",
                  color: "#fff",
                  fontFamily: "inherit",
                  padding: "8px 28px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: "12px",
                  border: "1.1px solid rgba(255,255,255,0.085)",
                  boxShadow: "0 1.5px 8px #0004",
                  outline: "none",
                  marginTop: "1px",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                Continue
              </button>
            </div>
            <style>{`
              @keyframes glassRise {
                from { opacity: 0; transform: translateY(60px) scale(1.07);}
                to   { opacity: 1; transform: translateY(0) scale(1);}
              }
            `}</style>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted((m) => !m);
            setMutePulse(true);
            setTimeout(() => setMutePulse(false), 350);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          tabIndex={0}
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
            transition: "box-shadow .22s ease",
            ...(mutePulse
              ? {
                  animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)",
                  boxShadow: "0 0 0 9px #33b6ff27",
                }
              : {}),
          }}
        >
          <MuteMicIcon muted={muted} />
          <style>{`
            @keyframes mutepulseanim {
              0% { box-shadow: 0 0 0 0 #33b6ff88; transform: scale(1.09);}
              75%{ box-shadow:0 0 0 13px #33b6ff22; transform: scale(1.13);}
              100% { box-shadow: 0 0 0 0 #33b6ff00; transform: scale(1);}
            }
          `}</style>
        </button>

        {isCurrent && showPause && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
          
              // Drop just beneath the pop card while it's open; otherwise keep original stack
              zIndex: Object.values(moreOpen).some(Boolean) ? 90 : 105,
          
              // Let taps reach the pop card while menu is open; otherwise remain non-interactive
              pointerEvents: Object.values(moreOpen).some(Boolean) ? "none" : "none",
          
              // Keep the original soft dark veil, and slightly soften it more when menu is open
              background: Object.values(moreOpen).some(Boolean)
                ? "rgba(0,0,0,0.22)"
                : "rgba(0,0,0,0.26)",
          
              // Preserve your original entrance animation for smoothness
              animation: "pauseOverlayIn .32s cubic-bezier(.2,.9,.25,1)",
          
              // Avoid creating a competing stacking context when the menu is open
              transform: Object.values(moreOpen).some(Boolean) ? "none" : undefined,
              filter: Object.values(moreOpen).some(Boolean) ? "none" : undefined,
              backdropFilter: Object.values(moreOpen).some(Boolean) ? "none" : undefined,
            }}
          >
            <div
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.25))",
                transform: "translateZ(0)",
              }}
            >
              <PauseIcon />
            </div>
            <style>{`
              @keyframes pauseOverlayIn {
                0% { opacity: 0; transform: scale(.88); }
                60% { opacity: 1; transform: scale(1.02); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <style>{`
              .comment-icon-wrap:hover,
              .comment-icon-wrap:focus-within {
                animation: commentPulse 1.15s ease-in-out infinite;
              }
              @keyframes commentPulse {
                0%   { transform: scale(1.00); }
                50%  { transform: scale(1.04); }
                100% { transform: scale(1.00); }
              }
            `}</style>
            
            {/* HEART_BURST_STYLE */}
            <style>{`
              .heart-burst {
                animation: heartBurst .36s cubic-bezier(.2,.9,.25,1);
              }
              @keyframes heartBurst {
                0%   { transform: scale(.88); filter: drop-shadow(0 0 0 rgba(237,73,86,0)); }
                55%  { transform: scale(1.22); filter: drop-shadow(0 0 14px rgba(237,73,86,0.45)); }
                100% { transform: scale(1.02); filter: drop-shadow(0 0 10px rgba(237,73,86,0.35)); }
              }
            `}</style>
          </div>
        )}

        {isCurrent && <PulseHeart visible={showPulseHeart} />}

        {/* Progress bar */}
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
          }}
          onClick={(e) => handleSeek(idx, e, false)}
          onTouchMove={(e) => handleSeek(idx, e, true)}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(prog * 100)}
        >
          <div
            style={{
              width: `${Math.min(Math.max(prog * 100, 0), 100)}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #6f00ff 0%, #1e00ff 35%, #006aff 65%, #00d5ff 100%)",
              boxShadow:
                "0 0 6px rgba(58,160,255,0.55), 0 0 14px rgba(107,198,255,0.35)",
              transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
          {prog > 0 && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                top: 0,
                width: 0,
                boxShadow:
                  "0 0 10px 4px rgba(107,198,255,0.45), 0 0 18px 8px rgba(58,160,255,0.25)",
                borderRadius: 2,
                pointerEvents: "none",
              }}
            />
          )}
        </div>


        {/* Right side actions */}
        <div
          data-actions="right"
          style={{
            position: "absolute",
            right: "12px",
            bottom: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 10,
          }}
        >
          <div style={{ marginBottom: 6, width: 48, height: 48, borderRadius: "50%", overflow: "hidden" }}>
            <img
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1754518014/d0d1d9_vp6st3.jpg"
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        
          {/* Like */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              aria-label={liked ? "Unlike" : "Like"}
              disabled={likePending[filename]}
              onClick={(e) => {
                e.stopPropagation();
                handleLike(idx, filename);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
                outline: 0,
                lineHeight: 0,
                borderRadius: 12,
                transition: "transform .14s ease",
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onFocus={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onBlur={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
            >
              <span className={!liked ? "liked-pulse" : ""} style={{ display: "inline-block" }}>
                <HeartSVG filled={liked} />
              </span>
            </button>
            <span style={{ color: liked ? "#ed4956" : "#fff", fontSize: "13px", marginTop: "4px" }}>
              {v.likes || 0}
            </span>
          </div>
        
          {/* Comment */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              aria-label="Comment"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(filename);
                setIsCommentsLoading(true);
                setTimeout(() => setIsCommentsLoading(false), 300);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
                lineHeight: 0,
                borderRadius: 12,
                transition: "transform .14s ease",
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onFocus={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onBlur={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
            >
              <svg
                aria-label="Comment"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                style={{
                  display: "block",
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.32)) drop-shadow(0 0 16px rgba(255,255,255,0.20))",
                  transition: "filter .18s ease, transform .14s ease",
                }}
              >
                <defs>
                  <filter id="feedCommentGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="g1" />
                    <feColorMatrix
                      in="g1"
                      type="matrix"
                      values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.32 0
                      "
                      result="glow1"
                    />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4.2" result="g2" />
                    <feColorMatrix
                      in="g2"
                      type="matrix"
                      values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.18 0
                      "
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
                  d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  filter="url(#feedCommentGlow)"
                />
              </svg>
            </button>
            <span style={{ color: "#fff", fontSize: "13px", marginTop: "4px" }}>{v.comments?.length || 0}</span>
          </div>
        
          {/* Share */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              aria-label="Share"
              onClick={() => handleShare(filename)}
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
                lineHeight: 0,
                borderRadius: 12,
                filter:
                  "drop-shadow(0 0 6px rgba(255,255,255,0.20)) drop-shadow(0 3px 10px rgba(0,0,0,0.25))",
                backgroundImage:
                  "radial-gradient(120% 120% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(240,240,245,0.10) 45%, rgba(255,255,255,0) 70%)",
                transition: "transform .14s ease, filter .18s ease, background-image .2s ease",
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
              onFocus={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onBlur={(e) => { e.currentTarget.style.transform = "scale(1.0)"; }}
            >
              <svg
                aria-label="Share Post"
                fill="#fff"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                style={{
                  display: "block",
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,0.20))",
                  transition: "filter .18s ease",
                }}
              >
                <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083" />
                <polygon
                  fill="none"
                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
            {/* label removed */}
          </div>
        
          {/* Three-dots “More” button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              aria-label="More"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(null);
                setMoreOpen((prev) => ({ ...prev, [filename]: !prev[filename] }));
              }}
              style={{
                background: "none",
                border: "none",
                padding: 6,
                cursor: "pointer",
                lineHeight: 0,
                borderRadius: 12,
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.20)) drop-shadow(0 3px 10px rgba(0,0,0,0.25))",
                backgroundImage: "radial-gradient(120% 120% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(240,240,245,0.10) 45%, rgba(255,255,255,0) 70%)",
                transition: "transform .14s ease, filter .18s ease, background-image .2s ease",
              }}
              onMouseDown={(e)=>{ e.currentTarget.style.transform="scale(0.96)"; }}
              onMouseUp={(e)=>{ e.currentTarget.style.transform="scale(1)"; }}
              onMouseLeave={(e)=>{ e.currentTarget.style.transform="scale(1)"; }}
              onFocus={(e)=>{ e.currentTarget.style.transform="translateY(-1px) scale(1.02)"; }}
              onBlur={(e)=>{ e.currentTarget.style.transform="scale(1)"; }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
                style={{ display: "block", filter: "drop-shadow(0 0 6px rgba(255,255,255,0.20))" }}
                aria-hidden="true"
              >
                <path
                  d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
                  fill="#fff"
                />
              </svg>
            </button>
          </div>
        
          {/* Floating “More” menu card */}
          {moreOpen[filename] && (
            <div
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
              style={{
                position: "fixed",             // take out of parent stacking quirks
                right: 16,
                bottom: 140,                   // align near actions; adjust if needed
                zIndex: 9999,                  // above pause overlay
                isolation: "isolate",          // new stacking context for children
                pointerEvents: "auto",
              }}
            >
              <div
                role="menu"
                aria-label="Navigation menu"
                onClick={(e) => { e.stopPropagation(); }}
                onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
                style={{
                  minWidth: 220,
                  background: "linear-gradient(180deg, rgba(20,20,24,0.92) 0%, rgba(18,18,22,0.92) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  boxShadow: "0 18px 48px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.35)",
                  backdropFilter: "blur(14px) saturate(140%)",
                  overflow: "hidden",
                  transformOrigin: "calc(100% - 12px) 100%",
                  transform: "translateY(8px) scale(0.96)",
                  opacity: 0,
                  animation: "menuIn .26s cubic-bezier(.22,1,.36,1) forwards",
                }}

              >

                <style>
                  {`
                  @keyframes menuIn {
                    0%   { opacity: 0; transform: translateY(10px) scale(.96); }
                    60%  { opacity: 1; transform: translateY(0)    scale(1.02); }
                    100% { opacity: 1; transform: translateY(0)    scale(1.00); }
                  }
                  @keyframes itemIn {
                    0% { opacity: 0; transform: translateY(6px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  .nav-item {
                    display:flex; align-items:center; gap:10px;
                    width:100%; padding:12px 14px; color:#e9ebf0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    text-decoration:none;
                    font-size:14.5px; font-weight:600; letter-spacing:.01em;
                    transition: background .18s ease, transform .1s ease, color .18s ease, border-color .2s ease;
                    opacity: 0; animation: itemIn .22s ease-out forwards;
                  }
                  .nav-item:hover, .nav-item:focus {
                    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
                    border-color: rgba(255,255,255,0.12);
                    outline: none;
                    transform: translateY(-1px);
                  }
                  .nav-item:nth-of-type(1) { animation-delay: .02s; }
                  .nav-item:nth-of-type(3) { animation-delay: .06s; }
                  .nav-item:nth-of-type(5) { animation-delay: .10s; }
                  .nav-item:nth-of-type(7) { animation-delay: .14s; }
                  .nav-sep { height:8px; }
                  @media (prefers-reduced-motion: reduce) {
                    @keyframes menuIn { 0%{opacity:0} 100%{opacity:1} }
                    @keyframes itemIn { 0%{opacity:0} 100%{opacity:1} }
                    .nav-item { transition: background .18s ease, color .18s ease, border-color .2s ease; }
                  }

                  `}
                </style>
        
                <button
                  className="nav-item"
                  role="menuitem"
                  onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation?.();
                    window.open("https://propscholar.com", "_blank", "noopener,noreferrer");
                    setMoreOpen({}); // optional: close after nav
                  }}
                >
                  <span></span> <span>Home</span>
                </button>
                
                <div className="nav-sep" />
                
                <button
                  className="nav-item"
                  role="menuitem"
                  onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation?.();
                    window.location.assign("/terms");
                    setMoreOpen({});
                  }}
                >
                  <span></span> <span>Terms & Conditions</span>
                </button>
                
                <div className="nav-sep" />
                
                <button
                  className="nav-item"
                  role="menuitem"
                  onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation?.();
                    window.location.assign("/about");
                    setMoreOpen({});
                  }}
                >
                  <span></span> <span>About</span>
                </button>
                
                <div className="nav-sep" />
                
                <button
                  className="nav-item"
                  role="menuitem"
                  onMouseDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation?.(); }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation?.();
                    window.open("https://discord.com/invite/dmh9NE63yK", "_blank", "noopener,noreferrer");
                    setMoreOpen({});
                  }}
                >
                  <span></span> <span>Discord</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom info and open comments button */}
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
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: 14.5,
              marginBottom: 4.5, // a bit more breathing room above caption
              color: "#0054ff",
            }}
          >
            {/* Circular company logo avatar */}
            <img
              src={"https://res.cloudinary.com/dzozyqlqr/image/upload/v1754518014/d0d1d9_vp6st3.jpg"}
              alt="PropScholar"
              width={27}
              height={27}
              style={{
                display: "block",
                borderRadius: "50%",              // perfect circle
                aspectRatio: "1 / 1",
                objectFit: "cover",
                // border: "1px solid rgba(255,255,255,0.35)", // subtle ring
                // slight blue glow that follows image shape
                filter: "drop-shadow(0 0 8px rgba(88,140,255,0.28)) drop-shadow(0 0 16px rgba(88,140,255,0.16))",
              }}
              loading="lazy"
              decoding="async"
            />
          
            {/* Handle with soft blue text glow */}
            <span
              style={{
                color: "#fff",
                textShadow: "0 0 10px rgba(88,140,255,0.35)", // subtle blue glow on text
              }}
            >
              @{v.author || "PropScholar"}
            </span>
          </div>

          {caption && (
            <div style={{ display: "flex", alignItems: "flex-end", minHeight: "26px", maxWidth: 500 }}>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#edf7ff",
                  lineHeight: 1.4,
                  maxHeight: showFull ? "none" : "2.8em",
                  overflow: showFull ? "visible" : "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: showFull ? "unset" : 2,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  marginRight: isTruncated ? 10 : 0,
                  whiteSpace: "pre-line",
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
                  }}
                  tabIndex={0}
                  onClick={() => handleCaptionExpand(filename)}
                >
                  {showFull ? "less" : "more"}
                </button>
              )}
            </div>
          )}

          <div style={{ marginTop: 8 }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowComments(filename); }}
              style={{
                background: "none",
                border: "none",
                color: "#475166",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                padding: 0,
                textDecoration: "none",
              }}
            >
              View all {v.comments ? v.comments.length : 0} comments
            </button>
          </div>
        </div>

        {/* Bottom Sheet Comments */}
        {showComments === filename && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overscrollBehavior: "none",
            }}
            onClick={() => setShowComments(null)}
          >
            {/* SKELETON_SHIMMER_STYLE */}
            <style>
              {`
                .shimmer::after {
                  content: "";
                  position: absolute;
                  inset: 0;
                  transform: translateX(-100%);
                  background: linear-gradient(
                    90deg,
                    rgba(255,255,255,0) 0%,
                    rgba(255,255,255,0.08) 50%,
                    rgba(255,255,255,0) 100%
                  );
                  animation: shimmer-move 1.6s infinite;
                }
                @keyframes shimmer-move {
                  100% { transform: translateX(100%); }
                }
              `}
            </style>
            <div
              className="comments-modal"
              style={{
                backgroundColor: "#0b0b0c",
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                padding: 0,
                minHeight: "40vh",
                height: "70vh",
                maxHeight: "78vh",
                display: "flex",
                flexDirection: "column",
                maxWidth: 520,
                width: "96vw",
                margin: "0 auto",
                border: "1px solid #1e1e20",
                touchAction: "none",
                transform: modalDragY ? `translateY(${Math.min(modalDragY, 160)}px)` : "translateY(0)",
                transition: isDraggingModal ? "none" : "transform 0.28s cubic-bezier(.2,.9,.25,1)",
                overscrollBehavior: "contain",
                boxShadow: "0 -10px 40px rgba(0,0,0,.35)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* SHEET_GRABBER_STYLES */}
              <div
                style={{
                  position: "relative",
                  paddingTop: 10,
                  paddingBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid #1a1a1a",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.00) 100%)",
                  touchAction: "none",
                }}
                onTouchStart={handleModalGrabberTouchStart}
                onTouchMove={handleModalGrabberTouchMove}
                onTouchEnd={handleModalGrabberTouchEnd}
              >
                <div
                  style={{
                    width: 42,
                    height: 4,
                    borderRadius: 4,
                    background: "#3a3a40",
                  }}
                />
                <button
                  onClick={() => setShowComments(null)}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 22,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Title */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: 0 }}>Comments</h2>
              </div>

              {/* SHEET_LIST_STYLES */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "12px 12px",
                  overscrollBehaviorY: "contain",
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
                onWheel={preventListEdgeScroll}
                onTouchMove={(e) => {
                  const el = e.currentTarget;
                  const { scrollTop, scrollHeight, clientHeight } = el;
                  const atTop = scrollTop <= 0;
                  const atBottom = scrollTop + clientHeight >= scrollHeight;
                  if (atTop || atBottom) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
              {isCommentsLoading ? (
                <>
                  {[...Array(6)].map((_, i) => <CommentSkeletonRow key={`sk_${i}`} />)}
                </>
              ) : mappedComments.length === 0 ? (
                <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0" }}>
                  No comments yet.
                </div>
              ) : (
                mappedComments.map((c) => {
                  const likeKey = `${filename}:${c.index}`;
                  return (
                    <div
                      className="comment"
                      key={likeKey}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        paddingBottom: 14,
                        marginBottom: 18,
                        borderBottom: "1px solid #1a1a1a",
                      }}
                    >
                      <img
                        src={fakeAvatar(c.index)}
                        className="comment-avatar"
                        alt=""
                        style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                      />
                      <div className="comment-content" style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 8,
                            wordBreak: "break-word",
                          }}
                        >
                          <span
                            className="comment-username"
                            style={{ fontWeight: 600, fontSize: 14, marginRight: 5, color: "#5768ff" }}
                          >
                            {c.name}
                          </span>
                          <span className="comment-text" style={{ fontSize: 14, color: "#d0d1d9" }}>
                            {c.text}
                          </span>
                        </div>
                      </div>
              
                      {/* Comment like button (crisp + glow) */}
                      <button
                        style={{
                          marginLeft: 8,
                          background: "none",
                          border: "none",
                          padding: 6,              // prevents glow clipping, improves tap target
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          lineHeight: 0,           // crisp render baseline
                          borderRadius: 10,        // soft hit area
                        }}
                        onClick={() =>
                          setCommentLikes((prev) => ({
                            ...prev,
                            [likeKey]: !prev[likeKey],
                          }))
                        }
                        aria-label={commentLikes[likeKey] ? "Unlike comment" : "Like comment"}
                        title={commentLikes[likeKey] ? "Unlike" : "Like"}
                      >
                        <svg
                          aria-hidden="true"
                          width="20"
                          height="20"
                          viewBox="0 0 48 48"
                          role="img"
                          style={{
                            display: "block",
                            // Optional CSS glow alternative:
                            filter: commentLikes[likeKey]
                              ? "drop-shadow(0 0 5px rgba(237,73,86,0.45))"
                              : "drop-shadow(0 0 3px rgba(255,255,255,0.18))",
                          }}
                        >
                          <defs>
                            <filter id="commentHeartGlow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="1.3" result="blur" />
                              <feColorMatrix
                                in="blur"
                                type="matrix"
                                values="
                                  1 0 0 0 0
                                  0 1 0 0 0
                                  0 0 1 0 0
                                  0 0 0 0.55 0
                                "
                                result="softGlow"
                              />
                              <feMerge>
                                <feMergeNode in="softGlow" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <path
                            d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
                            fill={commentLikes[likeKey] ? "#ed4956" : "none"}
                            stroke="#ed4956"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            filter={commentLikes[likeKey] ? "url(#commentHeartGlow)" : "none"}
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}

              </div> 
              {/* Input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderTop: "1px solid #262626",
                  background: "#0b0b0c",
                }}
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={{
                    flex: 1,
                    backgroundColor: "#1b1b1e",
                    border: "1px solid #2a2a2f",
                    borderRadius: 18,
                    padding: "10px 14px",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                  }}
                  value={commentInputs[filename] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [filename]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (commentInputs[filename] || "").trim() !== "" &&
                    handleAddComment(idx, filename)
                  }
                />
                <button
                  style={{
                    color: (commentInputs[filename] || "").trim() !== "" ? "#53a9ff" : "#8a8a8f",
                    fontWeight: 700,
                    marginLeft: 10,
                    fontSize: 14,
                    background: "none",
                    border: "none",
                    cursor: (commentInputs[filename] || "").trim() !== "" ? "pointer" : "default",
                    transition: "color .2s",
                  }}
                  disabled={(commentInputs[filename] || "").trim() === ""}
                  onClick={() => handleAddComment(idx, filename)}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Video feed UI state ----
  if (notFound) {
    return (
      <div
        style={{
          fontFamily: "Inter, Arial,sans-serif",
          color: "#ca7979",
          textAlign: "center",
          marginTop: 120,
          fontSize: 22,
          background: "#000",
          minHeight: "100dvh",
        }}
      >
        <div style={{ marginBottom: 12 }}>Video not found.</div>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            color: "#fff",
            background: "#33b6ff",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            padding: "8px 28px",
            cursor: "pointer",
          }}
        >
          ← Back to Feed
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <>
        <SkeletonShort />
      </>
    );
  }

  // ---- Single video mode ----
  if (aloneVideo) {
    const v = aloneVideo;
    const urlParts = (v.url || "").split("/");
    const filename = urlParts[urlParts.length - 1];
    const liked = isLiked(filename);
    const prog = videoProgress[filename] || 0;
    const allComments = (v.comments || []).map((c) => ({ ...c }));
    const caption = v.caption || "";
    const previewLimit = 90;
    const isTruncated = caption && caption.length > previewLimit;
    const showFull = expandedCaptions[filename];
    const displayedCaption = !caption ? "" : showFull ? caption : truncateString(caption, previewLimit);

    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          position: "relative",
          background: "black",
          overflow: "hidden",
        }}
      >
        {renderVideo({
          v,
          idx: 0,
          filename,
          prog,
          liked,
          isCurrent: true,
          allComments,
          caption,
          showFull,
          isTruncated,
          displayedCaption,
        })}
        <button
          onClick={() => navigate("/", { replace: true })}
          aria-label="Back to Feeda"
          style={{
            position: "absolute",
            top: 20,
            left: 16,
            zIndex: 100,
            background: "#222f",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            padding: "6px 17px",
            borderRadius: 15,
            border: "none",
            cursor: "pointer",
            letterSpacing: ".02em",
            boxShadow: "0 2px 10px #0003",
          }}
        >
          ← Feed
        </button>
      </div>
    );
  }

  if (!loading && shorts.length === 0) {
    return (
      <div
        style={{
          fontFamily: "Inter, Arial,sans-serif",
          color: "#bbb",
          textAlign: "center",
          marginTop: 120,
          fontSize: 20,
          background: "#0a0a0c",
          minHeight: "100dvh",
          letterSpacing: ".01em",
        }}
      >
        No shorts uploaded yet.
      </div>
    );
  }

  // ---- Strict paged feed ----
  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        width: "100vw",
        background: "black",
        borderRadius: "18px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.38)",   // depth
        outline: "1px solid rgba(255,255,255,0.06)", // faint edge
        margin: 0,
        padding: 0,
        overflow: "hidden",                           // clip children to rounded corners
        WebkitBackfaceVisibility: "hidden",           // smoother corners on Safari
        backfaceVisibility: "hidden",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {getPagedShorts().map((v) => {
        const idx = v._idx;
        const filename = v.url.split("/").pop();
        const liked = isLiked(filename);
        const prog = videoProgress[filename] || 0;
        const allComments = (v.comments || []).map((c) => ({ ...c }));
        const caption = v.caption || "";
        const previewLimit = 90;
        const isTruncated = caption && caption.length > previewLimit;
        const showFull = expandedCaptions[filename];
        const displayedCaption = !caption ? "" : showFull ? caption : truncateString(caption, previewLimit);
        const isCurrent = idx === currentIdx;
        return (
          <div
            key={filename || idx}
            style={{
              width: "100vw",
              height: "100dvh",
              position: "absolute",
              left: 0,
              top: 0,
              transition: "transform 0.52s cubic-bezier(.22,1,.36,1)",
              willChange: "transform",
              zIndex: idx === currentIdx ? 2 : 1,
              transform: `translateY(${(idx - currentIdx) * 100}%)`,
            }}
          >
            {renderVideo({
              v,
              idx,
              filename,
              prog,
              liked,
              isCurrent,
              allComments,
              caption,
              showFull,
              isTruncated,
              displayedCaption,
            })}
          </div>
        );
      })}
    </div>
  );
}
