import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// IG-style filled/outlined heart using SVG
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
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev => prev.map((v, i) => i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v));
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
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

  // Play/pause tap/double tap
  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: () => {
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

              {/* --- DP, Like, Comment, Share (no borders/shadows, matching Instagram) --- */}
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
                  width: 48, height: 48,
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
                    <HeartSVG filled={liked} />
                  </button>
                  <span style={{
                    color: liked ? '#ed4956' : '#fff',
                    fontSize: '13px',
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
                    fontSize: '13px',
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
                    color: '#fff', fontSize: '13px', marginTop: '4px'
                  }}>
                    Share
                  </span>
                </div>
              </div>

              {/* ------ Caption/comments preview bar ------ */}
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
                <div style={{
                  fontWeight: 600, fontSize: 16, marginBottom: 6
                }}>
                  @{v.author || "anonymous"}
                  <span style={{ fontWeight: 400, marginLeft: 9, color: "#fff" }}>
                    {v.caption}
                  </span>
                </div>
                {v.comments && v.comments.length > 0 && (
                  <div style={{ fontSize: 14, color: "#bae6fd" }}>
                    <b>{v.comments[0].name}:</b> {v.comments[0].text}
                  </div>
                )}
                <div
                  style={{
                    color: "#b2bec3",
                    fontSize: 15,
                    marginTop: 3,
                    cursor: "pointer"
                  }}
                  onClick={() => setShowComments(filename)}
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>

              {/* ---- COMMENTS MODAL (with INSTAGRAM caption/comments UI) ---- */}
              {showComments === filename &&
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
                      background: "#fff",
                      borderTopLeftRadius: 17,
                      borderTopRightRadius: 17,
                      maxWidth: 500,
                      margin: "auto",
                      minHeight: 390,
                      maxHeight: "90vh",
                      width: "97vw",
                      boxShadow: "0 -4px 25px #0002, 0 2px 8px #ccc1",
                      display: "flex",
                      flexDirection: "column",
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Caption (IG-style) */}
                    <div style={{
                      borderBottom: "1px solid #efefef",
                      fontSize: 14, lineHeight: 1.45,
                      padding: "14px 18px", color: "#222"
                    }}>
                      <span style={{
                        fontWeight: 600, color: "#151b3a", marginRight: 6
                      }}>
                        {v.author || "anonymous"}
                      </span>
                      {v.caption}
                    </div>
                    {/* Comments - list all as in your code */}
                    <div style={{ flex: 1, overflowY: "auto" }}>
                      {(v.comments || []).map((c, ci) => (
                        <div key={ci} style={{
                          display: "flex", padding: "12px 16px", borderBottom: "1px solid #efefef"
                        }}>
                          {/* No avatars as per your HTML. Add if needed */}
                          <div style={{ flex: 1 }}>
                            <span style={{
                              fontWeight: 600, fontSize: 14, marginRight: 5, color: "#151b3a"
                            }}>
                              {c.name}
                            </span>
                            <span style={{
                              fontSize: 14, color: "#242526"
                            }}>
                              {c.text}
                            </span>
                            {/* IG comment time/Reply/Like row */}
                            <div style={{
                              color: "#8e8e8e", fontSize: 12, marginTop: 5,
                              display: "flex", alignItems: "center", gap: 18
                            }}>
                              <span>2h ago</span>
                              <span style={{ cursor: 'pointer' }}>Reply</span>
                              <span style={{ cursor: 'pointer' }}>Like</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Add Comment bar (Instagram style) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      borderTop: '1px solid #efefef',
                      background: '#fff'
                    }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[filename] || ""}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: 14,
                          padding: "9px 0",
                          marginRight: 6
                        }}
                        onChange={e => setCommentInputs(prev => ({
                          ...prev, [filename]: e.target.value
                        }))}
                        onKeyDown={e => {
                          if (e.key === "Enter" && (commentInputs[filename] || "").trim() !== "") {
                            handleAddComment(idx, filename);
                          }
                        }}
                      />
                      <button
                        className={`post-button${(commentInputs[filename] || "").trim() ? " active" : ""}`}
                        style={{
                          color: "#0095f6",
                          fontWeight: 600,
                          fontSize: 14,
                          background: "none",
                          border: "none",
                          cursor: (commentInputs[filename] || "").trim() ? "pointer" : "not-allowed",
                          opacity: (commentInputs[filename] || "").trim() ? 1 : 0.3,
                          transition: "opacity .14s"
                        }}
                        disabled={!(commentInputs[filename] || "").trim()}
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
