import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Google Fonts injection for modern look
const FONT_LINK_ID = 'app-google-fonts';
if (!document.getElementById(FONT_LINK_ID)) {
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

const HOST = "https://shorts-t2dk.onrender.com";
const MAX_AUTOPLAY = 2; // Number of times a video will auto-replay

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
function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

// ---- BIG FONT STYLE used everywhere ----
const fontStyle = {
  fontFamily: '"Inter",system-ui,sans-serif',
  letterSpacing: '-0.02em',
  WebkitFontSmoothing: "antialiased"
};

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);
  const wrapperRefs = useRef([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  // Animations
  const [showPause, setShowPause] = useState(false);
  const [showPulseHeart, setShowPulseHeart] = useState(false);
  // Caption expand/collapse
  const [expandedCaptions, setExpandedCaptions] = useState({});
  // Track how many times each video has repeated
  const replayCounts = useRef({});
  // Track if 'replay' button must be shown instead of autoloop
  const [showReplay, setShowReplay] = useState({});
  // For visibility auto-pause
  const [isTabActive, setIsTabActive] = useState(true);

  // Only load shorts on mount
  useEffect(() => {
    axios.get(HOST + "/shorts").then(res => setShorts(res.data));
  }, []);

  // Play only current short, pause others. Remove loop. Preload next only.
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = false;
        vid.load(); // Force current video to reload/preload
        vid.play().catch(()=>{});
        // Preload next short
        if (videoRefs.current[idx+1]) {
          videoRefs.current[idx+1].preload = 'auto';
        }
        // Prevent browser from preloading others
        for (
          let i = 0; i < videoRefs.current.length; i++
        ) {
          if (i !== idx && i !== idx+1 && videoRefs.current[i]) {
            videoRefs.current[i].preload = 'none';
            videoRefs.current[i].load();
          }
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
        vid.muted = true;
      }
    });
    setShowPause(false); setShowPulseHeart(false);
    setShowReplay({});
    // Clear replay counts for current video (when switching)
    // but keep progressing other videos
  }, [currentIdx]);

  // Intersection observer for vertical snap
  useEffect(() => {
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

  // Auto-pause if tab is inactive
  useEffect(() => {
    const handler = () => {
      const active = !document.hidden;
      setIsTabActive(active);
      const vid = videoRefs.current[currentIdx];
      if (vid) {
        if (!active) vid.pause();
        else if (!showReplay[shorts?.[currentIdx]?.url?.split('/')?.pop()] && !vid.paused)
          vid.play().catch(()=>{});
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [currentIdx, showReplay, shorts]);

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

  // Modern tap/animation logic
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

  // -- Progress/Comment unchanged
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
  function getProfilePic(v) {
    return v.avatar || v.profilePic ||
      `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
  }
  // For placeholder avatars/times
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
  // Caption expand button
  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [filename]: !prev[filename]
    }));
  };

  // ---- Download protections (no right click/long-press) and Replay Limiter ----
  const overlayPreventDownload = (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 99,
        background: 'transparent',
        pointerEvents: 'all',
        touchAction: 'none'
      }}
      // Prevent context menu and long press
      onContextMenu={e => e.preventDefault()}
      onMouseDown={e => {
        if (e.button === 2) e.preventDefault();
      }}
      onTouchStart={e => {
        // Prevent long press download on mobile
        e.preventDefault();
      }}
    />
  );

  // Handle video end: count replays, allow only 2, then require user click "Replay"
  const handleVideoEnded = (filename, idx) => {
    // Count replays
    replayCounts.current[filename] = (replayCounts.current[filename] || 0) + 1;
    if (replayCounts.current[filename] < MAX_AUTOPLAY) {
      setTimeout(() => {
        if (videoRefs.current[idx]) {
          videoRefs.current[idx].currentTime = 0;
          videoRefs.current[idx].play().catch(()=>{});
        }
      }, 200);
    } else {
      setShowReplay(prev => ({...prev, [filename]: true}));
    }
  };

  // ---- App's MAIN RENDER STARTS ----
  return (
    <div style={{ minHeight: "100dvh", width: "100vw", background: "#000", margin: 0, padding: 0, overflow: "hidden", ...fontStyle }}>
      <div style={{
        width: "100vw",
        height: "100dvh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: "#000"
      }}>
        {shorts.length === 0 && (
          <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20, ...fontStyle }}>No shorts uploaded yet.</div>
        )}
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
          const replayDone = showReplay[filename];

          return (
            <div key={idx} data-idx={idx} ref={el => (wrapperRefs.current[idx] = el)}
              style={{
                width: "100vw", height: "100dvh", scrollSnapAlign: "start",
                position: "relative", background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
              }}>
              {/* ---- VIDEO ---- */}
              <video ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                controls={false}
                autoPlay={isCurrent && isTabActive && !replayDone}
                muted
                preload={isCurrent || idx === currentIdx + 1 ? 'auto' : 'none'}
                playsInline
                style={{
                  width: "100vw", height: "100dvh", objectFit: "contain", background: "#000", cursor: "pointer", display: "block",
                  userSelect: "none",
                  borderRadius: 0
                }}
                tabIndex={-1}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                onContextMenu={e => e.preventDefault()}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
                onEnded={() => handleVideoEnded(filename, idx)}
                onPointerDown={e => {
                  if (e.button === 2) e.preventDefault();
                }}
              />
              {/* Overlay to block right-click/long-press/download */}
              {overlayPreventDownload}
              {/* Pause Animation */}
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

              {/* No-autoloop Replay Button */}
              {replayDone && isCurrent && (
                <div style={{
                  position:"absolute", left:0, top:0, width:"100%", height:"100%", zIndex:110,
                  display: "flex", alignItems:"center", justifyContent:"center",
                  background:"rgba(0,0,0,0.56)",
                  transition:"background .2s"
                }}>
                  <button
                    style={{
                      padding:"1em 2em",
                      background:"linear-gradient(90deg,#1da1f2,#0796fa)",
                      border:"none", borderRadius:14, color:"#fff",
                      fontWeight:600,
                      fontSize:22, cursor:"pointer",
                      boxShadow:"0 4px 20px #2227",
                      outline:"none",
                      ...fontStyle
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      // Reset replay count and play again
                      replayCounts.current[filename] = 0;
                      setShowReplay(prev => ({...prev, [filename]: false}));
                      setTimeout(()=>{
                        if (videoRefs.current[idx]) {
                          videoRefs.current[idx].currentTime = 0;
                          videoRefs.current[idx].play().catch(()=>{});
                        }
                      }, 50);
                    }}
                  >Replay</button>
                </div>
              )}

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

              {/* ---- ACTION STACK (DP, Like, Comment, Share) ---- */}
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
                {/* Like */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); if (!liked) handleLike(idx, filename, true); else handleLike(idx, filename, false); }}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...fontStyle,
                      outline:"none"
                    }}
                  >
                    <HeartSVG filled={liked} />
                  </button>
                  <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px', ...fontStyle }}>{v.likes || 0}</span>
                </div>
                {/* Comment */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); setShowComments(filename); }}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...fontStyle,
                      outline:"none"
                    }}>
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', ...fontStyle }}>{v.comments?.length || 0}</span>
                </div>
                {/* Share */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => handleShare(filename)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...fontStyle,
                      outline:"none"
                    }}>
                    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', ...fontStyle }}>Share</span>
                </div>
              </div>

              {/* ----- Caption/comments IG bottom bar ----- */}
              <div style={{
                position: "absolute",
                left: 0, right: 0, bottom: 0,
                background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
                color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6,
                display: "flex", flexDirection: "column", userSelect: "none"
              }}>
                {/* Username */}
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2, ...fontStyle }}>
                  @{v.author || "anonymous"}
                </div>
                {/* Modern Caption with ...more */}
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
                        whiteSpace: "pre-line",
                        ...fontStyle
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
                          transition: "color .15s",
                          ...fontStyle
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
                  <div style={{ fontSize: 14, color: "#bae6fd", ...fontStyle }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "#b2bec3", fontSize: 15, marginTop: 3, cursor: "pointer", ...fontStyle
                  }}
                  onClick={() => setShowComments(filename)}
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>

              {/* ------------- COMMENTS MODAL unchanged ------------- */}
              {showComments === filename &&
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 500,
                    background: "rgba(0,0,0,0.91)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end"
                  }}
                  onClick={() => setShowComments(null)}
                >
                  <div
                    className="comments-modal"
                    style={{
                      backgroundColor: "#000",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      padding: 15,
                      minHeight: '36vh', height: '70vh',
                      display: 'flex', flexDirection: 'column',
                      maxWidth: 500, width: "97vw", margin: "0 auto",
                      border: '1px solid #262626',
                      ...fontStyle
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: 15,
                        borderBottom: '1px solid #262626'
                      }}>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", ...fontStyle }}>Comments</h2>
                      <span
                        className="fas fa-times"
                        style={{ fontSize: 22, color: "#fff", cursor: "pointer", ...fontStyle }}
                        onClick={() => setShowComments(null)}
                      >×</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                      {allComments.length === 0 ? (
                        <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0", ...fontStyle }}>No comments yet.</div>
                      ) : (
                        allComments.map((c, i) => (
                          <div className="comment" style={{ display: 'flex', marginBottom: 15 }} key={i}>
                            <img
                              src={c.avatar}
                              className="comment-avatar"
                              alt="avatar"
                              style={{
                                width: 30, height: 30, borderRadius: "50%", marginRight: 10
                              }}
                            />
                            <div className="comment-content" style={{ flex: 1 }}>
                              <div>
                                <span className="comment-username" style={{
                                  fontWeight: 600, fontSize: 14, marginRight: 5, color:"#fff", ...fontStyle
                                }}>{c.name}</span>
                                <span className="comment-text" style={{ fontSize: 14, color:"#fff", ...fontStyle }}>{c.text}</span>
                              </div>
                              <div className="comment-time" style={{
                                fontSize: 12, color: "#a8a8a8", marginTop: 2, ...fontStyle
                              }}>{c.time}</div>
                              <div className="comment-actions" style={{
                                display: 'flex', marginTop: 5
                              }}>
                                <span style={{ fontSize: 12, color: "#a8a8a8", marginRight: 15, cursor: "pointer", ...fontStyle }}>Reply</span>
                                <span style={{ fontSize: 12, color: "#a8a8a8", marginRight: 15, cursor: "pointer", ...fontStyle }}>Like</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Add Comment */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      paddingTop: 10, borderTop: '1px solid #262626'
                    }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        style={{
                          flex: 1,
                          backgroundColor: "#262626",
                          border: "none",
                          borderRadius: 20,
                          padding: "10px 15px",
                          color: "white",
                          fontSize: 14,
                          ...fontStyle
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
                          opacity: (commentInputs[filename] || "").trim() !== "" ? 1 : 0.5,
                          ...fontStyle
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
      {/* Global font family style for app-like feel */}
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
