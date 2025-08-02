import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// --- ICONS ---
function HeartIcon({ filled }) {
  return filled ? (
    <svg aria-label="Unlike" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24">
      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
    </svg>
  ) : (
    <svg aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218z"></path>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
  );
}

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
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => { axios.get(HOST + "/shorts").then(res => setShorts(res.data)); }, []);
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) { vid.muted = false; vid.play().catch(()=>{}); }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
  }, [currentIdx]);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        let maxRatio = 0, visibleIdx = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleIdx = Number(entry.target.dataset.idx);
          }
        });
        if (maxRatio > 0.7) setCurrentIdx(visibleIdx);
      }, { threshold: [0, 0.5, 0.7, 1] }
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

  function handleVideoEvents(idx, filename) {
    let tapTimeout = null;
    return {
      onClick: e => { setTimeout(() => {
        if (e.detail === 1) {
          const vid = videoRefs.current[idx];
          if (vid) vid.paused ? vid.play() : vid.pause();
        }
      }, 275); },
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

  return (
    <div className="instagram-reels-container">
      <div className="reels-feed">
        {shorts.length === 0 && (
          <div className="no-shorts-message">No shorts uploaded yet.</div>
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
              className="reel-container"
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                className="reel-video"
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />
              
              {/* Progress bar */}
              <div
                className="video-progress-container"
                onClick={e => handleSeek(idx, e, false)}
                onTouchStart={e => handleSeek(idx, e, true)}
              >
                <div
                  className="video-progress-bar"
                  style={{ width: `${Math.min(prog * 100, 100)}%` }}
                />
              </div>
              
              {/* Right action buttons */}
              <div className="reel-actions">
                {/* Like */}
                <div className="action-button">
                  <button onClick={() => handleLike(idx, filename)} className="action-icon">
                    <HeartIcon filled={liked} />
                  </button>
                  <span className="action-count">{v.likes || 0}</span>
                </div>
                
                {/* Comment */}
                <div className="action-button">
                  <button onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))} className="action-icon">
                    <CommentIcon />
                  </button>
                  <span className="action-count">{(v.comments && v.comments.length) || 0}</span>
                </div>
                
                {/* Share */}
                <div className="action-button">
                  <button 
                    onClick={() => {
                      const url = window.location.origin + "/?v=" + filename;
                      if (navigator.share) {
                        navigator.share({ url, title: "Watch this short!" });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                      }
                    }} 
                    className="action-icon"
                  >
                    <ShareIcon />
                  </button>
                  <span className="action-count">Share</span>
                </div>
              </div>
              
              {/* Bottom info section */}
              <div className="reel-info">
                <div className="author-info">
                  <div className="author-avatar">
                    <img 
                      src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anon")}`} 
                      alt="avatar"
                    />
                  </div>
                  <span className="author-username">@{v.author || "anonymous"}</span>
                </div>
                <div className="reel-caption">{v.caption}</div>
                {v.comments && v.comments.length > 0 && (
                  <div className="comment-preview">
                    <span className="comment-username">{v.comments[0].name}:</span> {v.comments[0].text}
                  </div>
                )}
                <div 
                  className="view-comments"
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                >
                  View all {v.comments ? v.comments.length : 0} comments
                </div>
              </div>
              
              {/* COMMENTS MODAL */}
              {showComments[filename] && (
                <div 
                  className="comments-modal-overlay"
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: false }))}
                >
                  <div 
                    className="comments-modal"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="comments-header">
                      <span>Comments</span>
                      <button 
                        onClick={() => setShowComments(cur => ({ ...cur, [filename]: false }))}
                        className="close-button"
                      >
                        <svg aria-label="Close" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                          <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                          <polyline fill="none" points="20.649 20.649 12 12 3.354 3.354" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="comments-list">
                      {(v.comments || []).length === 0 && (
                        <div className="no-comments">No comments yet.</div>
                      )}
                      {(v.comments || []).map((comment, ci) => (
                        <div key={ci} className="comment-item">
                          <div className="comment-avatar">
                            <img 
                              src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(comment.name || "anon")}`} 
                              alt="avatar"
                            />
                          </div>
                          <div className="comment-content">
                            <span className="comment-username">{comment.name}</span>
                            <span className="comment-text">{comment.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="comment-input-container">
                      <input
                        value={commentInputs[filename] || ""}
                        onChange={e =>
                          setCommentInputs(prev => ({ ...prev, [filename]: e.target.value }))
                        }
                        placeholder="Add a comment..."
                        className="comment-input"
                        onKeyDown={e => { if (e.key === "Enter") handleAddComment(idx, filename); }}
                      />
                      <button
                        className={`post-comment ${commentInputs[filename]?.trim() ? "active" : ""}`}
                        disabled={!commentInputs[filename]?.trim()}
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
        })}
      </div>
    </div>
  );
}
