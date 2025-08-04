import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const HOST = "https://shorts-t2dk.onrender.com";

// --- Font, Styles, Anti-inspect injection ONCE
if (!window.__FEED_ROOT_STYLES__) {
  window.__FEED_ROOT_STYLES__ = true;
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap";
  document.head.appendChild(fontLink);
  const style = document.createElement("style");
  style.innerHTML = `
    html, body, #root, #app, #__next {
      font-family: 'Inter', Arial, sans-serif !important;
      background: #090b10;
    }
    * { font-family: inherit !important; }
    .feed-btn-anim:active, .feed-btn-anim:focus { transform: scale(.97); }
  `;
  document.head.appendChild(style);
  window.addEventListener("contextmenu", e => e.preventDefault(), true);
  window.addEventListener("keydown", e => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && ["U"].includes(e.key.toUpperCase()))
    ) { e.preventDefault(); e.stopPropagation(); return false; }
    if ((e.metaKey && e.altKey && ["I", "J"].includes(e.key.toUpperCase()))) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") { e.preventDefault(); return false; }
    return undefined;
  }, true);
}

function HeartSVG({ filled, size = 25 }) {
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
function DoubleTapHeart({ visible, x, y }) {
  return visible ? (
    <div
      style={{
        pointerEvents:"none", position:"fixed",
        left: x, top: y, zIndex:200,
        transform: "translate(-50%, -50%)",
        opacity: 1,
        animation: "doubleHeartScale .66s cubic-bezier(.1,1.4,.28,1) forwards"
      }}
    >
      <svg viewBox="0 0 96 96" width={86} height={86}>
        <path
          d="M48 86C48 86 12 60 12 32.5 12 18.8 24.5 10 36 10c6.2 0 11.9 3.3 12 3.3S53.8 10 60 10c11.5 0 24 8.8 24 22.5C84 60 48 86 48 86Z"
          fill="#ed4956"
          stroke="#ed4956"
          strokeWidth="7"
        />
      </svg>
      <style>
        {`
        @keyframes doubleHeartScale {
          0% { opacity: 0; transform:translate(-50%,-50%) scale(.48);}
          6% { opacity: 1; transform:translate(-50%,-60%) scale(1.3);}
          46% { opacity:1; transform:translate(-50%,-50%) scale(1);}
          80%{ opacity:.92; }
          100%{ opacity:0;transform:translate(-50%,-50%) scale(0.8);}
        }
        `}
      </style>
    </div>
  ) : null;
}
function PauseOverlay({ visible }) {
  return visible ? (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 110, background: 'rgba(0,0,0,.14)', pointerEvents: "none",
      animation:"pauseFadeIn .28s"
    }}>
      <PauseIcon />
      <style>{`
        @keyframes pauseFadeIn { from {opacity:0; transform:scale(.92);} to {opacity:1; transform:scale(1);} }
      `}</style>
    </div>
  ) : null;
}
function ContinueOverlay({ onContinue }) {
  return (
    <div className="overlay" style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99,
      pointerEvents: "auto",
      background: "rgba(0,0,0,0.0)"
    }}>
      <div className="continue-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          minWidth: 260,
          minHeight: 92,
          background: "rgba(30,30,38,0.44)",
          borderRadius: 16,
          boxShadow: "0 8px 32px 0 rgba(12,16,30,0.21), 0 1.5px 11px #0004",
          backdropFilter: "blur(14px) saturate(160%)",
          border: "1.6px solid rgba(80,80,86,0.16)",
          padding: "24px 26px 18px 26px",
          animation: "glassRise .36s cubic-bezier(.61,2,.22,1.02)"
        }}>
        <span className="continue-title"
          style={{
            color: "#fff",
            fontSize: "1.11rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            marginBottom: 6,
            fontFamily: "inherit"
          }}>
          Continue watching?
        </span>
        <button className="feed-btn-anim"
          style={{
            background: "rgba(0,0,0, 0.30)",
            color: "#fff",
            fontFamily: "inherit",
            padding: "8px 28px",
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: 12,
            border: "1.1px solid rgba(255,255,255,0.085)",
            boxShadow: "0 1.5px 8px #0004",
            outline: "none",
            marginTop: 3,
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.18s, border 0.14s, box-shadow .16s, transform .1s",
            backdropFilter: "blur(4.5px)"
          }}
          onClick={onContinue}
        >Continue</button>
        <style>{`
          @keyframes glassRise { from { opacity: 0; transform: translateY(60px) scale(1.07);} to   { opacity: 1; transform: translateY(0) scale(1);} }
          .continue-btn:active { transform:scale(0.984);}
        `}</style>
      </div>
    </div>
  );
}
function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw", height: "100dvh",
        scrollSnapAlign: "start",
        position: "relative",
        background: "#161618"
      }}>
      <div style={{
        width: "100vw", height: "100dvh",
        background: "linear-gradient(90deg,#191a22 0%, #24263c 100%)",
        animation: "skelAnim 1.3s infinite linear", position: "absolute", top: 0, left: 0, zIndex: 1
      }}/>
      <style>{`@keyframes skelAnim { 0% { filter:brightness(1); } 55% { filter: brightness(1.07); } 100% { filter:brightness(1);} }`}</style>
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
function shuffleArray(arr) { const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a; }
function fakeAvatar(i) { const urls = [
  "https://randomuser.me/api/portraits/men/32.jpg","https://randomuser.me/api/portraits/women/63.jpg","https://randomuser.me/api/portraits/men/75.jpg","https://randomuser.me/api/portraits/women/22.jpg","https://randomuser.me/api/portraits/men/18.jpg"
]; return urls[i % urls.length]; }
function fakeTime(i) { return ["2h ago","1h ago","45m ago","30m ago","15m ago","Just now"][i % 6] || "Just now"; }
function getProfilePic(v) {return v.avatar || v.profilePic || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author||"anonymous")}`; }
function commentLikeKey(fname, i) { return `commentlike_${fname}_${i}`; }
function commentReplyKey(fname, i) { return `commentreply_${fname}_${i}`; }

// === MAIN FEED COMPONENT ===
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
  const [showPauseAnim, setShowPauseAnim] = useState(false);
  // continue overlay
  const [playCounts, setPlayCounts] = useState({});
  const [blockPlayback, setBlockPlayback] = useState({});
  const playEndTimestamps = useRef({});

  // double tap heart animation
  const [heartAnim, setHeartAnim] = useState({visible:false,x:0,y:0});
  function triggerHeartAnim(e, idx, filename, handleLike) {
    let x = window.innerWidth/2, y=window.innerHeight/2;
    if (e && e.touches && e.touches.length) { x=e.touches[0].clientX;y=e.touches[0].clientY; }
    else if (e && e.clientX!==undefined) { x=e.clientX;y=e.clientY; }
    setHeartAnim({visible:true,x,y});
    setTimeout(()=>setHeartAnim({visible:false,x:0,y:0}),660);
    handleLike(idx, filename, true);
  }

  useEffect(() => {
    setLoading(true); setNotFound(false); setAloneVideo(null); setShorts([]);
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if (filename) {
      axios.get(`${HOST}/shorts/${filename}`)
        .then(res => setAloneVideo({ ...res.data, url: res.data.url || `/shorts/${filename}` }))
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    } else {
      axios.get(HOST + "/shorts").then(res => setShorts(shuffleArray(res.data))).finally(() => setLoading(false));
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
      const fname = shorts[idx]?.url?.split("/").pop();
      if (idx === currentIdx) {
        vid.muted = muted;
        if (!blockPlayback[fname]) vid.play().catch(()=>{});
      } else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPauseAnim(false);
  }, [currentIdx, muted, aloneVideo, blockPlayback, shorts]);

  // Bandwidth-control
  function handleTimeUpdate(idx, filename) {
    const vid = videoRefs.current[idx];
    if (!vid) return;
    setVideoProgress((p) => ({
      ...p,
      [filename]: vid && vid.duration && isFinite(vid.duration)
        ? vid.currentTime / vid.duration : 0,
    }));
    // Play complete: count only once
    if (vid?.duration && vid.duration > 3 && vid.currentTime !== undefined) {
      if (vid.currentTime > vid.duration - 0.15) {
        if (playEndTimestamps.current[filename] !== Math.floor(vid.currentTime)) {
          setPlayCounts(prev => {
            const count = (prev[filename] || 0) + 1;
            if (count >= 3) setBlockPlayback(bp => ({ ...bp, [filename]: true }));
            return { ...prev, [filename]: count };
          });
          playEndTimestamps.current[filename] = Math.floor(vid.currentTime);
        }
      }
    }
  }
  function resetPlayCounterOnSeekOrUser(filename) {
    setPlayCounts(pc => ({...pc, [filename]:0}));
    setBlockPlayback(bp => { const cp = {...bp}; delete cp[filename]; return cp; });
  }
  function handleContinue(filename) {
    setPlayCounts(pc => { const c={...pc}; c[filename]=0; return c; });
    setBlockPlayback(bp => { const c={...bp}; delete c[filename]; return c; });
    let vref = null;
    if (aloneVideo && videoRefs.current[0]) vref = videoRefs.current[0];
    else if (videoRefs.current[currentIdx]) vref = videoRefs.current[currentIdx];
    if (vref) vref.play().catch(()=>{});
  }

  // Like logic/feed
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
        setAloneVideo(prev => prev && prev.url && prev.url.endsWith(filename) ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
        setLiked(filename, true);
        setLikePending(l => ({ ...l, [filename]: false }));
      });
    } else {
      setShorts(prev => prev.map((v, i) =>
        i === idx && (v.likes || 0) > 0 ? { ...v, likes: v.likes - 1 } : v));
      setAloneVideo(prev => prev && prev.url && prev.url.endsWith(filename) && (prev.likes || 0) > 0
        ? { ...prev, likes: prev.likes - 1 } : prev);
      setLiked(filename,false);
      setLikePending(l => ({ ...l, [filename]: false }));
    }
  }

  function handleShare(filename) {
    const url = window.location.origin + "/?v=" + filename;
    if (navigator.share) { navigator.share({ url, title: "Watch this short!" }); }
    else { navigator.clipboard.writeText(url); alert("Link copied!"); }
  }

  // Like/pause/seek/double-tap event logic
  function handleVideoEvents(idx, filename) {
    let clickTimer = null, lastTap = 0;
    return {
      onClick: (e) => {
        e.stopPropagation();
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) {
            vid.play(); setShowPauseAnim(false); setShowPause(false);
          } else {
            vid.pause(); setShowPauseAnim(true); setShowPause(true);
            setTimeout(()=>setShowPauseAnim(false),690);
          }
        }, 180);
        resetPlayCounterOnSeekOrUser(filename);
      },
      onDoubleClick: (e) => {
        e.stopPropagation(); if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        triggerHeartAnim(e, idx, filename, handleLike); resetPlayCounterOnSeekOrUser(filename);
      },
      onTouchStart: (e) => {
        const now = Date.now();
        if (now - lastTap < 350) {
          if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
          lastTap = 0;
          triggerHeartAnim(e, idx, filename, handleLike); resetPlayCounterOnSeekOrUser(filename);
        } else { lastTap = now; }
      },
      onSeeked: ()=> resetPlayCounterOnSeekOrUser(filename)
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
  // ---- expanded captions
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({ ...prev, [filename]: !prev[filename] }));
  };
  // Comments modal drag
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);
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
    setIsDraggingModal(false); if (modalDragY > 65) { setShowComments(null); } setModalDragY(0);
  }
  // Like/reply per comment
  function isCommentLiked(fname, i) { return localStorage.getItem(commentLikeKey(fname, i)) === "1"; }
  function toggleCommentLike(fname, i) {
    const key = commentLikeKey(fname, i);
    if (localStorage.getItem(key) === "1") localStorage.removeItem(key);
    else localStorage.setItem(key, "1");
    setTick(t=>t+1);
  }
  function getRepliesFor(fname, i) {
    try { const jsn = localStorage.getItem(commentReplyKey(fname, i)); if (!jsn) return []; const arr = JSON.parse(jsn); return Array.isArray(arr) ? arr : []; }
    catch { return []; }
  }
  function addReply(fname, i, replyObj) {
    let arr = getRepliesFor(fname, i); arr = [...arr, replyObj];
    localStorage.setItem(commentReplyKey(fname, i), JSON.stringify(arr));
    setCommentInputs(prev => ({ ...prev, [fname + ":" + i]: "" }));
    setActiveReply([null, null]);
    setTick(t=>t+1);
  }
  const [tick, setTick] = useState(0);
  const [activeReply, setActiveReply] = useState([null,null]);
  const showActiveReply = activeReply && activeReply[0] && typeof activeReply[1] === 'number';

  function renderComments({ comments, filename, idx }) {
    return (comments || []).map((c, i) => {
      const liked = isCommentLiked(filename, i);
      const replies = getRepliesFor(filename, i);
      return (
        <div key={i} style={{
          display:'flex',alignItems:'flex-start',marginBottom:18,fontFamily:"inherit",borderRadius:10,position:"relative",paddingBottom:replies.length>0?4:0
        }}>
          <img src={c.avatar || fakeAvatar(i)} style={{width:31,height:31,borderRadius:"50%",marginRight:13,marginTop:2}} alt="avatar"/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontWeight:600,fontSize:14,color:"#fff"}}>{c.name}</span>
                <span style={{fontSize:14,color:"#fff",marginLeft:8}}>{c.text}</span>
              </div>
              <button className="feed-btn-anim" style={{
                background:"none",border:"none",color:liked?"#ed4956":"#bbb",outline:"none",marginLeft:13,
                display:"flex",alignItems:"center",minWidth:30,padding:0,fontWeight:500,
                borderRadius:7,cursor:"pointer",fontSize:"16px",transition:"color .10s"
              }}
                aria-label="Like comment"
                tabIndex={0}
                onClick={() => toggleCommentLike(filename, i)}
                onMouseDown={e => e.preventDefault()}
                onMouseUp={e => e.preventDefault()}
              >
                <HeartSVG filled={liked} size={18}/>
                <span style={{
                  fontWeight:600,color:liked?"#ed4956":"#bebec3",fontSize:14,marginLeft:2
                }}>{Number(isCommentLiked(filename, i))}</span>
              </button>
            </div>
            <div style={{
              display:'flex',alignItems:'center',fontSize:12,color:'#a8a8a8',gap:13,marginTop:2
            }}>
              <span>{c.time || fakeTime(i)}</span>
              <button className="feed-btn-anim"
                style={{
                  cursor:"pointer",color:"#23aae6",fontWeight:600,
                  border:"none",background:"none",borderRadius:6,padding:"2px 10px",fontSize:12,transition:"background .16s",outline:"none"
                }}
                tabIndex={0}
                onClick={() => { setActiveReply([filename,i]); }}
              >Reply</button>
            </div>
            {/* -- Replies -- */}
            {replies.length ? (
              <div style={{
                marginLeft:8,marginTop:10,paddingLeft:10,borderLeft:"1.4px solid #222a39",fontSize:14
              }}>
                {replies.map((r,j)=>
                  <div key={j} style={{marginBottom:8,display:"flex",alignItems:'flex-start',gap:8}}>
                    <img src={r.avatar || fakeAvatar(j+7)} alt="avatar" style={{width:24,height:24,borderRadius:'50%',marginTop:1}} />
                    <div>
                      <span style={{fontWeight:600,color:"#fff",fontSize:13}}>{r.name}</span>
                      <span style={{fontSize:13,color:"#eceffa",marginLeft:6}}>{r.text}</span>
                      <div style={{fontSize:11,color:"#99a6b9",marginTop:1}}>{r.time||"just now"}</div>
                    </div>
                  </div>
                )}
              </div>
            ):null}
            {/* -- Reply input -- */}
            {showActiveReply && activeReply[0]===filename && activeReply[1]===i && (
              <div style={{marginTop:10,marginLeft:0}}>
                <input type="text" placeholder="Write a reply…"
                  style={{
                    width:"75%",background:"#23263a",border:"none",borderRadius:20,
                    padding:"8px 15px",color:"#fff",fontSize:14,marginRight:7
                  }}
                  value={commentInputs[filename+":"+i]||""}
                  autoFocus
                  onChange={e=>setCommentInputs(prev=>({...prev,[filename+":"+i]:e.target.value}))}
                  onKeyDown={e=>
                    e.key==="Enter"&&(commentInputs[filename+":"+i]||"").trim()!==""&&(()=>addReply(filename,i,{name:"You",text:(commentInputs[filename+":"+i]||"").trim(),time:"Just now",avatar:fakeAvatar(2)}))()
                  }
                />
                <button className="feed-btn-anim" style={{
                  color:"#22d1ff",fontWeight:600,fontSize:14,background:"none",border:"none",borderRadius:6,
                  cursor:(commentInputs[filename+":"+i]||"").trim()!==""?"pointer":"not-allowed",opacity:(commentInputs[filename+":"+i]||"").trim()!==""?1:0.55,marginRight:5
                }}
                  disabled={(commentInputs[filename+":"+i]||"").trim()===""}
                  onClick={()=>addReply(filename,i,{name:"You",text:(commentInputs[filename+":"+i]||"").trim(),time:"Just now",avatar:fakeAvatar(2)})}
                >Post</button>
                <button onClick={()=>setActiveReply([null,null])}
                  className="feed-btn-anim"
                  style={{background:'none',border:'none',color:"#a1b3c6",fontSize:12,cursor:'pointer',borderRadius:6}}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  // ---- RENDER LOGIC
  if (notFound) return (<div style={{color:"#e26666",textAlign:"center",marginTop:150,fontSize:22}}>Video not found.<br/><button onClick={()=>navigate("/",{replace:true})} style={{marginTop:18,fontWeight:600,fontSize:17,padding:"8px 28px",borderRadius:12,background:"#1c45f7",color:"#fff",border:"none",cursor:"pointer"}}>Back to Feed</button></div>);
  if (loading) return <>{Array.from({ length: 2 }).map((_, idx) => <SkeletonShort key={idx}/>)}</>;

  // --- Single video mode
  if (aloneVideo) {
    const v = aloneVideo;
    const filename = (v.url||"").split("/").pop();
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

    return (
      <div style={{
        width: "100vw", height: "100dvh", background: "#101114",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", fontFamily: "inherit"
      }}>
        <DoubleTapHeart {...heartAnim}/>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="feed-btn-anim"
          style={{
            position: "absolute", top: 20, left: 16, zIndex: 100,
            background: "#222f", color: "#fff", fontWeight: 600, fontSize: 16, padding: "6px 19px",
            borderRadius: 16, border: "none", cursor: "pointer", fontFamily:'inherit'
          }}>
          ← Feed
        </button>
        <video
          ref={el => (videoRefs.current[0] = el)}
          src={HOST + v.url}
          loop playsInline
          style={{
            width: "100vw", height: "100dvh", objectFit: "contain",
            background: "#000", cursor: "pointer", display: "block", fontFamily: "inherit"
          }}
          muted={muted}
          autoPlay
          onTimeUpdate={()=>handleTimeUpdate(0, filename)}
          onSeeked={()=>resetPlayCounterOnSeekOrUser(filename)}
          {...handleVideoEvents(0, filename)}
          onPlay={e => { if (blockPlayback[filename]) { e.target.pause(); } }}
        />
        {blockPlayback[filename] && <ContinueOverlay onContinue={()=>handleContinue(filename)}/>}
        <PauseOverlay visible={showPause&&showPauseAnim}/>
        <button
          onClick={e => { e.stopPropagation(); setMuted(m => !m); setMutePulse(true); setTimeout(() => setMutePulse(false), 350); }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="feed-btn-anim"
          style={{
            position: "absolute", top: 20, right: 20, zIndex: 60,
            background: "rgba(28,29,34,0.65)", border: "none", borderRadius: 16,
            width: 39, height: 39, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 6px #0002", outline: "none"
          }}
        ><MuteMicIcon muted={muted}/></button>
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: 4, background: "rgba(255,255,255,0.18)", zIndex: 32,
          borderRadius: 2, overflow: "hidden", cursor: "pointer"
        }}
          onClick={e => handleSeek(0, e, false)}
          onTouchStart={e => handleSeek(0, e, true)}>
          <div style={{
            width: `${Math.min(prog * 100, 100)}%`,
            height: "100%",
            background: "rgb(42, 131, 254)",
            transition: "width 0.22s cubic-bezier(.4,1,.5,1)",
            pointerEvents: "none"
          }} />
        </div>
        <div style={{
          position: 'absolute', right: '12px', bottom: '100px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '24px', zIndex: 10
        }}>
          <div style={{
            marginBottom: 6, width: 48, height: 48,
            borderRadius: "50%", overflow: "hidden"
          }}>
            <img src={getProfilePic(v)} alt="dp" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button onClick={e=>{e.stopPropagation();if(!liked)handleLike(0,filename,true);else handleLike(0,filename,false);}}
              className="feed-btn-anim"
              style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
              <HeartSVG filled={liked} size={25}/>
            </button>
            <span style={{color:liked?'#ed4956':'#fff',fontSize:'13px',marginTop:'4px'}}>{v.likes||0}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button onClick={e=>{e.stopPropagation();setShowComments(filename);}}
              className="feed-btn-anim"
              style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
              <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>{v.comments?.length||0}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button
              onClick={()=>handleShare(filename)}
              className="feed-btn-anim"
              style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
              <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>Share</span>
          </div>
        </div>
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
          color: "#fff", padding: "22px 18px 30px 18px", zIndex: 6, display: "flex", flexDirection: "column", userSelect: "none", fontFamily: "inherit"
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>@{v.author || "anonymous"}</div>
          {caption && (
            <div style={{
              display:"flex",alignItems:"flex-end",minHeight:"26px",maxWidth:500
            }}>
              <div style={{
                fontWeight:400,fontSize:16,color:"#fff",lineHeight:1.4,maxHeight:showFull?"none":"2.8em",overflow:showFull?"visible":"hidden",
                textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:showFull?"unset":2,WebkitBoxOrient:"vertical",
                wordBreak:"break-word",marginRight:isTruncated?10:0,whiteSpace:"pre-line"
              }}>{displayedCaption}</div>
              {isTruncated && (
                <button style={{background:"none",border:"none",color:"#33b6ff",fontWeight:600,fontSize:15,cursor:"pointer",
                  marginLeft:2,padding:0,lineHeight:1.3,textDecoration:"underline",transition:"color .15s"}}
                  onClick={()=>handleCaptionExpand(filename)} tabIndex={0}>
                  {showFull ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          <div
            style={{color:"#b2bec3",fontSize:15,marginTop:3,cursor:"pointer",fontWeight:500}}
            onClick={()=>setShowComments(filename)}
          >View all {v.comments?v.comments.length:0} comments</div>
        </div>
        {showComments===filename &&
          <div style={{
            position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.91)",display:"flex",flexDirection:"column",justifyContent:"flex-end",fontFamily:"inherit"
          }} onClick={()=>setShowComments(null)}>
            <div className="comments-modal"
              style={{
                backgroundColor:"#14151d",borderTopLeftRadius:13,borderTopRightRadius:13,padding:15,minHeight:'36vh',height:'70vh',display:'flex',flexDirection:'column',maxWidth:500,
                width:"97vw",margin:"0 auto",border:'1px solid #222',touchAction:"none",
                transition:isDraggingModal?"none":"transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                transform:modalDragY?`translateY(${Math.min(modalDragY,144)}px)`:"translateY(0)"
              }}
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onClick={e=>e.stopPropagation()}>
              <div style={{
                display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:15,borderBottom:'1px solid #262626'
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff",letterSpacing:0.01 }}>Comments</h2>
                <span style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                  onClick={()=>setShowComments(null)}>×</span>
              </div>
              <div style={{ flex:1, overflowY:'auto',padding:'10px 0',fontFamily:"inherit" }}>
                {allComments.length===0 ? (
                  <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0", fontSize:15 }}>No comments yet.</div>
                ) : renderComments({ comments: allComments, filename, idx: 0 })}
              </div>
              <div style={{display:'flex',alignItems:'center',paddingTop:9,borderTop:'1px solid #262626',fontFamily:"inherit"}}>
                <input type="text"
                  placeholder="Add a comment…"
                  style={{ flex:1, backgroundColor:"#23263a",border:"none",borderRadius:20,padding:"10px 15px",color:"white",fontSize:14 }}
                  value={commentInputs[filename]||""}
                  onChange={e=>setCommentInputs(prev=>({...prev,[filename]:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&(commentInputs[filename]||"").trim()!==""&&(()=>(axios.post(`${HOST}/shorts/${filename}/comment`,{name:"You",text:commentInputs[filename].trim()}).then(()=>{setAloneVideo(prev=>prev?{...prev,comments:[...(prev.comments||[]),{name:"You",text:commentInputs[filename].trim()}]}:prev);setCommentInputs(prev=>({...prev,[filename]:""}));})))()}
                />
                <button className="feed-btn-anim"
                  style={{
                    color: "#0095f6", fontWeight: 600, marginLeft: 10, fontSize: 14, background:"none",border:"none",
                    cursor: (commentInputs[filename]||"").trim()!==""?"pointer":"default",opacity:(commentInputs[filename]||"").trim()!==""?1:0.55
                  }}
                  disabled={(commentInputs[filename]||"").trim()===""}
                  onClick={()=>axios.post(`${HOST}/shorts/${filename}/comment`,{name:"You",text:commentInputs[filename].trim()}).then(()=>{setAloneVideo(prev=>prev?{...prev,comments:[...(prev.comments||[]),{name:"You",text:commentInputs[filename].trim()}]}:prev);setCommentInputs(prev=>({...prev,[filename]:""}));})}
                >Post</button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  // -------- FEED MODE --------
  if (!loading && shorts.length === 0) return (
    <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20 }}>No shorts uploaded yet.</div>
  );
  return (
    <div style={{ minHeight: "100dvh", width: "100vw", background: "#090b10", margin: 0, padding: 0, overflow: "hidden",fontFamily:"inherit" }}>
      <DoubleTapHeart {...heartAnim}/>
      <div style={{
        width: "100vw", height: "100dvh",
        overflowY: "scroll", overflowX: "hidden", scrollSnapType: "y mandatory",
        background: "#101114",fontFamily:"inherit"
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
                position: "relative", background: "#101012",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: "inherit"
              }}>
              <video ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop playsInline
                style={{ width: "100vw", height: "100dvh", objectFit: "contain",
                  background: "#111115", cursor: "pointer", display: "block", fontFamily: "inherit"
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={()=>handleTimeUpdate(idx, filename)}
                muted={muted}
                autoPlay
                onSeeked={()=>resetPlayCounterOnSeekOrUser(filename)}
                onPlay={e => { if (blockPlayback[filename]) { e.target.pause(); } }}
              />
              {blockPlayback[filename] && isCurrent && <ContinueOverlay onContinue={()=>handleContinue(filename)}/>}
              {isCurrent&&<PauseOverlay visible={showPause&&showPauseAnim}/>}
              {isCurrent && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setMuted(m => !m);
                    setMutePulse(true);
                    setTimeout(() => setMutePulse(false), 350);
                  }}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="feed-btn-anim"
                  style={{
                    position: "absolute", top: 20, right: 20, zIndex: 60, background: "rgba(28,29,34,0.65)",
                    border: "none", borderRadius: 16, width: 39, height: 39,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 2px 6px #0002", outline: "none"
                  }}
                >
                  <MuteMicIcon muted={muted}/>
                </button>
              )}
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
              <div style={{
                position: 'absolute', right: '12px', bottom: '100px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '24px', zIndex: 10
              }}>
                <div style={{
                  marginBottom: 6, width: 48, height: 48,
                  borderRadius: "50%", overflow: "hidden"
                }}>
                  <img src={getProfilePic(v)} alt="dp" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}} />
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <button onClick={e=>{e.stopPropagation();if(!liked)handleLike(idx,filename,true);else handleLike(idx,filename,false);}}
                    className="feed-btn-anim"
                    style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                    <HeartSVG filled={liked} size={25}/>
                  </button>
                  <span style={{color:liked?'#ed4956':'#fff',fontSize:'13px',marginTop:'4px'}}>{v.likes||0}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <button onClick={e=>{e.stopPropagation();setShowComments(filename);}}
                    className="feed-btn-anim"
                    style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>{v.comments?.length||0}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <button
                    onClick={()=>handleShare(filename)}
                    className="feed-btn-anim"
                    style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                  </button>
                  <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>Share</span>
                </div>
              </div>
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                background: "linear-gradient(0deg,#000e 88%,transparent 100%)",
                color: "#fff", padding: "21px 18px 28px 18px", zIndex: 6,
                display: "flex", flexDirection: "column", userSelect:"none", fontFamily:"inherit"
              }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>@{v.author || "anonymous"}</div>
                {caption && (
                  <div style={{display:"flex",alignItems:"flex-end",minHeight:"26px",maxWidth:500}}>
                    <div style={{
                      fontWeight:400,fontSize:16,color:"#fff",lineHeight:1.4,maxHeight:showFull?"none":"2.8em",
                      overflow:showFull?"visible":"hidden",textOverflow:"ellipsis",display:"-webkit-box",
                      WebkitLineClamp:showFull?"unset":2,WebkitBoxOrient:"vertical",wordBreak:"break-word",marginRight:isTruncated?10:0,whiteSpace:"pre-line"
                    }}>{displayedCaption}</div>
                    {isTruncated && (
                      <button style={{
                        background:"none",border:"none",color:"#33b6ff",fontWeight:600,fontSize:15,cursor:"pointer",
                        marginLeft:2,padding:0,lineHeight:1.3,textDecoration:"underline",transition:"color .15s"}}
                        onClick={()=>handleCaptionExpand(filename)} tabIndex={0}>
                        {showFull ? "less" : "more"}
                      </button>
                    )}
                  </div>
                )}
                <div style={{color:"#b2bec3",fontSize:15,marginTop:3,cursor:"pointer",fontWeight:500}}
                  onClick={()=>setShowComments(filename)}
                >View all {v.comments?v.comments.length:0} comments</div>
              </div>
              {showComments===filename &&
                <div style={{
                  position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.91)",
                  display:"flex",flexDirection:"column",justifyContent:"flex-end",fontFamily:"inherit"
                }} onClick={()=>setShowComments(null)}>
                  <div className="comments-modal"
                    style={{
                      backgroundColor:"#181c21",borderTopLeftRadius:13,borderTopRightRadius:13,padding:15,minHeight:'36vh',height:'70vh',display:'flex',flexDirection:'column',maxWidth:500,
                      width:"97vw",margin:"0 auto",border:'1px solid #222',touchAction:"none",
                      transition:isDraggingModal?"none":"transform 0.22s cubic-bezier(.43,1.5,.48,1.16)",
                      transform:modalDragY?`translateY(${Math.min(modalDragY,144)}px)`:"translateY(0)"
                    }}
                    onTouchStart={handleModalTouchStart}
                    onTouchMove={handleModalTouchMove}
                    onTouchEnd={handleModalTouchEnd}
                    onClick={e=>e.stopPropagation()}>
                    <div style={{
                      display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:15,borderBottom:'1px solid #262626'
                    }}>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff",letterSpacing:0.01 }}>Comments</h2>
                      <span style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                        onClick={()=>setShowComments(null)}>×</span>
                    </div>
                    <div style={{ flex:1, overflowY:'auto',padding:'10px 0',fontFamily:"inherit" }}>
                      {allComments.length===0 ? (
                        <div style={{ color: "#ccc", textAlign: "center", padding: "40px 0", fontSize:15 }}>No comments yet.</div>
                      ) : renderComments({ comments: allComments, filename, idx })}
                    </div>
                    <div style={{display:'flex',alignItems:'center',paddingTop:9,borderTop:'1px solid #262626',fontFamily:"inherit"}}>
                      <input type="text"
                        placeholder="Add a comment…"
                        style={{ flex:1, backgroundColor:"#23263a",border:"none",borderRadius:20,padding:"10px 15px",color:"white",fontSize:14 }}
                        value={commentInputs[filename]||""}
                        onChange={e=>setCommentInputs(prev=>({...prev,[filename]:e.target.value}))}
                        onKeyDown={e=>e.key==="Enter"&&(commentInputs[filename]||"").trim()!==""&&(()=>axios.post(`${HOST}/shorts/${filename}/comment`,{name:"You",text:commentInputs[filename].trim()}).then(()=>{setShorts(prev=>prev.map((v,i)=>v.url.endsWith(filename)?{...v,comments:[...(v.comments||[]),{name:"You",text:commentInputs[filename].trim()}]}:v));setCommentInputs(prev=>({...prev,[filename]:""}));})))()}
                      />
                      <button className="feed-btn-anim"
                        style={{
                          color: "#0095f6", fontWeight: 600, marginLeft: 10, fontSize: 14, background:"none",border:"none",
                          cursor: (commentInputs[filename]||"").trim()!==""?"pointer":"default",opacity:(commentInputs[filename]||"").trim()!==""?1:0.55
                        }}
                        disabled={(commentInputs[filename]||"").trim()===""}
                        onClick={()=>axios.post(`${HOST}/shorts/${filename}/comment`,{name:"You",text:commentInputs[filename].trim()}).then(()=>{setShorts(prev=>prev.map((v,i)=>v.url.endsWith(filename)?{...v,comments:[...(v.comments||[]),{name:"You",text:commentInputs[filename].trim()}]}:v));setCommentInputs(prev=>({...prev,[filename]:""}));})}
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
