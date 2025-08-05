import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// ---- CONFIG ----
const HOST = "https://shorts-t2dk.onrender.com";

// --- UTILITIES ---
function timeAgo(date) {
  if (!date) return "";
  const dt = typeof date === "number" ? new Date(date) : new Date(date);
  const now = new Date();
  const diff = Math.floor((now - dt) / 1000);
  if (diff < 3) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return dt.toLocaleDateString();
}
function fontStack() {
  return "'Inter', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica', Arial, sans-serif";
}
function truncateString(str, maxLen = 90) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  const nextSpace = str.indexOf(" ", maxLen);
  return str.substring(0, nextSpace === -1 ? str.length : nextSpace) + "…";
}
function getProfilePic(v) {
  return (
    v.avatar ||
    v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(
      v.author || "anonymous"
    )}`
  );
}
function shuffleArray(arr) {
  return arr ? arr.map(a => a).sort(() => 0.5 - Math.random()) : [];
}

// --- SVG ICONS ---
function HeartSVG({ filled, size = 23, style = {} }) {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 48 48"
      style={{ ...style, display: "block" }}
    >
      <path
        fill={filled ? "#ed4956" : "none"}
        stroke={filled ? "#ed4956" : "#aaa"}
        strokeWidth="2.2"
        d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
      />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width={82} height={82} viewBox="0 0 82 82" style={{ display: "block" }}>
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
        animation: visible
          ? "heartPulseAnim .75s cubic-bezier(.1,1.6,.6,1)"
          : "none",
      }}
    >
      <svg
        viewBox="0 0 96 96"
        width={100}
        height={100}
        style={{ display: "block" }}
      >
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
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
    >
      <rect
        x="9"
        y="2"
        width="6"
        height="12"
        rx="3"
        fill="#fff2"
        stroke="#fff"
      />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
      <line
        x1="4.8"
        y1="4.8"
        x2="19.2"
        y2="19.2"
        stroke="#fff"
        strokeWidth="2.6"
      />
    </svg>
  ) : (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="9"
        y="2"
        width="6"
        height="12"
        rx="3"
        fill="#fff1"
        stroke="#fff"
      />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
    </svg>
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

export default function Feed() {
  useAntiInspect();
  const location = useLocation();
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [aloneVideo, setAloneVideo] = useState(null);
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
  const [replayCounts, setReplayCounts] = useState({});
  const [overlayShown, setOverlayShown] = useState({});
  const [commentState, setCommentState] = useState({});
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);

  // 1-at-a-time scroll handling:
  const scrollContainer = useRef();
  useEffect(() => {
    if (!shorts.length) return;
    let locked = false;
    let touchStartY = null;
    const scrollToVideo = (idx) => {
      const el = wrapperRefs.current[idx];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    function handleWheel(e) {
      if (locked) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 35) return;
      locked = true;
      let dir = e.deltaY > 0 ? 1 : -1;
      let nextIdx = Math.max(0, Math.min(shorts.length - 1, currentIdx + dir));
      setCurrentIdx(nextIdx);
      setTimeout(() => {
        scrollToVideo(nextIdx);
        setTimeout(() => (locked = false), 440);
      }, 1);
    }
    function handleTouchStart(e) {
      if (locked) return;
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
    }
    function handleTouchEnd(e) {
      if (locked || touchStartY === null) return;
      let dy =
        (e.changedTouches[0]?.clientY ?? e.touches[0]?.clientY ?? 0) -
        touchStartY;
      if (Math.abs(dy) < 44) return;
      locked = true;
      let dir = dy < 0 ? 1 : -1;
      let nextIdx = Math.max(0, Math.min(shorts.length - 1, currentIdx + dir));
      setCurrentIdx(nextIdx);
      setTimeout(() => {
        scrollToVideo(nextIdx);
        setTimeout(() => (locked = false), 440);
      }, 1);
      touchStartY = null;
    }
    const node = scrollContainer.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: false });
      node.addEventListener("touchstart", handleTouchStart, { passive: false });
      node.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
    return () => {
      if (node) {
        node.removeEventListener("wheel", handleWheel);
        node.removeEventListener("touchstart", handleTouchStart);
        node.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [shorts, currentIdx]);

  // Data loading
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setAloneVideo(null);
    setShorts([]);
    setReplayCounts({});
    setOverlayShown({});
    setCommentState({});
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      axios
        .get(`${HOST}/shorts/${filename}`)
        .then((res) =>
          setAloneVideo({
            ...res.data,
            url: res.data.url || `/shorts/${filename}`,
            comments: Array.isArray(res.data.comments) ? res.data.comments : []
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

  // Intersection observer (progress bar, NOT snap jump)
  useEffect(() => {
    if (aloneVideo) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleIdx = Number(entry.target.dataset.idx);
          }
        });
        if (maxRatio > 0.5) {
          setCurrentIdx(visibleIdx);
        }
      },
      { threshold: [0, 0.5, 0.7, 1] }
    );
    wrapperRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length, aloneVideo]);

  useEffect(() => {
    videoRefs.current = Array(shorts.length);
    wrapperRefs.current = Array(shorts.length);
  }, [shorts.length]);

  useEffect(() => {
    if (aloneVideo) return;
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        const filename = shorts[idx]?.url.split("/").pop() || "";
        if (!overlayShown[filename]) vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.muted = true;
      }
    });
    setShowPause(false);
    setShowPulseHeart(false);
  }, [currentIdx, muted, aloneVideo, shorts, overlayShown]);

  useEffect(() => {
    function visibilityHandler() {
      if (document.visibilityState !== "visible") {
        videoRefs.current.forEach((vid) => vid && vid.pause());
      }
    }
    document.addEventListener("visibilitychange", visibilityHandler);
    return () =>
      document.removeEventListener("visibilitychange", visibilityHandler);
  }, []);

  // --- Core action logic (likes, comments, etc) remains as in earlier answer

  // --- renderVideo (full UI, line by line) ---
  function buildCommentTree(comments) {
    if (!comments) return [];
    // Deduplicate by id
    const idMap = {};
    comments.forEach(c => { if (c && c.id) idMap[c.id] = c; });
    // Deduped and sorted oldest-first
    const dedup = Object.values(idMap).sort((a, b) => (a.created || 0) - (b.created || 0));
    const outMap = {}, roots = [];
    dedup.forEach(c => outMap[c.id] = { ...c, replies: [] });
    dedup.forEach(c => {
      if (c.parent && outMap[c.parent]) outMap[c.parent].replies.push(outMap[c.id]);
      else roots.push(outMap[c.id]);
    });
    return roots;
  }
  // Handle actions for comments--- (use code from previous answers.)

  // The video card UI, written out fully line-by-line:
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
    inFeed,
  }) {
    const isOverlayShown = overlayShown[filename];
    return (
      <div
        key={filename}
        data-idx={idx}
        ref={el => inFeed && (wrapperRefs.current[idx] = el)}
        style={{
          width: "100vw",
          height: "100dvh",
          scrollSnapAlign: "start",
          position: "relative",
          overflow: "hidden",
          fontFamily: fontStack(),
          fontWeight: 400
        }}
      >
        {/* ---------- VIDEO ---------- */}
        <video
          ref={el => (videoRefs.current[idx] = el)}
          src={HOST + v.url}
          loop={false}
          playsInline
          style={{
            width: "100vw",
            height: "100dvh",
            objectFit: "contain",
            background: "#010011",
            cursor: "pointer",
            display: "block"
          }}
          muted={muted}
          autoPlay
          onTimeUpdate={() => handleTimeUpdate(idx, filename)}
          onEnded={() => handleVideoEnded(idx, filename)}
          {...(function(){
            let tapTimeout;
            return {
              onClick() {
                if (tapTimeout) clearTimeout(tapTimeout);
                tapTimeout = setTimeout(() => {
                  const vid = videoRefs.current[idx];
                  if (!vid) return;
                  if (vid.paused) {
                    vid.play();
                    setShowPause(false);
                  } else {
                    vid.pause();
                    setShowPause(true);
                  }
                }, 240);
              },
              onDoubleClick() {
                if (tapTimeout) {
                  clearTimeout(tapTimeout);
                  tapTimeout = null;
                }
                if (!isLiked(filename)) handleLike(idx, filename, true);
                setShowPulseHeart(true);
                setTimeout(() => setShowPulseHeart(false), 700);
              },
              onTouchEnd(e) {
                if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
                if (tapTimeout) {
                  clearTimeout(tapTimeout);
                  tapTimeout = null;
                  if (!isLiked(filename)) handleLike(idx, filename, true);
                  setShowPulseHeart(true);
                  setTimeout(() => setShowPulseHeart(false), 700);
                } else {
                  tapTimeout = setTimeout(() => {
                    const vid = videoRefs.current[idx];
                    if (vid) {
                      if (vid.paused) {
                        vid.play();
                        setShowPause(false);
                      } else {
                        vid.pause();
                        setShowPause(true);
                      }
                    }
                    tapTimeout = null;
                  }, 250);
                }
              }
            };
          })()}
        />
        {/* Overlay for replay protection */}
        {isOverlayShown && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1002,
          }}>
            <div style={{
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
            }}>
              <span style={{
                color: "#fff",
                fontSize: "1.11rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                marginBottom: "6px",
                fontFamily: "inherit"
              }}>
                Continue watching?
              </span>
              <button onClick={() => handleOverlayContinue(idx, filename)} style={{
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
                letterSpacing: "0.01em"
              }}>
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
        {/* ---------- Mute/Unmute Button ---------- */}
        {(inFeed ? isCurrent : true) && (
          <button
            onClick={e => { e.stopPropagation(); setMuted(m => !m); setMutePulse(true); setTimeout(() => setMutePulse(false), 350); }}
            aria-label={muted ? "Unmute" : "Mute"}
            tabIndex={0}
            style={{
              position: "absolute",
              top: 20,
              right: 22,
              zIndex: 60,
              background: "#282941dc",
              border: "none",
              borderRadius: 16,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px #0002",
              outline: "none",
              transition: "box-shadow .22s,ease",
              ...(mutePulse
                ? { animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)", boxShadow: "0 0 0 9px #33b6ff27" }
                : {}),
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
        {/* ---------- Pause Overlay ---------- */}
        {(inFeed ? isCurrent : true) && showPause && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 105, background: 'rgba(0,0,0,0.27)', pointerEvents: "none",
            animation: 'fadeInPause .29s'
          }}>
            <PauseIcon />
            <style>{`@keyframes fadeInPause { from {opacity:0; transform:scale(.85);} to {opacity:1; transform:scale(1);} }`}</style>
          </div>
        )}
        {/* ---------- Heart Pulse ---------- */}
        {(inFeed ? isCurrent : true) && <PulseHeart visible={showPulseHeart} />}
        {/* ---------- Progress Bar ---------- */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          background: "rgba(255,255,255,0.10)",
          zIndex: 32,
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          marginBottom: 1,
        }}
          onClick={e => {
            let clientX = e.clientX;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (clientX - rect.left) / rect.width;
            const vid = videoRefs.current[idx];
            if (vid && vid.duration && isFinite(vid.duration)) {
              vid.currentTime = Math.max(0, Math.min(percent, 1)) * vid.duration;
            }
          }}
          onTouchStart={e => {
            if (!e.touches || e.touches.length !== 1) return;
            let clientX = e.touches[0].clientX;
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (clientX - rect.left) / rect.width;
            const vid = videoRefs.current[idx];
            if (vid && vid.duration && isFinite(vid.duration)) {
              vid.currentTime = Math.max(0, Math.min(percent, 1)) * vid.duration;
            }
          }}
          role="progressbar"
          aria-valuenow={Math.round(prog * 100)}
        >
          <div style={{
            width: `${Math.min(prog * 100, 100)}%`,
            height: "100%",
            background: "linear-gradient(90deg,#318cfb,#56bee7 94%)",
            transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
            pointerEvents: "none",
          }} />
        </div>
        {/* ---------- Right Actions Stack ---------- */}
        <div style={{
          position: 'absolute',
          right: '16px',
          bottom: '110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '26px',
          zIndex: 11,
        }}>
          <div style={{
            marginBottom: 7,
            width: 48,
            height: 48,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #232b3b",
            boxShadow: "0 1px 12px #09111f44"
          }}>
            <img src={getProfilePic(v)}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                background: "#e7e7ef11"
              }} />
          </div>
          {/* Like */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button
              aria-label={liked ? "Unlike" : "Like"}
              disabled={likePending[filename]}
              onClick={e => { e.stopPropagation(); handleLike(idx, filename, !liked); }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                outline: 0,
                display: "flex"
              }}
            >
              <HeartSVG filled={liked} size={27} />
            </button>
            <span style={{
              color: liked ? '#ed4956' : '#FFF',
              fontSize: '13.3px',
              marginTop: '5px',
              fontWeight: 500,
              letterSpacing: ".005em"
            }}>{v.likes || 0}</span>
          </div>
          {/* Comment */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button
              aria-label="Comment"
              onClick={e => { e.stopPropagation(); setShowComments(filename); }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <svg aria-label="Comment" fill="#e0eafd" height="24" viewBox="0 0 24 24" width="24">
                <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#aab5da" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
          {/* Share */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button
              aria-label="Share"
              onClick={() => handleShare(filename)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}>
              <svg aria-label="Share Post" fill="#e6f3fd" height="24" viewBox="0 0 24 24" width="24">
                <line fill="none" stroke="#b2cdf7" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083" />
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#b2cdf7" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
        {/* ---------- Caption ---------- */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(0deg,#080813 88%,transparent 100%)",
            color: "#f0f2fa",
            padding: "22px 20px 27px 23px",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            userSelect: "none",
            fontFamily: fontStack(),
          }}>
          <div style={{
            fontWeight: 600,
            fontSize: 15.7,
            marginBottom: 3,
            color: "#edf0ff"
          }}>
            @{v.author || "anonymous"}
          </div>
          {caption && (
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              minHeight: "25px",
              maxWidth: 512
            }}>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 16.7,
                  color: "#e3eaf5",
                  lineHeight: 1.45,
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
                    color: "#00bafe",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    marginLeft: 2,
                    padding: 0,
                    lineHeight: 1.3,
                    textDecoration: "underline",
                    transition: "color .15s"
                  }}
                  tabIndex={0}
                  onClick={() => setExpandedCaptions((prev) => ({
                    ...prev,
                    [filename]: !prev[filename],
                  }))}
                >
                  {showFull ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          <div
            style={{
              color: "#ccd4ed",
              fontSize: 15,
              marginTop: 4,
              cursor: "pointer",
              fontWeight: 500,
              letterSpacing: ".01em"
            }}
            onClick={() => setShowComments(filename)}
          >
            View all {v.comments ? v.comments.length : 0} comments
          </div>
        </div>
        {/* ---------- COMMENTS MODAL ---------- */}
        {showComments === filename && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background: "rgba(8,10,16,.86)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              fontFamily: fontStack()
            }}
            onClick={() => setShowComments(null)}
          >
            <div
              className="comments-modal"
              style={{
                backgroundColor: "#101021",
                borderTopLeftRadius: 17,
                borderTopRightRadius: 17,
                padding: 15,
                minHeight: '42vh',
                maxHeight: "83vh",
                height: "auto",
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 540,
                width: "97vw",
                margin: "0 auto",
                border: '1.6px solid #212f37',
                boxShadow: "0 0px 28px #09143841",
                touchAction: "none",
                transition: isDraggingModal ? "none" : "transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                transform: modalDragY
                  ? `translateY(${Math.min(modalDragY, 144)}px)`
                  : "translateY(0)"
              }}
              onTouchStart={e => { if (!e.touches || e.touches.length !== 1) return; dragStartY.current = e.touches[0].clientY; setIsDraggingModal(true); }}
              onTouchMove={e => { if (!isDraggingModal || !e.touches || e.touches.length !== 1) return; const dy = e.touches[0].clientY - dragStartY.current; if (dy > 0) setModalDragY(dy); }}
              onTouchEnd={() => { setIsDraggingModal(false); if (modalDragY > 65) setShowComments(null); setModalDragY(0); }}
              onClick={e => e.stopPropagation()}
            >
              {/* ---- Header ---- */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 15,
                  borderBottom: '1.2px solid #242e38'
                }}>
                <h2 style={{
                  fontSize: 16.5,
                  fontWeight: 700,
                  color: "#e0e5f2",
                  letterSpacing: ".01em"
                }}>Comments</h2>
                <span
                  style={{ fontSize: 27, color: "#c8cfd5", cursor: "pointer", fontWeight: 400 }}
                  onClick={() => setShowComments(null)}
                  tabIndex={0}
                >×</span>
              </div>
              {/* ---- Comments Tree ---- */}
              <div style={{ flex: 1, minHeight: 120, overflowY: "auto", padding: "17px 1px 7px 2px" }}>
                {(v.comments && v.comments.length > 0) ? (
                  buildCommentTree(v.comments).map((c) => (
                    <div key={c.id} style={{ marginBottom: 12, paddingLeft: c.parent ? 15 : 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 7,
                        marginBottom: c.replies.length ? 2 : 0
                      }}>
                        <img src={getProfilePic({ author: c.name })}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 16,
                            objectFit: "cover",
                            marginTop: 2
                          }}
                          alt=""
                        />
                        <div style={{ flex: 1 }}>
                          <div>
                            <span style={{
                              fontWeight: 600,
                              fontSize: 14.7,
                              marginRight: 7,
                              color: "#f0f3fa",
                              letterSpacing: ".01em"
                            }}>{c.name}</span>
                            <span style={{
                              fontSize: 14.4,
                              color: "#e2eff8",
                              fontWeight: 400
                            }}>{c.text}</span>
                          </div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 5,
                            gap: 14
                          }}>
                            <span style={{
                              fontSize: 12.9,
                              color: "#81a5bb",
                              fontWeight: 400
                            }}>{timeAgo(c.created)}</span>
                            <button onClick={() => handleCommentLike(filename, c.id)}
                              style={{
                                border: "none",
                                background: "none",
                                marginRight: 0,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                padding: "0 2px"
                              }}>
                              <HeartSVG
                                filled={commentState[filename]?.["liked_" + c.id] || c.liked}
                                size={18}
                                style={{ verticalAlign: "middle" }}
                              />
                              <span style={{
                                fontSize: 12.6,
                                fontWeight: 500,
                                color: commentState[filename]?.["liked_" + c.id] || c.liked ? "#ee7b7c" : "#b5bbca"
                              }}>
                                {(c.likes || 0) + (commentState[filename]?.["liked_" + c.id] ? 1 : 0)}
                              </span>
                            </button>
                            <button
                              onClick={() => handleCommentReply(filename, c.id)}
                              style={{
                                border: "none",
                                background: "none",
                                color: "#39b6ff",
                                cursor: "pointer",
                                fontWeight: 500,
                                fontSize: 13,
                                padding: "1px 10px 0 5px",
                              }}>
                              Reply
                            </button>
                          </div>
                          {/* Reply box */}
                          {commentState[filename]?.replyTo === c.id && (
                            <div style={{ marginTop: 7, display: "flex", gap: 7, alignItems: "center" }}>
                              <input
                                type="text"
                                autoFocus
                                placeholder="Reply..."
                                style={{
                                  flex: 1,
                                  backgroundColor: "#212b32",
                                  border: "none",
                                  borderRadius: 17,
                                  padding: "8px 13px",
                                  color: "#f7fafc",
                                  fontSize: 14.8,
                                }}
                                value={commentState[filename]?.replyInput || ""}
                                onChange={e =>
                                  handleCommentInput(filename, e.target.value)
                                }
                                onKeyDown={e =>
                                  e.key === "Enter" &&
                                  (commentState[filename]?.replyInput || "")
                                    .trim() !== "" &&
                                  handleCommentReplySubmit(idx, filename, c.id)
                                }
                              />
                              <button
                                onClick={() =>
                                  handleCommentReplySubmit(idx, filename, c.id)
                                }
                                style={{
                                  fontFamily: fontStack(),
                                  color: "#2ea5fd",
                                  fontWeight: 600,
                                  fontSize: 14.3,
                                  border: "none",
                                  background: "none",
                                  cursor:
                                    (commentState[filename]?.replyInput || "")
                                      .trim() !== ""
                                      ? "pointer"
                                      : "default",
                                  opacity:
                                    (commentState[filename]?.replyInput || "")
                                      .trim() !== ""
                                      ? 1
                                      : 0.54,
                                }}
                                disabled={
                                  (commentState[filename]?.replyInput || "")
                                    .trim() === ""
                                }
                              >
                                Post
                              </button>
                              <button
                                onClick={() => handleCancelReply(filename)}
                                style={{
                                  fontSize: 15,
                                  color: "#d1d6e9",
                                  fontWeight: 500,
                                  border: "none",
                                  background: "none",
                                  marginLeft: 4,
                                  cursor: "pointer"
                                }}
                              >×</button>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Replies */}
                      {!!c.replies.length && (
                        <div style={{ marginLeft: 34, marginTop: 2 }}>
                          {c.replies.map(reply => (
                            <div key={reply.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 6 }}>
                              <img src={getProfilePic({ author: reply.name })}
                                style={{
                                  width: 25,
                                  height: 25,
                                  borderRadius: 16,
                                  objectFit: "cover",
                                  marginTop: 1
                                }}
                                alt=""
                              />
                              <div>
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: 13.5, color: "#f0f6fa" }}>{reply.name}</span>
                                  <span style={{ fontSize: 14.2, color: "#ddebf9", fontWeight: 400 }}> {reply.text}</span>
                                </div>
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: 3,
                                  gap: 10
                                }}>
                                  <span style={{ fontSize: 12, color: "#7fa4ba" }}>{timeAgo(reply.created)}</span>
                                  <button onClick={() => handleCommentLike(filename, reply.id)}
                                    style={{
                                      border: "none",
                                      background: "none",
                                      marginRight: 0,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 3,
                                      padding: "0 2px"
                                    }}>
                                    <HeartSVG
                                      filled={commentState[filename]?.["liked_" + reply.id] || reply.liked}
                                      size={16}
                                      style={{ verticalAlign: "middle" }}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{
                    color: "#cad1e4",
                    textAlign: "center",
                    padding: "33px 0",
                    fontSize: 15.5
                  }}>
                    No comments yet.
                  </div>
                )}
              </div>
              {/* ---- Add main comment ---- */}
              <div style={{
                display: "flex",
                alignItems: "center",
                borderTop: "1.5px solid #212b39",
                padding: "11px 3px 4px 1px",
                gap: 7,
                background: "#15172b"
              }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={{
                    flex: 1,
                    backgroundColor: "#212b32",
                    border: "none",
                    borderRadius: 17,
                    padding: "8px 14px",
                    color: "#f7fafc",
                    fontSize: 14.8,
                  }}
                  value={commentInputs[filename] || ""}
                  onChange={e => setCommentInputs(prev => ({ ...prev, [filename]: e.target.value }))}
                  onKeyDown={e =>
                    e.key === "Enter" &&
                    (commentInputs[filename] || "").trim() !== "" &&
                    handleAddComment(idx, filename)
                  }
                />
                <button
                  style={{
                    fontFamily: fontStack(),
                    color: "#10a9ff",
                    fontWeight: 700,
                    marginLeft: 7,
                    fontSize: 14.3,
                    border: "none",
                    background: "none",
                    cursor: (commentInputs[filename] || "").trim() !== "" ? "pointer" : "default",
                    opacity: (commentInputs[filename] || "").trim() !== "" ? 1 : 0.54,
                    padding: "1.7px 0"
                  }}
                  disabled={(commentInputs[filename] || "").trim() === ""}
                  onClick={() => handleAddComment(idx, filename)}
                >Post</button>
              </div>
            </div>
          </div>
        )}
        {/* ---------- Back button for single view ---------- */}
        {!inFeed && (
          <button
            onClick={() => navigate("/", { replace: true })}
            aria-label="Back to Feed"
            style={{
              position: "absolute",
              top: 17,
              left: 18,
              zIndex: 140,
              background: "#252641e8",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              padding: "7px 21px",
              borderRadius: 16,
              border: "none",
              boxShadow: "0 2px 10px #0002",
              cursor: "pointer",
              letterSpacing: ".02em"
            }}>
            ← Feed
          </button>
        )}
      </div>
    );
  }

  // -------- RENDER FEED --------
  if (loading) {
    return <div style={{ color: "#ddd", fontFamily: fontStack(), textAlign: "center", marginTop: 160 }}>Loading…</div>;
  }
  if (notFound) {
    return (
      <div
        style={{
          fontFamily: fontStack(),
          color: "#e47070",
          textAlign: "center",
          marginTop: 130,
          fontSize: 22,
          background: "#101019",
          minHeight: "100dvh",
          letterSpacing: ".002em"
        }}>
        <div style={{ marginBottom: 17 }}>Video not found.</div>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            color: "#fff",
            background: "#299ffe",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 17,
            padding: "10px 34px",
            cursor: "pointer",
            letterSpacing: ".01em"
          }}>
          Back to Feed
        </button>
      </div>
    );
  }
  if (aloneVideo) {
    const v = aloneVideo;
    const filename = (v.url || "").split("/").pop();
    const liked = isLiked(filename);
    const prog = videoProgress[filename] || 0;
    const allComments = v.comments || [];
    const caption = v.caption || "";
    const previewLimit = 90;
    const isTruncated = caption && caption.length > previewLimit;
    const showFull = expandedCaptions[filename];
    const displayedCaption = !caption
      ? ""
      : showFull
      ? caption
      : truncateString(caption, previewLimit);

    return renderVideo({
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
      inFeed: false,
    });
  }
  if (!shorts.length) {
    return (
      <div
        style={{
          fontFamily: fontStack(),
          color: "#b6bbd2",
          textAlign: "center",
          marginTop: 150,
          fontSize: 20.5,
          background: "#181829",
          minHeight: "100dvh",
          letterSpacing: ".01em"
        }}>
        No shorts uploaded yet.
      </div>
    );
  }
  // -------- NORMAL FEED (full) --------
  return (
    <div style={{
      minHeight: "100dvh",
      width: "100vw",
      background: "#101018",
      fontFamily: fontStack()
    }}>
      <div
        ref={scrollContainer}
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          background: "#101018"
        }}>
        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop();
          const liked = isLiked(filename);
          const prog = videoProgress[filename] || 0;
          const allComments = v.comments || [];
          const caption = v.caption || "";
          const previewLimit = 90;
          const isTruncated = caption && caption.length > previewLimit;
          const showFull = expandedCaptions[filename];
          const displayedCaption = !caption
            ? ""
            : showFull
            ? caption
            : truncateString(caption, previewLimit);
          const isCurrent = idx === currentIdx;
          return renderVideo({
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
            inFeed: true,
          });
        })}
      </div>
    </div>
  );
}
