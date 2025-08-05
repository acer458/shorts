// FeedUI.js
import React from "react";

// --- NICE FONT ---
export function AppFont() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      html, body {
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        background: #000;
        margin: 0; padding: 0;
        color: #fff;
        -webkit-font-smoothing: antialiased;
      }
    `}</style>
  );
}

// --- Prevent Right Click ---
export function BlockContextMenu() {
  React.useEffect(() => {
    const f = e => e.preventDefault();
    window.addEventListener("contextmenu", f);
    return () => window.removeEventListener("contextmenu", f);
  }, []);
  return null;
}
// --- Block Keyboard Devtools ---
export function AntiInspectScript() {
  React.useEffect(() => {
    function handler(e) {
      // F12
      if (e.key === "F12" || e.keyCode === 123) e.preventDefault();
      // Ctrl+Shift+I/J/C/U/S, Cmd+Opt+I, Cmd+Opt+C
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey &&
            ["I", "J", "C", "S"].includes(e.key.toUpperCase())
        ) ||
        ((e.metaKey && e.altKey) && ["I", "C"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
      // Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "U") e.preventDefault();
    }
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
  return null;
}

// --- Page background wrapper ---
export function MainWrapper({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090a",
      width: "100vw",
      minWidth: "100vw",
      margin: 0,
      padding: 0,
      fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
      userSelect: "none"
    }}>
      {children}
    </div>
  );
}

// --- Loading Skeleton ---
export function SkeletonShort() {
  return (
    <div style={{
      width: "100vw",
      height: "100dvh",
      background: "#161d29",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: 270,
        height: 390,
        borderRadius: 17,
        background: "linear-gradient(90deg,#232b39 25%,#364054 50%,#232b39 75%)",
        backgroundSize: "800px 104px",
        animation: "g6 1.2s linear infinite"
      }} />
      <style>
        {`
        @keyframes g6 {
          0% { background-position: -400px 0 }
          100% { background-position: 400px 0 }
        }
        `}
      </style>
    </div>
  );
}

// --- Not found block for 404/empty video ---
export function NotFoundBlock({ onBack }) {
  return (
    <div style={{
      color: "#ca7979", textAlign: "center", marginTop: 120, fontSize: 22,
      minHeight: "85dvh"
    }}>
      <div style={{marginBottom:16}}>Video not found.</div>
      <button
        onClick={onBack}
        style={{
          color: "#fff", background: "#33b6ff",
          border: "none", borderRadius: 10, fontWeight: 600,
          fontSize: 16, padding: "9px 29px", cursor: "pointer"
        }}>
        Back to Feed
      </button>
    </div>
  );
}

export function EmptyFeedBlock() {
  return (
    <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20, minHeight:"85dvh" }}>
      No shorts uploaded yet.
    </div>
  );
}

// --- Icons ---
export function HeartSVG({ filled }) {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" style={{
      stroke: filled ? "#ed4956" : "#fff", strokeWidth: 2, transition: "all .21s",
      filter: filled ? "drop-shadow(0 2px 12px #c43a3a74)" : ""
    }}>
      <path
        d="M24 43C-9 21.5 12.5 2.5 24 15.5 35.5 2.5 57 21.5 24 43Z"
        fill={filled ? "#ed4956" : "none"}
        stroke={filled ? "#ed4956" : "#fff"}
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function PauseIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
      <rect x="22" y="24" width="10" height="32" rx="4" fill="#fff" />
      <rect x="48" y="24" width="10" height="32" rx="4" fill="#fff" />
    </svg>
  );
}
export function PulseHeart({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", left: "50%", top: "52%",
      transform: "translate(-50%,-50%) scale(1.04)",
      zIndex: 120, pointerEvents: "none"
    }}>
      <svg width="112" height="96" viewBox="0 0 112 96" fill="none">
        <path d="M56 86C-21 43 15.5 7 56 47C96.5 7 133 43 56 86Z"
              fill="#ed495688" stroke="#ed4956" strokeWidth="6" />
      </svg>
    </div>
  );
}
export function MuteMicIcon({ muted }) {
  return muted ? (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M15 11V7a3 3 0 10-6 0v4a3 3 0 006 0Z"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 11v2c0 3-2.7 5-7 5" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" />
      <line x1="3" y1="21" x2="21" y2="3"
        stroke="#fa474775" strokeWidth="2.5"
        strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M15 11V7a3 3 0 10-6 0v4a3 3 0 006 0Z"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 11v2c0 3-2.7 5-7 5" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" />
    </svg>
  );
}

// ---- Comments Modal (presentational-only) ----
export function CommentsModal({
  visible, allComments, onClose,
  commentInput, onCommentChange, onAddComment
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex:500,
        background: "rgba(0,0,0,0.91)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#10151d",
          borderTopLeftRadius: 15, borderTopRightRadius: 15,
          padding: 15, minHeight: '36vh', height: '70vh',
          display: 'flex', flexDirection: 'column',
          maxWidth: 480, width: "98vw", margin: "0 auto",
          border: '1px solid #191f26',
          touchAction: "none"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 15, borderBottom: '1px solid #191e29'
          }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Comments</h2>
          <span
            aria-label="Close"
            role="button"
            tabIndex={0}
            style={{ fontSize: 25, color: "#fff", cursor: "pointer", marginRight: 2}}
            onClick={onClose}
            >×</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {(!allComments || allComments.length === 0) ? (
            <div style={{ color: "#bfcad8", textAlign: "center", padding: "38px 0" }}>No comments yet.</div>
          ) : (
            allComments.map((c, i) => (
              <div className="comment" style={{ display: 'flex', marginBottom: 14 }} key={i}>
                <div style={{
                  width: 31, height: 31, borderRadius: "50%",
                  overflow: "hidden", marginRight: 10, flexShrink: 0
                }}>
                  <img src={c.avatar || "https://api.dicebear.com/8.x/thumbs/svg?seed=User"+i}
                       alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} />
                </div>
                <div className="comment-content" style={{ flex: 1 }}>
                  <div>
                    <span style={{
                      fontWeight: 600, fontSize: 14,marginRight:7, color:"#fff"
                    }}>{c.name||"anon"}</span>
                    <span style={{ fontSize: 14, color:"#fff" }}>{c.text}</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: "#9699a6", marginTop: 2
                  }}>{c.time||""}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Add Comment */}
        <div style={{
          display: 'flex', alignItems: 'center', paddingTop: 11, borderTop: '1px solid #1c242e'
        }}>
          <input
            type="text"
            placeholder="Add a comment…"
            style={{
              flex: 1, backgroundColor: "#191f26", border: "none", borderRadius: 20,
              padding: "11px 17px", color: "white", fontSize: 15,
              outline: "none"
            }}
            value={commentInput}
            onChange={e => onCommentChange(e.target.value)}
            onKeyDown={e =>
              e.key === "Enter" && commentInput.trim() !== "" && onAddComment()
            }
          />
          <button
            style={{
              color: "#0095f6", fontWeight: 600, marginLeft: 13,
              fontSize: 15, background: "none", border: "none",
              cursor: commentInput.trim() !== "" ? "pointer" : "default",
              opacity: commentInput.trim() !== "" ? 1 : 0.54
            }}
            disabled={commentInput.trim() === ""}
            onClick={onAddComment}
          >Post</button>
        </div>
      </div>
    </div>
  );
}

// -------- FEED LIST MAIN: The actual video cards/feed ----------
export function FeedList({
  shorts,
  onLike,
  onOpenComments,
  onShare,
  isLiked,
  getProfilePic,
  isSingle,
  onBack
}) {
  const videoRefs = React.useRef([]);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [muted, setMuted] = React.useState(true);
  const [showPause, setShowPause] = React.useState(false);
  const [showPulseHeart, setShowPulseHeart] = React.useState(false);
  const [expandedCaptions, setExpandedCaptions] = React.useState({});
  const [videoProgress, setVideoProgress] = React.useState({});
  const wrapperRefs = React.useRef([]);

  // Intersection for snap scrolling
  React.useEffect(() => {
    if (isSingle) return;
    const observer = new window.IntersectionObserver(
      entries => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach(entry => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleIdx = Number(entry.target.dataset.idx);
          }
        });
        if (maxRatio > 0.65) setCurrentIdx(visibleIdx);
      },
      { threshold: [0, 0.48, 0.65, 1] }
    );
    wrapperRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length, isSingle]);

  // Scroll: only play current
  React.useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        vid.play().catch(()=>{});
      } else {
        vid.pause(); vid.currentTime = 0; vid.muted = true;
      }
    });
    setShowPause(false);
    setShowPulseHeart(false);
  }, [currentIdx, muted, isSingle]);

  // Seek/progress
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

  // Caption expand
  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({
      ...prev, [filename]: !prev[filename]
    }));
  };

  // DOUBLE-TAP/LONG-PRESS Like
  function makeTapHandlers(idx, filename, short) {
    let tapTimeout = null;
    return {
      onClick: e => {
        if (tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) { vid.play(); setShowPause(false);}
          else { vid.pause(); setShowPause(true);}
        }, 240);
      },
      onDoubleClick: e => {
        if (tapTimeout) { clearTimeout(tapTimeout); tapTimeout = null; }
        if (!isLiked(filename)) {
          onLike(short);
          setShowPulseHeart(true);
          setTimeout(() => setShowPulseHeart(false), 700);
        }
      },
      onTouchEnd: e => {
        if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
        if (tapTimeout) {
          clearTimeout(tapTimeout); tapTimeout = null;
          if (!isLiked(filename)) {
            onLike(short);
            setShowPulseHeart(true);
            setTimeout(() => setShowPulseHeart(false), 700);
          }
        } else {
          tapTimeout = setTimeout(() => {
            const vid = videoRefs.current[idx];
            if (vid) {
              if (vid.paused) { vid.play(); setShowPause(false);}
              else { vid.pause(); setShowPause(true);}
            }
            tapTimeout = null;
          }, 250);
        }
      }
    };
  }

  // UI
  return (
    <div style={{
      width: "100vw",
      minHeight: "100dvh",
      overflowY: isSingle ? "hidden" : "scroll",
      overflowX: "hidden",
      scrollSnapType: isSingle ? undefined : "y mandatory",
      background: "#000"
    }}>
      {isSingle && (
        <div style={{
          position: "absolute", top: 22, left: 24, zIndex:50
        }}>
          <button style={{
              background: "rgba(50,171,255,0.62)", border: "none",
              color: "#fff", borderRadius: 11, fontSize: 15,
              fontWeight: 600, padding: "7px 20px", cursor: "pointer"
            }}
            onClick={onBack}>← Back to Feed</button>
        </div>
      )}
      {shorts.map((v, idx) => {
        const filename = v.filename;
        const liked = isLiked(filename);
        const prog = videoProgress[filename] || 0;
        const caption = v.caption || "";
        const previewLimit = 90;
        const isTruncated = caption && caption.length > previewLimit;
        const showFull = expandedCaptions[filename];
        const displayedCaption = !caption ? "" : showFull ? caption : (caption.length > previewLimit ? caption.slice(0,caption.indexOf(" ",previewLimit) === -1 ? previewLimit : caption.indexOf(" ",previewLimit))+"…" : caption);
        const isCurrent = isSingle ? true : idx === currentIdx;
        return (
          <div key={idx} data-idx={idx} ref={el => (wrapperRefs.current[idx] = el)}
            style={{
              width: "100vw", height: "100dvh", scrollSnapAlign: "start",
              position: "relative", background: "#000",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
            }}>
            {/* VIDEO */}
            <video ref={el => (videoRefs.current[idx] = el)}
              src={v.url}
              loop playsInline
              style={{ width: "100vw", height: "100dvh", objectFit: "contain", background: "#000", cursor: "pointer", display: "block" }}
              onContextMenu={e => e.preventDefault()}
              {...makeTapHandlers(idx, filename, v)}
              onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              muted={muted}
              preload="auto"
              poster={v.poster || ""}
              controls={false}
            />
            {/* Mute Button */}
            {isCurrent && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setMuted(m => !m);
                }}
                aria-label={muted ? "Unmute" : "Mute"}
                style={{
                  position: "absolute", top: 20, right: 20,
                  zIndex: 60, background: "rgba(28,29,34,0.65)",
                  border: "none", borderRadius: 16, width: 39, height: 39,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 2px 6px #0002", outline: "none"
                }}>
                <MuteMicIcon muted={muted} />
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
              position: "absolute", left: 0, right: 0, bottom: 0, height: 4,
              background: "rgba(255,255,255,0.16)", zIndex: 32,
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
                position: 'absolute', right: '16px', bottom: '98px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '23px', zIndex: 10
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", overflow: "hidden",
                background: "#232a35", border:"1.2px solid #1f2430", marginBottom:6
              }}>
                <img src={getProfilePic(v)}
                  alt="dp"
                  style={{
                    width: "100%", height: "100%",
                    borderRadius: "50%", objectFit: "cover"
                  }} />
              </div>
              {/* Like */}
              <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                <button onClick={e => { e.stopPropagation(); onLike(v); }}
                        style={{background:'none',border:'none',cursor:'pointer',padding:0}}>
                  <HeartSVG filled={liked}/>
                </button>
                <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px', fontWeight:500 }}>
                  {v.likes || 0}
                </span>
              </div>
              {/* Comment */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <button onClick={e => { e.stopPropagation(); onOpenComments(v); }}
                        style={{background:'none',border:'none',cursor:'pointer',padding:0}}>
                  <svg aria-label="Comment" fill="#fff" height="25" viewBox="0 0 24 24" width="25">
                    <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z"
                          fill="none" stroke="#fff"
                          strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
                </button>
                <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', fontWeight:500 }}>
                  {v.comments?.length || 0}
                </span>
              </div>
              {/* Share */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <button onClick={e => { e.stopPropagation(); onShare(v); }}
                    style={{background:'none',border:'none',cursor:'pointer',padding:0}}>
                  <svg aria-label="Share Post" fill="#fff" height="23" viewBox="0 0 24 24" width="23">
                    <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                    <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                             stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                  </svg>
                </button>
                <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px', fontWeight:500 }}>Share</span>
              </div>
            </div>
            {/* --- BOTTOM META --- */}
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              background: "linear-gradient(0deg,#000d 90%,transparent 100%)",
              color: "#fff", padding: "21px 18px 27px 18px", zIndex: 6,
              display: "flex", flexDirection: "column", userSelect: "none"
            }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
                @{v.author || "anonymous"}
              </div>
              {caption && (
                <div style={{
                  display: "flex", alignItems: "flex-end", minHeight: "28px", maxWidth: 500
                }}>
                  <div
                    style={{
                      fontWeight: 400, fontSize: 16, color: "#fff", lineHeight: 1.41,
                      maxHeight: showFull ? "none" : "2.8em",
                      overflow: showFull ? "visible" : "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: showFull ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                      marginRight: isTruncated ? 11 : 0,
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
                        lineHeight: 1.16,
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
                <div style={{ fontSize: 14, color: "#94e2ff" }}>
                  {v.comments[0].name === "You" ? (
                    <>{v.comments[0].text}</>
                  ) : (
                    <><b>{v.comments[0].name}:</b> {v.comments[0].text}</>
                  )}
                </div>
              )}
              <div
                style={{
                  color: "#b6bfc8", fontSize: 15, marginTop: 3, cursor: "pointer"
                }}
                onClick={e => { e.stopPropagation(); onOpenComments(v); }}
              >View all {v.comments ? v.comments.length : 0} comments</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
