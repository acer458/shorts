import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";
const FONT_FAMILY = "'Inter','Roboto','SF Pro','Segoe UI',Arial,sans-serif";

// SVG and Utilities
const HeartSVG = ({ filled, size = 22 }) => (
  <svg aria-label={filled ? "Unlike" : "Like"} height={size} width={size} viewBox="0 0 48 48">
    <path
      fill={filled ? "#ed4956" : "none"}
      stroke={filled ? "#ed4956" : "#fff"}
      strokeWidth="3"
      d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
    />
  </svg>
);
const PauseIcon = () => (
  <svg width={60} height={60} viewBox="0 0 82 82">
    <circle cx="41" cy="41" r="40" fill="#000A" />
    <rect x="26" y="20" width="10" height="42" rx="3" fill="#fff" />
    <rect x="46" y="20" width="10" height="42" rx="3" fill="#fff" />
  </svg>
);
const MuteMicIcon = ({ muted }) =>
  muted ? (
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

const shuffleArray = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const truncateString = (str, maxLen = 90) => (!str || str.length <= maxLen) ? str : (str.substring(0, str.indexOf(" ", maxLen) === -1 ? str.length : str.indexOf(" ", maxLen)) + '…');

const COMMENT_LIKES_KEY = "shorts_comment_likes_v2";
const COMMENT_REPLIES_KEY = "shorts_comment_replies_v2";
const getCommentLikes = () => { try { return JSON.parse(localStorage.getItem(COMMENT_LIKES_KEY) || "{}"); } catch { return {}; } };
const setCommentLikes = obj => localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify(obj));
const getCommentReplies = () => { try { return JSON.parse(localStorage.getItem(COMMENT_REPLIES_KEY) || "{}"); } catch { return {}; } };
const setCommentReplies = obj => localStorage.setItem(COMMENT_REPLIES_KEY, JSON.stringify(obj));

const fakeAvatar = i => [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/63.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
  "https://randomuser.me/api/portraits/men/18.jpg"
][i % 5];
const fakeTime = i => ["2h ago", "1h ago", "45m ago", "30m ago", "15m ago", "Just now"][i % 6];

const SkeletonShort = () => (
  <div style={{ width: "100vw", height: "100dvh", scrollSnapAlign: "start", background: "#16181f", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: "110px", height: "17px", borderRadius: "7px", background: "#21243a" }} />
  </div>
);

function Comment({ uniqueId, comment, onReply, showReplyInput, replyVal, onReplyInput, onReplySend, refreshFeed }) {
  const [liked, setLiked] = useState(() => !!getCommentLikes()[uniqueId]);
  const [likeCount, setLikeCount] = useState(() => getCommentLikes()[uniqueId] || 0);
  const [replies, setReplies] = useState(() => getCommentReplies()[uniqueId] || []);
  useEffect(() => { setLiked(!!getCommentLikes()[uniqueId]); setLikeCount(getCommentLikes()[uniqueId] || 0); setReplies(getCommentReplies()[uniqueId] || []); }, [refreshFeed, uniqueId]);
  const handleLike = () => {
    let stored = getCommentLikes();
    stored[uniqueId] = !liked ? (stored[uniqueId] || 0) + 1 : Math.max(0, (stored[uniqueId] || 1) - 1);
    setCommentLikes(stored); setLiked(!liked); setLikeCount(stored[uniqueId]);
  };
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 15 }}>
      <img src={comment.avatar} alt="avatar" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover", border: "1.2px solid #232b37" }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>{comment.name}</span>{" "}
        <span style={{ color: "#f0f3fa", fontSize: 15 }}>{comment.text}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <span style={{ fontSize: 13, color: "#a6aed4" }}>{comment.time}</span>
          <span style={{ fontSize: 14, color: "#4da6ff", cursor: "pointer" }} tabIndex={0} onClick={() => onReply(uniqueId)}>Reply</span>
          <button aria-label={liked ? "Unlike" : "Like"} onClick={handleLike} style={{ background: "none", border: "none", marginLeft: 2 }}>
            <HeartSVG filled={liked} size={22} />
            {likeCount > 0 && <span style={{ fontSize: 13, marginLeft: 3, color: liked ? "#ed4956" : "#bbb" }}>{likeCount}</span>}
          </button>
        </div>
        {replies.map((reply, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
            <img src={reply.avatar} width={22} height={22} alt="avatar" style={{ borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#7dd3fc" }}>{reply.name}</span>{" "}
              <span style={{ fontSize: 13.6, color: "#eaf6fb" }}>{reply.text}</span>
            </div>
          </div>
        ))}
        {showReplyInput && (
          <form style={{ marginTop: 8 }} onSubmit={e => { e.preventDefault(); onReplySend(uniqueId); }}>
            <input type="text" autoFocus value={replyVal} placeholder={`Reply to ${comment.name}...`} maxLength={120}
              style={{ fontSize: 14, padding: "7px 13px", borderRadius: 18, border: "1.2px solid #40495a", background: "#192028", color: "#fff", width: "70%" }}
              onChange={e => onReplyInput(e.target.value)} />
            <button type="submit" style={{ color: "#2e91fc", background: "none", border: "none", fontWeight: 600, fontSize: 14, marginLeft: 8 }}>Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Feed() {
  const [shorts, setShorts] = useState([]), [loading, setLoading] = useState(true);
  const videoRefs = useRef([]), wrapperRefs = useRef([]), [currentIdx, setCurrentIdx] = useState(0);
  const [muted, setMuted] = useState(true), [mutePulse, setMutePulse] = useState(false), [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState(null), [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({}), [showPause, setShowPause] = useState(false), [showPulseHeart, setShowPulseHeart] = useState(false), [expandedCaptions, setExpandedCaptions] = useState({});
  const [modalDragY, setModalDragY] = useState(0), [isDraggingModal, setIsDraggingModal] = useState(false), dragStartY = useRef(0);
  const [replyingTo, setReplyingTo] = useState(null), [replyInputs, setReplyInputs] = useState({}), [refreshFeed, setRefreshFeed] = useState(0);

  useEffect(() => { setLoading(true); axios.get(HOST + "/shorts").then(res => setShorts(shuffleArray(res.data))).finally(() => setLoading(false)); }, []);
  useEffect(() => { videoRefs.current.forEach((vid, idx) => { if (!vid) return; if (idx === currentIdx) { vid.muted = muted; vid.play().catch(() => { }); } else { vid.pause(); vid.currentTime = 0; vid.muted = true; } }); setShowPause(false); setShowPulseHeart(false); }, [currentIdx, muted]);
  useEffect(() => {
    const observer = new window.IntersectionObserver(entries => {
      let maxRatio = 0, visibleIdx = 0;
      entries.forEach(entry => { if (entry.intersectionRatio > maxRatio) { maxRatio = entry.intersectionRatio; visibleIdx = Number(entry.target.dataset.idx); } });
      if (maxRatio > 0.7) setCurrentIdx(visibleIdx);
    }, { threshold: [0, 0.5, 0.7, 1] });
    wrapperRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [shorts.length]);

  const isLiked = filename => localStorage.getItem("like_" + filename) === "1";
  const setLiked = (filename, val) => val ? localStorage.setItem("like_" + filename, "1") : localStorage.removeItem("like_" + filename);
  const handleLike = (idx, filename, wantPulse) => {
    if (likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l => ({ ...l, [filename]: true }));
    if (!liked) {
      axios.post(`${HOST}/shorts/${filename}/like`).then(() => {
        setShorts(prev => prev.map((v, i) => i === idx ? { ...v, likes: (v.likes || 0) + 1 } : v));
        setLiked(filename, true); setLikePending(l => ({ ...l, [filename]: false }));
      });
      if (wantPulse) { setShowPulseHeart(true); setTimeout(() => setShowPulseHeart(false), 700); }
    } else {
      setShorts(prev => prev.map((v, i) => i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v));
      setLiked(filename, false); setLikePending(l => ({ ...l, [filename]: false }));
    }
  };
  const handleVideoEvents = (idx, filename) => {
    let tapTimeout = null; return {
      onClick: () => { tapTimeout = setTimeout(() => { const vid = videoRefs.current[idx]; vid && ((vid.paused) ? (vid.play(), setShowPause(false)) : (vid.pause(), setShowPause(true))); }, 240); },
      onDoubleClick: () => { tapTimeout && (clearTimeout(tapTimeout), tapTimeout = null); !isLiked(filename) && handleLike(idx, filename, true); setShowPulseHeart(true); setTimeout(() => setShowPulseHeart(false), 700); }
    };
  };
  const handleSeek = (idx, e, isTouch) => {
    let clientX = isTouch ? (e.touches && e.touches[0].clientX) : e.clientX;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const vid = videoRefs.current[idx];
    if (vid?.duration && isFinite(vid.duration)) vid.currentTime = Math.max(0, Math.min(percent, 1)) * vid.duration;
  };
  const handleTimeUpdate = (idx, filename) => {
    const vid = videoRefs.current[idx];
    setVideoProgress(prev => ({ ...prev, [filename]: vid?.duration && isFinite(vid.duration) ? vid.currentTime / vid.duration : 0 }));
  };
  const handleAddComment = (idx, filename) => {
    const text = (commentInputs[filename] || "").trim();
    if (!text) return;
    axios.post(`${HOST}/shorts/${filename}/comment`, { name: "You", text }).then(() => {
      setShorts(prev => prev.map((v, i) => i === idx ? { ...v, comments: [...(v.comments || []), { name: "You", text }] } : v));
      setCommentInputs(prev => ({ ...prev, [filename]: "" }));
    });
  };
  const getProfilePic = v => v.avatar || v.profilePic || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
  const handleModalTouchStart = e => { if (e.touches?.length !== 1) return; dragStartY.current = e.touches[0].clientY; setIsDraggingModal(true); };
  const handleModalTouchMove = e => { if (!isDraggingModal || !e.touches?.length) return; const dy = e.touches[0].clientY - dragStartY.current; if (dy > 0) setModalDragY(dy); };
  const handleModalTouchEnd = () => { setIsDraggingModal(false); if (modalDragY > 65) setShowComments(null); setModalDragY(0); };

  // Comment/Reply logic
  const handleReplyOpen = uniqueId => setReplyingTo(uniqueId);
  const handleReplyInput = (uniqueId, value) => setReplyInputs(q => ({ ...q, [uniqueId]: value }));
  const handleReplySend = uniqueId => {
    const val = (replyInputs[uniqueId] || '').trim();
    if (!val) return;
    let allReplies = getCommentReplies();
    let arr = allReplies[uniqueId] || [];
    arr.push({ name: "You", text: val, avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=YOU_REPLY", time: "Just now" });
    allReplies[uniqueId] = arr;
    setCommentReplies(allReplies);
    setReplyInputs(q => ({ ...q, [uniqueId]: "" })); setReplyingTo(null);
    setTimeout(() => setRefreshFeed(Date.now()), 80);
  };
  const handleCaptionExpand = filename => setExpandedCaptions(prev => ({ ...prev, [filename]: !prev[filename] }));

  return (
    <div style={{ minHeight: "100dvh", width: "100vw", background: "#000" }}>
      <div style={{ width: "100vw", height: "100dvh", overflowY: "scroll", scrollSnapType: "y mandatory", background: "#000" }}>
        {loading && (Array.from({ length: 2 }).map((_, idx) => <SkeletonShort key={idx} />))}
        {!loading && shorts.length === 0 && <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20 }}>No shorts yet. Why not be first?</div>}
        {shorts.map((v, idx) => {
          const filename = v.url.split("/").pop(), liked = isLiked(filename), prog = videoProgress[filename] || 0, allComments = (v.comments || []).map((c, i) => ({ ...c, avatar: fakeAvatar(i), time: fakeTime(i) }));
          const caption = v.caption || "", previewLimit = 90, isTruncated = caption.length > previewLimit, showFull = expandedCaptions[filename], displayedCaption = !caption ? "" : showFull ? caption : truncateString(caption, previewLimit), isCurrent = idx === currentIdx;
          return (
            <div key={idx} data-idx={idx} ref={el => wrapperRefs.current[idx] = el} style={{ width: "100vw", height: "100dvh", scrollSnapAlign: "start", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <video ref={el => videoRefs.current[idx] = el} src={HOST + v.url} loop playsInline style={{ width: "100vw", height: "100dvh", objectFit: "contain", background: "#000" }} {...handleVideoEvents(idx, filename)} onTimeUpdate={() => handleTimeUpdate(idx, filename)} controls={false} tabIndex={-1} preload="auto" />
              {isCurrent && (
                <button onClick={e => { e.stopPropagation(); setMuted(m => !m); setMutePulse(true); setTimeout(() => setMutePulse(false), 350); }} aria-label={muted ? "Unmute" : "Mute"} style={{ position: "absolute", top: 20, right: 20, zIndex: 60, background: "rgba(28,29,34,0.65)", border: "none", borderRadius: 16, width: 39, height: 39, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MuteMicIcon muted={muted} />
                </button>
              )}
              {isCurrent && showPause && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 105, background: 'rgba(0,0,0,0.26)' }}>
                  <PauseIcon />
                </div>
              )}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(255,255,255,0.18)", zIndex: 32 }} onClick={e => handleSeek(idx, e, false)} onTouchStart={e => handleSeek(idx, e, true)}>
                <div style={{ width: `${Math.min(prog * 100, 100)}%`, height: "100%", background: "rgb(42,131,254)" }} />
              </div>
              <div style={{ position: 'absolute', right: '12px', bottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 10 }}>
                <div style={{ marginBottom: 6, width: 48, height: 48, borderRadius: "50%", overflow: "hidden" }}>
                  <img src={getProfilePic(v)} alt="user pic" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={e => { e.stopPropagation(); liked ? handleLike(idx, filename, false) : handleLike(idx, filename, true); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><HeartSVG filled={liked} /></button>
                  <span style={{ color: liked ? '#ed4956' : '#fff', fontSize: '13px', marginTop: '4px' }}>{v.likes || 0}</span>
                </div>
                <div>
                  <button onClick={e => { e.stopPropagation(); setShowComments(filename); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>{v.comments?.length || 0}</span>
                </div>
                <div>
                  <button onClick={() => { const url = window.location.origin + "/?v=" + filename; if (navigator.share) navigator.share({ url, title: "Watch this short!" }); else { navigator.clipboard.writeText(url); let snackbar = document.createElement('div'); snackbar.innerText = "Link copied!"; Object.assign(snackbar.style, { position: "fixed", bottom: "72px", left: "50%", transform: "translateX(-50%)", background: "#202b", color: "#fff", borderRadius: "12px", padding: "7px 19px", fontSize: "14px", zIndex: "99999", fontFamily: FONT_FAMILY, transition: "opacity 0.22s" }); document.body.appendChild(snackbar); setTimeout(() => { snackbar.style.opacity = "0"; }, 1200); setTimeout(() => { document.body.removeChild(snackbar); }, 1750); } }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083" /><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                  <span style={{ color: '#fff', fontSize: '13px', marginTop: '4px' }}>Share</span>
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg,#000e 88%,transparent 100%)", color: "#fff", padding: "20px 18px 28px 18px", zIndex: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>@{v.author || "anonymous"}</div>
                {caption && (
                  <div style={{ display: "flex", alignItems: "flex-end", minHeight: 26, maxWidth: 500 }}>
                    <div style={{ fontWeight: 400, fontSize: 16, color: "#fff", lineHeight: 1.4, maxHeight: showFull ? "none" : "2.8em", overflow: showFull ? "visible" : "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: showFull ? "unset" : 2, WebkitBoxOrient: "vertical", wordBreak: "break-word", marginRight: isTruncated ? 10 : 0, whiteSpace: "pre-line" }}>{displayedCaption}</div>
                    {isTruncated && (<button style={{ background: "none", border: "none", color: "#33b6ff", fontWeight: 600, fontSize: 15, cursor: "pointer", marginLeft: 2, padding: 0, textDecoration: "underline" }} onClick={() => handleCaptionExpand(filename)} tabIndex={0}>{showFull ? "less" : "more"}</button>)}
                  </div>
                )}
                {v.comments && v.comments.length > 0 && (<div style={{ fontSize: 14, color: "#bae6fd" }}>{v.comments[0].name === "You" ? v.comments[0].text : <><b>{v.comments[0].name}:</b> {v.comments[0].text}</>}</div>)}
                <div style={{ color: "#b2bec3", fontSize: 15, marginTop: 3, cursor: "pointer" }} onClick={() => setShowComments(filename)}>View all {v.comments ? v.comments.length : 0} comments</div>
              </div>
              {showComments === filename &&
                <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.91)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={() => setShowComments(null)}>
                  <div style={{ backgroundColor: "#000", borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 15, minHeight: '36vh', height: '70vh', display: 'flex', flexDirection: 'column', maxWidth: 500, width: "97vw", margin: "0 auto", border: '1px solid #262626', touchAction: "none", transition: isDraggingModal ? "none" : "transform 0.22s", transform: modalDragY ? `translateY(${Math.min(modalDragY, 144)}px)` : "translateY(0)" }} onTouchStart={handleModalTouchStart} onTouchMove={handleModalTouchMove} onTouchEnd={handleModalTouchEnd} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid #262626' }}>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Comments</h2>
                      <span style={{ fontSize: 22, color: "#fff", cursor: "pointer" }} onClick={() => setShowComments(null)}>×</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                      {allComments.length === 0 ?
                        <div style={{ color: "#68747b", textAlign: "center", padding: "40px 0", fontWeight: 500, fontSize: 16 }}>No comments yet. Be first!</div>
                        :
                        allComments.map((c, i) => (
                          <Comment key={i} uniqueId={`${filename}_${i}`} comment={c} onReply={handleReplyOpen} showReplyInput={replyingTo === `${filename}_${i}`} replyVal={replyInputs[`${filename}_${i}`] || ''} onReplyInput={v => handleReplyInput(`${filename}_${i}`, v)} onReplySend={handleReplySend} refreshFeed={refreshFeed} />
                        ))
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #262626' }}>
                      <input
                        type="text"
                        placeholder="Add a comment…"
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
                        onChange={e => setCommentInputs(prev => ({ ...prev, [filename]: e.target.value }))}
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
                      >
                        Post
                      </button>
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
