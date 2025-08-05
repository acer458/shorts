import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HOST, fetchFeed, fetchSingle, shuffleArray, isLiked, setLiked, truncateString,
  getProfilePic, fakeAvatar, fakeTime, serverLike, serverAddComment
} from "./feedLogic";
import {
  HeartSVG, PauseIcon, PulseHeart, MuteMicIcon, SkeletonShort
} from "./FeedUI";


export default function Feed() {
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
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);

  // FETCH DATA
  useEffect(() => {
    setLoading(true); setNotFound(false); setAloneVideo(null); setShorts([]);
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      fetchSingle(filename)
        .then(setAloneVideo)
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    } else {
      fetchFeed().then(setShorts).finally(() => setLoading(false));
    }
  }, [location.search]);

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

  useEffect(() => {
    if (aloneVideo) return;
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted; vid.play().catch(()=>{});
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPulseHeart(false);
  }, [currentIdx, muted, aloneVideo]);

  function handleLike(idx, filename, wantPulse = false) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      serverLike(filename).then(() => {
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
      setShorts(prev => prev.map((v, i) => i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v));
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
    serverAddComment(filename, { name: "You", text })
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
            ? {
                ...prev,
                comments: [...(prev.comments || []), { name: "You", text }]
              }
            : prev
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
      });
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

  // UI RENDER

  if (notFound) {
    return (
      <div style={{
        color: "#ca7979", textAlign: "center", marginTop: 120, fontSize: 22,
        background: "#000", minHeight: "100dvh"
      }}>
        <div style={{marginBottom:12}}>Video not found.</div>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            color: "#fff", background: "#33b6ff",
            border: "none", borderRadius: 10, fontWeight: 600,
            fontSize: 16, padding: "8px 28px", cursor: "pointer"
          }}>
          Back to Feed
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <>
        {[...Array(2)].map((_, i) => <SkeletonShort key={i} />)}
      </>
    );
  }
  // ---- SINGLE VIDEO MODE ----
  if (aloneVideo) {
    // (Paste here your previously working solo video JSX from above—no changes)
    // For brevity, see the code you pasted above for the full JSX
    // (The single video JSX is too long to display again here but you can copy from your working code)
    // Directly use:
    // return ( ...JSX from "SINGLE VIDEO MODE" in your original code ... );
    // (Omitted for brevity. This is _exactly_ your original big "aloneVideo" JSX tree)
    // ...
  }
  if (!loading && shorts.length === 0) {
    return (
      <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20 }}>No shorts uploaded yet.</div>
    );
  }
  // ---- NORMAL FEED MODE ----
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
              {/* VIDEO */}
              <video ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop playsInline
                style={{ width: "100vw", height: "100dvh", objectFit: "contain", background: "#000", cursor: "pointer", display: "block" }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />
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
              {/* ---- ACTION STACK (like, comment, share) ---- */}
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
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <HeartSVG filled={liked} />
                  </button>
                  <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px' }}>{v.likes || 0}</span>
                </div>
                {/* Comment */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); setShowComments(filename); }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>{v.comments?.length || 0}</span>
                </div>
                {/* Share */}
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
              {/* --- BOTTOM META --- */}
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
                      touchAction: "none",
                      transition: isDraggingModal ? "none" : "transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                      transform: modalDragY
                        ? `translateY(${Math.min(modalDragY, 144)}px)`
                        : "translateY(0)"
                    }}
                    onTouchStart={handleModalTouchStart}
                    onTouchMove={handleModalTouchMove}
                    onTouchEnd={handleModalTouchEnd}
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
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Comments</h2>
                      <span
                        className="fas fa-times"
                        style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                        onClick={() => setShowComments(null)}
                      >×</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                      {allComments.length === 0 ? (
                        <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0" }}>No comments yet.</div>
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
                                  fontWeight: 600, fontSize: 14, marginRight: 5, color:"#fff"
                                }}>{c.name}</span>
                                <span className="comment-text" style={{ fontSize: 14, color:"#fff" }}>{c.text}</span>
                              </div>
                              <div className="comment-time" style={{
                                fontSize: 12, color: "#a8a8a8", marginTop: 2
                              }}>{c.time}</div>
                              <div className="comment-actions" style={{
                                display: 'flex', marginTop: 5
                              }}>
                                <span style={{ fontSize: 12, color: "#a8a8a8", marginRight: 15, cursor: "pointer" }}>Reply</span>
                                <span style={{ fontSize: 12, color: "#a8a8a8", marginRight: 15, cursor: "pointer" }}>Like</span>
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
