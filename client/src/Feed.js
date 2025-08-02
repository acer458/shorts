import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

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
  const [showComments, setShowComments] = useState(null); // filename or null
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => {
    axios.get(HOST + "/shorts").then(res => setShorts(res.data));
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

  // Scroll snap detection
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

  // Handler for Like button
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
      setShorts(prev => prev.map(
        (v, i) => i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
      ));
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }

  // Handle Share
  function handleShare(filename) {
    const url = window.location.origin + "/?v=" + filename;
    if (navigator.share) {
      navigator.share({ url, title: "Watch this short!" });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }

  // Play/pause/single/double tap logic
  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: e => {
        if (tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) vid.play();
          else vid.pause();
        }, 240);
      },
      onDoubleClick: () => {
        if (tapTimeout) { clearTimeout(tapTimeout); tapTimeout = null; }
        handleLike(idx, filename);
      },
      onTouchEnd: e => {
        if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
        if (tapTimeout) { clearTimeout(tapTimeout); tapTimeout = null; handleLike(idx, filename); }
        else {
          tapTimeout = setTimeout(() => {
            const vid = videoRefs.current[idx];
            if (vid) {
              if (vid.paused) vid.play();
              else vid.pause();
            }
            tapTimeout = null;
          }, 240);
        }
      }
    };
  }

  // Seek logic
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

  function getProfilePic(v) {
    return v.avatar || v.profilePic ||
        `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
  }

  return (
    <div style={{
      minHeight: "100dvh", width: "100vw", background: "#000",
      margin: 0, padding: 0, overflow: "hidden"
    }}>
      <div style={{
        width: "100vw",
        height: "100dvh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: "#000"
      }}>
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
                width: "100vw", height: "100dvh", scrollSnapAlign: "start",
                position: "relative", background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: "100vw", height: "100dvh", objectFit: "contain",
                  background: "#000", cursor: "pointer", display: "block"
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />

              {/* Progress seeker */}
              <div
                style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  height: 4, background: "rgba(255,255,255,0.18)",
                  zIndex: 32, borderRadius: 2, overflow: "hidden", cursor: "pointer"
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
                    pointerEvents: "none"
                  }}
                />
              </div>

              {/* --- DP, Like, Comment, Share --- */}
              <div style={{
                position: 'absolute',
                right: '12px',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                zIndex: 10
              }}>
                {/* Profile Picture / DP */}
                <div style={{
                  marginBottom: '6px',
                  width: 50, height: 50,
                  borderRadius: "50%",
                  overflow: "hidden"
                }}>
                  <img src={getProfilePic(v)}
                       alt="dp"
                       style={{
                         width: "100%",
                         height: "100%",
                         borderRadius: "50%",
                         objectFit: "cover"
                       }}/>
                </div>
                {/* Like BUTTON/Count */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => handleLike(idx, filename)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <svg aria-label={liked ? "Unlike" : "Like"} fill={liked ? "#ed4956" : "#fff"} height="24" viewBox="0 0 24 24" width="24">
                      <path d={liked ?
                        "M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"
                        :
                        "M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"}/>
                    </svg>
                  </button>
                  <span style={{
                    color: liked ? '#ed4956' : '#fff',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {v.likes || 0}
                  </span>
                </div>

                {/* Comment BUTTON/Count */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => setShowComments(filename)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer'
                    }}
                  >
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{
                    color: '#fff',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {v.comments?.length || 0}
                  </span>
                </div>

                {/* Share BUTTON */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => handleShare(filename)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer'
                    }}
                  >
                    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{
                    color: '#fff', fontSize: '12px', marginTop: '4px'
                  }}>
                    Share
                  </span>
                </div>
              </div>

              {/* Info/caption/comments preview */}
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
                  userSelect: "none"
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
                    cursor: "pointer"
                  }}
                  onClick={() => setShowComments(filename)}
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>

              {/* ---- COMMENTS MODAL ---- */}
              {showComments === filename && (
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
                  onClick={() => setShowComments(null)}
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
                      display: "flex",
                      flexDirection: "column"
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 54,
                      borderBottom: "1px solid #232345",
                      color: "#8cd9ff",
                      fontWeight: 600,
                      fontSize: 18,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      position: "relative"
                    }}>
                      Comments
                      <button
                        onClick={() => setShowComments(null)}
                        style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 23,
                          background: "none",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >×</button>
                    </div>
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
                    {/* Input bar */}
                    <div
                      style={{
                        position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 3,
                        background: "#23243f",
                        padding: "12px 10px 13px 10px",
                        borderRadius: "0 0 14px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "99%",
                        margin: "auto",
                        minWidth: 0
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
                          minWidth: 0,
                          border: "none",
                          borderRadius: 22,
                          fontSize: 18,
                          padding: "13px 14px",
                          outline: "none",
                          background: "#1a202f",
                          color: "#fff",
                          boxShadow: "0 1px 3px #0003",
                        }}
                        onKeyDown={e => { if (e.key === "Enter") handleAddComment(idx, filename); }}
                        inputMode="text"
                      />
                      <button
                        style={{
                          background: commentInputs[filename]?.trim() ? "#2983fe" : "#7daefc",
                          color: "#fff",
                          border: "none",
                          borderRadius: 22,
                          padding: "10px 16px",
                          fontWeight: 700,
                          fontSize: 17,
                          cursor: commentInputs[filename]?.trim() ? "pointer" : "not-allowed",
                          boxShadow: commentInputs[filename]?.trim() ? "0 1px 5px #2983fe44" : "none",
                          transition: "background .15s",
                          minWidth: 0
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
