import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// --------- CONFIG
const HOST = "https://shorts-t2dk.onrender.com";

// --------- UI SVGs
function HeartSVG({ filled, size = 22 }) {
  return (
    <svg aria-label={filled ? "Unlike" : "Like"} height={size} width={size} viewBox="0 0 48 48">
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

function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw", height: "100dvh",
        scrollSnapAlign: "start",
        position: "relative",
        background: "#111",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
      }}
    >
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
      <div
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 20,
          background: "rgba(28,29,34,0.65)",
          borderRadius: 16, width: 39, height: 39,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          width: 24, height: 24,
          background: "linear-gradient(90deg,#222 30%,#333 60%,#222 100%)",
          borderRadius: "50%"
        }} />
      </div>
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

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ------ APP Font + DevTools block, GLOBAL ONCE ------ //
const FONT_FAMILY = "'Inter','Roboto','SF Pro','Segoe UI',Arial,sans-serif";
if (typeof window !== "undefined") {
  if (!window.__shorts_fonts_once) {
    window.__shorts_fonts_once = true;
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      html, body, * {
        font-family: ${FONT_FAMILY} !important;
        letter-spacing: 0.01em;
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
      }
      input, textarea, button {
        font-family: ${FONT_FAMILY} !important;
      }
    `;
    document.head.appendChild(style);
    window.addEventListener("contextmenu", (e) => {
      let n = e.target;
      if (!n) return;
      if (
        !(
          n.nodeName === "INPUT" ||
          n.nodeName === "TEXTAREA" ||
          n.isContentEditable
        )
      ) {
        e.preventDefault();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "F12"
      ) {
        e.preventDefault(); e.stopPropagation();
        return false;
      }
    });
  }
}

// -------- COMMENT "LIKES" & REPLIES (localStorage DEMO persisting) ----
const COMMENT_LIKES_KEY = "shorts_comment_likes_v2";
const COMMENT_REPLIES_KEY = "shorts_comment_replies_v2";
function getCommentLikes() {
  try { return JSON.parse(localStorage.getItem(COMMENT_LIKES_KEY) || "{}"); } catch { return {}; }
}
function setCommentLikes(obj) {
  localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify(obj));
}
function getCommentReplies() {
  try { return JSON.parse(localStorage.getItem(COMMENT_REPLIES_KEY) || "{}"); } catch { return {}; }
}
function setCommentReplies(obj) {
  localStorage.setItem(COMMENT_REPLIES_KEY, JSON.stringify(obj));
}

// -------- MODERN COMMENT COMPONENT --------
function Comment({
  uniqueId, comment, onReply, showReplyInput, replyVal, onReplyInput, onReplySend, refreshFeed,
}) {
  const [liked, setLiked] = useState(() => !!getCommentLikes()[uniqueId]);
  const [likeCount, setLikeCount] = useState(() => getCommentLikes()[uniqueId] || 0);
  const [replies, setReplies] = useState(() => getCommentReplies()[uniqueId] || []);
  useEffect(() => {
    setLiked(!!getCommentLikes()[uniqueId]);
    setLikeCount(getCommentLikes()[uniqueId] || 0);
    setReplies(getCommentReplies()[uniqueId] || []);
  }, [refreshFeed, uniqueId]);
  const handleLike = () => {
    let stored = getCommentLikes();
    if (!liked) {
      stored[uniqueId] = (stored[uniqueId] || 0) + 1;
    } else {
      stored[uniqueId] = Math.max(0, (stored[uniqueId] || 1) - 1);
    }
    setCommentLikes(stored);
    setLiked(!liked);
    setLikeCount(stored[uniqueId]);
  };
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 15,
      animation: "fadeinC .33s cubic-bezier(.61,2,.32,1)"
    }}>
      <img src={comment.avatar} alt="avatar" width={32} height={32} style={{
        borderRadius: "50%",
        objectFit: "cover",
        marginTop: 2,
        border: "1.2px solid #232b37",
        background: "#151c22"
      }} />
      <div style={{ flex: 1 }}>
        <span style={{
          fontWeight: 600,
          fontSize: 15,
          color: "#fff",
          letterSpacing: "0.02em"
        }}>{comment.name}</span>{" "}
        <span style={{
          color: "#f0f3fa",
          fontSize: 15,
          fontWeight: 400,
        }}>{comment.text}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <span style={{
            fontSize: 13,
            color: "#a6aed4",
            fontWeight: 400
          }}>{comment.time}</span>
          <span
            style={{
              fontSize: 14,
              color: "#4da6ff",
              cursor: "pointer",
              fontWeight: 500,
              padding: "0 5px 0 0",
              letterSpacing: ".01em",
              transition: "color .17s"
            }}
            tabIndex={0}
            onClick={() => onReply(uniqueId)}
          >Reply</span>
          <button
            aria-label={liked ? "Unlike" : "Like"}
            onClick={handleLike}
            style={{
              background: "none",
              border: "none",
              display: "flex", alignItems: "center",
              cursor: "pointer",
              padding: 0,
              marginLeft: 2,
              marginRight: 4,
              outline: "none",
              borderRadius: 99,
              transition: "background .17s",
              boxShadow: liked ? "0 1px 4px #ed495610" : "",
            }}
          >
            <HeartSVG filled={liked} size={20} />
            {likeCount > 0 &&
              <span style={{
                fontSize: 13,
                marginLeft: 3,
                color: liked ? "#ed4956" : "#bbb",
                fontWeight: 500
              }}>{likeCount}</span>
            }
          </button>
        </div>
        {replies && replies.length > 0 && (
          <div style={{ marginTop: 7, marginLeft: 7 }}>
            {replies.map((reply, idx) => (
              <div key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 6,
                  animation: "fadeinRep .26s"
                }}>
                <img src={reply.avatar} width={22} height={22} alt="avatar"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: 2,
                    boxShadow: "0 0 2px #15192a38"
                  }} />
                <div>
                  <span style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#7dd3fc"
                  }}>{reply.name}</span>{" "}
                  <span style={{
                    fontSize: 13.6,
                    color: "#eaf6fb"
                  }}>{reply.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {showReplyInput && (
          <form
            style={{ marginTop: 8, marginLeft: 1 }}
            onSubmit={e => {
              e.preventDefault(); onReplySend(uniqueId);
            }}>
            <input
              type="text"
              autoFocus
              value={replyVal}
              placeholder={`Reply to ${comment.name}...`}
              maxLength={120}
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 14,
                padding: "7px 13px",
                borderRadius: 18,
                border: "1.2px solid #40495a",
                background: "#192028",
                color: "#fff",
                outline: "none",
                width: "83%",
                marginRight: 7
              }}
              onChange={e => onReplyInput(e.target.value)}
            />
            <button
              type="submit"
              style={{
                color: "#2e91fc",
                background: "none",
                border: "none",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: "0.01em"
              }}
            >
              Send
            </button>
          </form>
        )}
      </div>
      <style>{`
        @keyframes fadeinC { from{opacity:0;transform:translateY(15px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeinRep { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}

// ------ ADDITIONAL STATE FOR CONTINUES (Glass Overlay) ------
const CONTINUE_AFTER = 3;



// Line Of Division
export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // New overlay state
  const [consecutivePlays, setConsecutivePlays] = useState({});
  const [showContinue, setShowContinue] = useState({});

  // For comment reply/like UI
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [refreshFeed, setRefreshFeed] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get(HOST + "/shorts")
      .then(res => setShorts(shuffleArray(res.data)))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        // Don't autoplay if overlay is shown
        if (!showContinue[shorts[idx]?.url?.split("/").pop()]) vid.play().catch(()=>{});
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPulseHeart(false);
    // Reset consecutive plays for new video
    let f = shorts[currentIdx]?.url?.split("/").pop();
    setConsecutivePlays(pc => ({ ...pc, [f]: 0 }));
    setShowContinue(sc => ({ ...sc, [f]: false }));
  }, [currentIdx, muted, showContinue, shorts]);

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
      let snackbar = document.createElement('div');
      snackbar.innerText = "Link copied!";
      snackbar.style.position = "fixed";
      snackbar.style.bottom = "72px";
      snackbar.style.left = "50%";
      snackbar.style.transform = "translateX(-50%)";
      snackbar.style.background = "#202b";
      snackbar.style.color = "#fff";
      snackbar.style.borderRadius = "12px";
      snackbar.style.padding = "7px 19px";
      snackbar.style.fontSize = "14px";
      snackbar.style.zIndex = "99999";
      snackbar.style.fontFamily = FONT_FAMILY;
      snackbar.style.transition = "opacity 0.22s";
      document.body.appendChild(snackbar);
      setTimeout(() => { snackbar.style.opacity = "0"; }, 1200);
      setTimeout(() => { document.body.removeChild(snackbar); }, 1750);
    }
  }
  function handlePlay(filename) {
    fetch(`/shorts/${filename}/view`, { method: 'POST' });
  };
  function handleLikeButton(filename) {
    fetch(`/shorts/${filename}/like`, { method: 'POST' });
    // Optionally update state for instant feedback (if needed)
  };
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
  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({
      ...prev,
      [filename]: !prev[filename]
    }));
  };
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
  function handleReplyOpen(uniqueId) {
    setReplyingTo(uniqueId);
  }
  function handleReplyInput(uniqueId, value) {
    setReplyInputs(q => ({ ...q, [uniqueId]: value }));
  }
  function handleReplySend(uniqueId) {
    const val = (replyInputs[uniqueId] || '').trim();
    if (!val) return;
    let allReplies = getCommentReplies();
    let arr = allReplies[uniqueId] || [];
    arr.push({
      name: "You", text: val, avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=YOU_REPLY", time: "Just now"
    });
    allReplies[uniqueId] = arr;
    setCommentReplies(allReplies);
    setReplyInputs(q => ({ ...q, [uniqueId]: "" }));
    setReplyingTo(null);
    setTimeout(() => setRefreshFeed(Date.now()), 80);
  }

  // ---- MAIN RENDER -----
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
        {loading && (
          <>
            {Array.from({length: 2}).map((_, idx) => <SkeletonShort key={idx} />)}
          </>
        )}
        {!loading && shorts.length === 0 && (
          <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20, fontFamily: FONT_FAMILY }}>
            No shorts yet. Why not be first?
          </div>
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
          return (
            <div key={idx} data-idx={idx} ref={el => (wrapperRefs.current[idx] = el)}
              style={{
                width: "100vw", height: "100dvh", scrollSnapAlign: "start",
                position: "relative", background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
              }}>
              {/* ====== VIDEO + OVERLAY ====== */}
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop={false}
                playsInline
                style={{
                  width: "100vw", height: "100dvh",
                  objectFit: "contain",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                  fontFamily: FONT_FAMILY,
                  userSelect: "none"
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
                controls={false}
                tabIndex={-1}
                preload="auto"
                onPlay={() => handlePlay(filename)}
                onEnded={() => {
                  setConsecutivePlays(pc => {
                    const count = (pc[filename] || 0) + 1;
                    if (count >= CONTINUE_AFTER) setShowContinue(sc => ({ ...sc, [filename]: true }));
                    return { ...pc, [filename]: count };
                  });
                }}
              />
              {/* GLASS OVERLAY */}
              {showContinue[filename] && isCurrent && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center", zIndex: 1999,
                  pointerEvents: 'auto', background: "rgba(0,0,0,0.0)"
                }}>
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                    minWidth: 260, minHeight: 92, background: "rgba(30,30,38,0.41)",
                    borderRadius: 16, boxShadow: "0 8px 32px 0 rgba(12,16,30,0.21), 0 1.5px 11px #0004",
                    backdropFilter: "blur(14px) saturate(160%)",
                    border: "1.6px solid rgba(80,80,86,0.16)", padding: "24px 26px 18px 26px"
                  }}>
                    <span style={{
                      color: "#fff", fontSize: "1.11rem", fontWeight: 600,
                      letterSpacing: "0.01em", whiteSpace: "nowrap", fontFamily: "inherit", marginBottom: 6
                    }}>Continue watching?</span>
                    <button
                      style={{
                        background: "rgba(0,0,0, 0.30)", color: "#fff", fontFamily: "inherit", padding: "8px 28px",
                        fontSize: "1rem", fontWeight: 500, borderRadius: 12,
                        border: "1.1px solid rgba(255,255,255,0.085)",
                        boxShadow: "0 1.5px 8px #0004", outline: "none", marginTop: 1,
                        cursor: "pointer", letterSpacing: "0.01em"
                      }}
                      onClick={() => {
                        setShowContinue(sc => ({ ...sc, [filename]: false }));
                        setConsecutivePlays(pc => ({ ...pc, [filename]: 0 }));
                        const vid = videoRefs.current[idx];
                        if (vid) { vid.currentTime = 0; vid.play(); }
                      }}
                    >Continue</button>
                  </div>
                </div>
              )}

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
                    top: 20, right: 20, zIndex: 60,
                    background: "rgba(28,29,34,0.65)", border: "none",
                    borderRadius: 16, width: 39, height: 39,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 2px 6px #0002",
                    outline: "none", transition: "box-shadow .22s,ease",
                    fontFamily: FONT_FAMILY,
                    ...(mutePulse ? {animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)", boxShadow: "0 0 0 9px #33b6ff27"} : {})
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
              {isCurrent && showPause && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 105, background: 'rgba(0,0,0,0.26)', pointerEvents: "none",
                  fontFamily: FONT_FAMILY,
                  animation: 'fadeInPause .29s'
                }}>
                  <PauseIcon />
                  <style>{`@keyframes fadeInPause { from {opacity:0; transform:scale(.85);} to {opacity:1; transform:scale(1);} }`}</style>
                </div>
              )}
              {isCurrent && <PulseHeart visible={showPulseHeart} />}
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
              {/* --- SOCIAL ACTION BAR: like/comment/share same size --- */}
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
                    alt="user pic"
                    style={{
                      width: "100%", height: "100%",
                      borderRadius: "50%", objectFit: "cover"
                    }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); handleLikeButton(filename); }}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(30,33,44,0.64)",
                      border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                      margin: 0, padding: 0, cursor: "pointer"
                    }}>
                    <HeartSVG filled={true} size={22}/>
                  </button>
                  <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px', fontFamily: FONT_FAMILY }}>{v.likes || 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); setShowComments(filename); }}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(30,33,44,0.64)",
                      border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                      margin: 0, padding: 0, cursor: "pointer"
                    }}>
                    <svg aria-label="Comment" fill="#fff" height="22" viewBox="0 0 24 24" width="22">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', fontFamily: FONT_FAMILY }}>{v.comments?.length || 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => handleShare(filename)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(30,33,44,0.64)",
                      border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                      margin: 0, padding: 0, cursor: "pointer"
                    }}>
                    <svg aria-label="Share Post" fill="#fff" height="22" viewBox="0 0 24 24" width="22">
                      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', fontFamily: FONT_FAMILY }}>Share</span>
                </div>
              </div>
              <div style={{
                position: "absolute",
                left: 0, right: 0, bottom: 0,
                background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
                color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6,
                display: "flex", flexDirection: "column", userSelect: "none"
              }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2, fontFamily: FONT_FAMILY }}>
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
                        whiteSpace: "pre-line",
                        fontFamily: FONT_FAMILY,
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
                          fontFamily: FONT_FAMILY,
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
                {/* Stats row: views & likes & simple Like for backend */}
                <div style={{
                  color: "#f6f6fa",
                  fontSize: 13.5,
                  fontWeight: 400,
                  padding: "0px 10px",
                  marginTop: 1,
                  letterSpacing: ".02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FONT_FAMILY
                }}>
                  Views: {v.views || 0}
                  &nbsp;|&nbsp;
                  Likes: {v.likes || 0}
                  <button
                    onClick={() => handleLikeButton(filename)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "1em",
                      cursor: "pointer",
                      marginLeft: "8px"
                    }}
                  >Like</button>
                </div>
                {/* Comments and comments modal remain unchanged */}
              </div>
              {/* Comments modal and input area unchanged, see your code above */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
