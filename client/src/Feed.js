import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// ICONS (same as before)
function HeartIcon({ filled }) {
  return filled ? (
    <svg viewBox="0 0 24 24" width={36} height={36}><path d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5 10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5c2 0 4.5 1.5 4.5 4.5 0 5-7.5 11.5-7.5 11.5Z" fill="#e11d48" stroke="#e11d48" strokeWidth="2" style={{ filter: "drop-shadow(0 0 16px #e11d4890)" }} /></svg>
  ) : (
    <svg viewBox="0 0 24 24" width={36} height={36} fill="none"><path d="M12 21C12 21 4.5 14.5 4.5 9.5 4.5 6.5 7 5 9 5 10.28 5 12 6.5 12 6.5s1.72-1.5 3-1.5c2 0 4.5 1.5 4.5 4.5 0 5-7.5 11.5-7.5 11.5Z" stroke="#fff" strokeWidth="2" /></svg>
  );
}
function CommentIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff">
      <rect x="3" y="5" width="18" height="12" rx="4" strokeWidth="2" /><path d="M8 21l2-4h4l2 4" strokeWidth="2" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff">
      <path d="M13 5l7 7-7 7" strokeWidth="2" />
      <path d="M5 12h15" strokeWidth="2" />
    </svg>
  );
}

// Like logic
function isLiked(filename) { return localStorage.getItem("like_" + filename) === "1"; }
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
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  // For one-at-a-time comment page
  const [commentPage, setCommentPage] = useState({});

  useEffect(() => {
    axios.get(HOST + "/shorts").then((res) => setShorts(res.data));
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

  // Scroll-snap
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach((entry) => { if (entry.intersectionRatio > maxRatio) { maxRatio = entry.intersectionRatio; visibleIdx = Number(entry.target.dataset.idx); } });
        if (maxRatio > 0.7) setCurrentIdx(visibleIdx);
      },
      { threshold: [0, 0.5, 0.7, 1] }
    );
    wrapperRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length]);

  function handleLike(idx, filename) {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));

    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev =>
          prev.map((v, i) =>
            i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v
          )
        );
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
    } else {
      setShorts(prev =>
        prev.map((v, i) =>
          i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v
        )
      );
      setLiked(filename, false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }

  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: e => {
        setTimeout(() => {
          if (e.detail === 1) {
            const vid = videoRefs.current[idx];
            if (vid) vid.paused ? vid.play() : vid.pause();
          }
        }, 275);
      },
      onDoubleClick: () => handleLike(idx, filename),
      onTouchEnd: () => {
        let now = Date.now();
        let vid = videoRefs.current[idx];
        if (!vid) return;
        let last = vid.__lastTapTime || 0;
        vid.__lastTapTime = now;
        if (now - last < 350) {
          clearTimeout(tapTimeout);
          handleLike(idx, filename);
        } else {
          tapTimeout = setTimeout(() => {
            if (Date.now() - vid.__lastTapTime >= 350) {
              if (vid.paused) vid.play();
              else vid.pause();
            }
          }, 360);
        }
      }
    };
  }

  // Seek
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
        setShorts((prev) =>
          prev.map((v, i) =>
            i === idx
              ? { ...v, comments: [...(v.comments || []), { name: "Anonymous", text }] }
              : v
          )
        );
        setCommentInputs((prev) => ({ ...prev, [filename]: "" }));
        setCommentPage(p => ({ ...p, [filename]: (v.comments ? (v.comments.length) : 0) })); // advance to new last page
      });
  }

  // For Comments modal: only show one at a time
  function renderSingleComment(v, filename) {
    const page = commentPage[filename] || 0;
    const total = (v.comments || []).length || 0;
    if (total === 0) {
      return <div style={{ color: "#ccc", fontSize: 15 }}>No comments yet.</div>;
    }
    const comment = v.comments[page] || {};
    return (
      <>
        <div style={{
          margin: "14px 0 8px",
          fontSize: 16,
          minHeight: 28
        }}>
          <b style={{ color: "#9fd1ff" }}>{comment.name}</b>{" "}
          <span style={{ color: "#fff" }}>{comment.text}</span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          margin: "14px 0 0 0",
        }}>
          <button
            style={{
              background: "#23243f",
              color: page > 0 ? "#2983fe" : "#7daefc",
              border: "none",
              borderRadius: 18,
              padding: "7px 16px",
              fontWeight: 700,
              fontSize: 16,
              cursor: page > 0 ? "pointer" : "not-allowed",
              opacity: page > 0 ? 1 : 0.6
            }}
            disabled={page === 0}
            onClick={() => setCommentPage(p => ({ ...p, [filename]: page - 1 }))}
          >Prev</button>
          <span style={{ color: "#fff", fontSize: 15 }}>{page + 1}/{total}</span>
          <button
            style={{
              background: "#23243f",
              color: page < total - 1 ? "#2983fe" : "#7daefc",
              border: "none",
              borderRadius: 18,
              padding: "7px 16px",
              fontWeight: 700,
              fontSize: 16,
              cursor: page < total - 1 ? "pointer" : "not-allowed",
              opacity: page < total - 1 ? 1 : 0.6
            }}
            disabled={page >= total - 1}
            onClick={() => setCommentPage(p => ({ ...p, [filename]: page + 1 }))}
          >Next</button>
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        background: "#000",
        margin: 0,
        padding: 0,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          margin: 0,
          padding: 0,
          background: "#000",
        }}
      >
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
                width: "100vw",
                height: "100dvh",
                scrollSnapAlign: "start",
                position: "relative",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
                overflow: "hidden"
              }}
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: "100vw",
                  height: "100dvh",
                  objectFit: "contain",
                  background: "#000",
                  cursor: "pointer",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  touchAction: "manipulation"
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />
              {/* Seekable progress bar */}
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
                  touchAction: "none"
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
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Like/Comment/Share vertical stack */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 28,
                  zIndex: 10,
                  userSelect: "none",
                  pointerEvents: "auto",
                }}
              >
                <button style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  filter: liked ? "drop-shadow(0 0 12px #e11d4880)" : "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                  onClick={() => handleLike(idx, filename)}
                  tabIndex={-1}
                >
                  <HeartIcon filled={liked} />
                  <div style={{
                    fontSize: 16,
                    marginTop: 2,
                    color: liked ? "#e11d48" : "#fff",
                    fontWeight: liked ? 700 : 400,
                    textShadow: liked ? "0 0 8px #e11d4890" : "none"
                  }}>{v.likes || 0}</div>
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    setShowComments(cur => ({
                      ...cur, [filename]: !cur[filename]
                    }))
                  }
                  tabIndex={-1}
                >
                  <CommentIcon />
                  <span style={{ fontSize: 15, marginTop: 1 }}>
                    {(v.comments && v.comments.length) || 0}
                  </span>
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 28,
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    const url = window.location.origin + "/?v=" + filename;
                    if (navigator.share) {
                      navigator.share({ url, title: "Watch this short!" });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  tabIndex={-1}
                ><ShareIcon /></button>
              </div>

              {/* Caption/author/comments preview */}
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
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setShowComments(cur => ({ ...cur, [filename]: true }))
                  }
                >View all {v.comments ? v.comments.length : 0} comments</div>
              </div>

              {/* Comments modal with ONE comment at a time */}
              {showComments[filename] && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 200,
                    background: "#000b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                  onClick={() =>
                    setShowComments(cur => ({
                      ...cur, [filename]: false
                    }))
                  }
                >
                  <div
                    style={{
                      background: "#23243f",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      maxHeight: "60vh",
                      minHeight: 190,
                      width: "100%",
                      overflowY: "auto",
                      boxShadow: "0 -4px 24px #000a",
                      padding: "14px 8px 8dvh 8px",
                      position: 'relative',
                      bottom: 0,
                      left: 0,
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{
                      fontWeight: 600,
                      fontSize: 19,
                      marginBottom: 6,
                      color: "#aee0ff",
                      paddingLeft: 14,
                      paddingTop: 2,
                    }}>Comments</div>
                    <div
                      style={{
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {renderSingleComment(v, filename)}
                    </div>
                    {/* Modern floating input comment bar */}
                    <div
                      style={{
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 200,
                        background: "#202030",
                        display: "flex",
                        alignItems: "center",
                        padding: "14px 10px 18px 10px",
                        gap: 10,
                        borderRadius: 14,
                        boxShadow: "0 2px 18px #0008",
                        width: "99%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxWidth: 520,
                        marginTop: 16,
                      }}
                    >
                      <input
                        value={commentInputs[filename] || ""}
                        onChange={e =>
                          setCommentInputs(prev => ({
                            ...prev,
                            [filename]: e.target.value
                          }))
                        }
                        placeholder="Add a comment…"
                        style={{
                          flex: 1,
                          border: "none",
                          borderRadius: 22,
                          fontSize: 18,
                          padding: "15px 16px",
                          outline: "none",
                          background: "#181b29",
                          color: "#fff",
                          boxShadow: "0 1px 3px #0003",
                        }}
                        onKeyDown={e => { if (e.key === "Enter") handleAddComment(idx, filename); }}
                        inputMode="text"
                        autoComplete="off"
                        autoCorrect="on"
                      />
                      <button
                        style={{
                          background: commentInputs[filename]?.trim()
                            ? "#2983fe"
                            : "#7daefc",
                          color: "#fff",
                          border: "none",
                          borderRadius: 22,
                          padding: "13px 22px",
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: commentInputs[filename]?.trim()
                            ? "pointer"
                            : "not-allowed",
                          boxShadow: commentInputs[filename]?.trim()
                            ? "0 1px 5px #2983fe44"
                            : "none",
                          transition: "background .15s"
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
