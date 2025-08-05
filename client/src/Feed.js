import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// ---- CONFIG ----
const HOST = "https://shorts-t2dk.onrender.com";

// ===== UTILITIES =====
function truncateString(str, maxLen = 90) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  const nextSpace = str.indexOf(" ", maxLen);
  return str.substring(0, nextSpace === -1 ? str.length : nextSpace) + '…';
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getProfilePic(v) {
  return v.avatar || v.profilePic ||
    `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anonymous")}`;
}
function fakeAvatar(i) {
  const urls = [
    "https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg", "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/18.jpg"
  ];
  return urls[i % urls.length];
}
function nowDateString() {
  return new Date().toISOString();
}
function getDisplayTime(dateStr) {
  if (!dateStr) return "Just now";
  const d = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 2) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return d.toLocaleDateString();
}

// ---- SVG ICONS ----
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
      aria-hidden
      style={{
        position: "absolute", left: "50%", top: "50%", zIndex: 106,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none", opacity: visible ? 1 : 0,
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
      <style>{`
        @keyframes heartPulseAnim {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
          14% { opacity: 0.92; transform: translate(-50%,-50%) scale(1.22);}
          27% { opacity: 1; transform: translate(-50%,-50%) scale(0.89);}
          44%, 82% { opacity: 0.92; transform: translate(-50%,-50%) scale(1);}
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
        }
      `}</style>
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

// ---- Skeleton ----
function SkeletonShort() { /* ...Same as before... */ }

// ---- DEV TOOL BLOCK ----
function useAntiInspect() { /* ...Same as before... */ }

// ====== COMMENT COMPONENTS =======

function useUniqueList(arr, keyGetter) {
  const map = new Map();
  arr.forEach(item => {
    const k = keyGetter(item);
    if (!map.has(k)) map.set(k, item);
  });
  return Array.from(map.values());
}

function CommentLikeButton({liked,count,onToggle}) {
  return (
    <button
      onClick={onToggle}
      style={{
        background:"none",border:"none",color:liked?"#ed4956":"#aaa",display:"inline-flex",alignItems:"center",gap:4,
        fontSize:13,marginLeft:4,cursor:"pointer"
      }}
      aria-label={liked ? "Unlike comment" : "Like comment"}
    >
      <svg height={16} width={16} viewBox="0 0 48 48">
        <path
          fill={liked ? "#ed4956" : "none"}
          stroke={liked ? "#ed4956" : "#aaa"}
          strokeWidth="2.1"
          d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3.6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3 4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
        />
      </svg>
      {count>0 && <span style={{fontSize:13,fontWeight:500}}>{count}</span>}
    </button>
  );
}

function CommentItem({
  comment,
  onLike,
  onReply,
  replyingTo,
  replyInput,
  setReplyInput,
  onSubmitReply,
  onLikeReply
}) {
  return (
    <div>
      <div style={{
        display:"flex", gap:10, alignItems:"flex-start", marginBottom:5, minHeight:34
      }}>
        <img alt="" src={comment.avatar} style={{
          width:30, height:30, borderRadius:19,objectFit:"cover", background:"#232"
        }}/>
        <div style={{flex:1}}>
          <div style={{display:"flex", alignItems:"center",gap:7}}>
            <span style={{color:"#fff",fontWeight:600, fontSize:14}}>{comment.name}</span>
            <span style={{color:"#b8b8b8", fontSize:12}}>{getDisplayTime(comment.date)}</span>
          </div>
          <div style={{color:"#eee", fontSize:15,lineHeight:"1.4",marginTop:1,whiteSpace:"pre-line"}}>
            {comment.text}
          </div>
          <div style={{display:"flex",alignItems:"center",marginTop:4,gap:2}}>
            <span
              onClick={onReply}
              style={{
                fontSize:12,color:"#6cb2ff",cursor:"pointer",padding:"0 7px 0 0",userSelect:"none"
              }}>
              Reply
            </span>
            <CommentLikeButton liked={!!comment.liked} count={comment.likes||0} onToggle={onLike}/>
          </div>
        </div>
      </div>
      {
        replyingTo===comment.localId && (
          <div style={{marginLeft:40,marginBottom:10}}>
            <input
              type="text"
              placeholder="Write a reply..."
              style={{
                width:"85%", fontSize:14, borderRadius:18, border:"none",
                padding:"6px 14px", outline:"none",background:"#16181f",color:"#fff"
              }}
              value={replyInput||""}
              onChange={e=>setReplyInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&onSubmitReply()}
              autoFocus
            />
            <button
              onClick={onSubmitReply}
              disabled={!(replyInput||"").trim()}
              style={{
                background:"#3c74e5",border:"none",borderRadius:12,color:"#fff",
                padding:"4px 15px",marginLeft:8,fontSize:13, fontWeight:600,opacity:!!(replyInput||"").trim()?1:0.55,
                cursor:!!(replyInput||"").trim()?"pointer":"default"
              }}>
              Post
            </button>
          </div>
        )
      }
      {/* REPLIES */}
      {(comment.replies||[]).length>0 && (
        <div style={{marginLeft:44,marginTop:2}}>
          {comment.replies.map(r=>(
            <div key={r.localId} style={{display:"flex",alignItems:"flex-start",marginBottom:6}}>
              <img alt="" src={r.avatar} style={{
                width:24,height:24,borderRadius:12, objectFit:"cover",background:"#242"
              }}/>
              <div style={{marginLeft:7,flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:"#e3e3e3",fontWeight:600,fontSize:13}}>{r.name}</span>
                  <span style={{color:"#999",fontSize:11}}>{getDisplayTime(r.date)}</span>
                </div>
                <div style={{color:"#ddd",fontSize:14,marginTop:1,whiteSpace:"pre-line"}}>
                  {r.text}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:2,marginTop:2}}>
                  <CommentLikeButton liked={!!r.liked} count={r.likes||0} onToggle={onLikeReply}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN COMMENTS MODAL ---
function CommentsModal({
  open, onClose, comments, onAdd, onLike, onReplyClick, replyingTo, replyInput,
  setReplyInput, onSubmitReply, onLikeReply, input, setInput, posting
}) {
  return open?(
    <div
      style={{
        position:"fixed",inset:0,background:"rgba(5,8,16,0.93)",zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor:"#090a13",borderTopLeftRadius:15,borderTopRightRadius:15,padding:15,
          minHeight:'38vh',height:'69vh',maxWidth:440,width:"99vw",margin:"0 auto",
          border:'1px solid #23232b',display:'flex',flexDirection:'column',
          boxShadow:"0 0 48px #000c",touchAction:"none",overflow:"hidden"
        }}
        onClick={e=>e.stopPropagation()}
      >
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:9,borderBottom:'1.1px solid #191925'}}>
          <h2 style={{fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"0.02em"}}>Comments</h2>
          <span style={{fontSize:30,lineHeight:"22px",color:"#dde",cursor:"pointer",userSelect:"none",marginRight:1}}
            onClick={onClose}
            tabIndex={0}
          >×</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:"10px 0",marginTop:4}}>
          {!!comments.length?
          comments.map((c)=>(
            <CommentItem
              comment={c}
              key={c.localId}
              onLike={()=>onLike(c)}
              onReply={()=>onReplyClick(c)}
              replyingTo={replyingTo}
              replyInput={replyInput}
              setReplyInput={setReplyInput}
              onSubmitReply={()=>onSubmitReply(c)}
              onLikeReply={r=>onLikeReply(c,r)}
            />
          ))
          :<div style={{color:"#bbb",textAlign:"center",padding:"38px 0",fontSize:16}}>No comments yet.</div>
          }
        </div>
        {/* Add Comment Input */}
        <div style={{
          display:'flex',alignItems:'center',paddingTop:10, borderTop:'1px solid #15151b'
        }}>
          <input
            type="text"
            placeholder="Add a comment..."
            style={{
              flex: 1, backgroundColor: "#15151a", border: "none", borderRadius: 20,
              padding: "10px 15px", color: "white", fontSize: 14, outline:"none"
            }}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(input||"").trim()!==""&&!posting&&onAdd()}
            autoFocus
          />
          <button
            style={{
              color: "#2986e2", fontWeight: 700, marginLeft: 10, fontSize: 15,
              background: "none", border: "none",padding:"5px 9px",
              cursor:(input||"").trim()!==""&&!posting? "pointer":"default",
              opacity:(input||"").trim()!==""?1:0.54,transition:'opacity .16s'
            }}
            disabled={(input||"").trim()===""||posting}
            onClick={onAdd}
          >Post</button>
        </div>
      </div>
    </div>
  ):null;
}

// =========== SNAP SCROLL LOGIC MAIN COMPONENT ==========

export default function Feed() {
  useAntiInspect();
  const location = useLocation();
  const navigate = useNavigate();
  const [shorts, setShorts] = useState([]);
  const [aloneVideo, setAloneVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // scroll/snap state
  const [currentIdx, setCurrentIdx] = useState(0);
  const videoRefs = useRef([]);
  const wrapperRefs = useRef([]);
  const scrollContainerRef = useRef();
  const scrolling = useRef(false);

  // mute, pause, UI
  const [muted, setMuted] = useState(true);
  const [mutePulse, setMutePulse] = useState(false);
  const [likePending, setLikePending] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [showPause, setShowPause] = useState(false);
  const [showPulseHeart, setShowPulseHeart] = useState(false);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  // comments state (threaded, likes etc)
  const [globalComments, setGlobalComments] = useState({});
  const [commentLikes, setCommentLikes] = useState({}); // {filename:{[cid]:1}}
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [replyPending, setReplyPending] = useState(false);
  const [commentPosting, setCommentPosting] = useState(false);

  // Modal drag-to-close
  const [modalDragY, setModalDragY] = useState(0);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const dragStartY = useRef(0);

  // Replay overlay
  const [replayCounts, setReplayCounts] = useState({});
  const [overlayShown, setOverlayShown] = useState({});

  // ===== FETCH / LOAD =====
  useEffect(()=>{
    setLoading(true); setNotFound(false); setAloneVideo(null); setShorts([]);
    setReplayCounts({}); setOverlayShown({});
    const params = new URLSearchParams(location.search);
    const filename = params.get("v");
    if(filename){
      axios.get(`${HOST}/shorts/${filename}`)
        .then(res=>setAloneVideo({...res.data,url:res.data.url||`/shorts/${filename}`}))
        .catch(()=>setNotFound(true))
        .finally(()=>setLoading(false));
    }else{
      axios.get(HOST + "/shorts")
        .then(res=>setShorts(shuffleArray(res.data)))
        .finally(()=>setLoading(false));
    }
  },[location.search]);

  // -- Prepare refs
  useEffect(()=>{
    videoRefs.current = Array(shorts.length);
    wrapperRefs.current = Array(shorts.length);
  },[shorts.length]);

  // ===== MODERN SNAP-SCROLL (one at a time) =====
  // Handles mouse wheel, trackpad, keyboard, mobile swipe/drag. 1 video at a time.
  useEffect(()=>{
    if(aloneVideo) return;
    const container = scrollContainerRef.current;
    if(!container) return;

    let lastTouchY=null, dragStartIdx=0, velocity=0, lastScroll=0;
    let scrollingFlag=false;
    let frame=0, wheelTimeout=0;
    // Snap handler
    function goTo(idx){
      idx = Math.max(0, Math.min(idx, shorts.length-1));
      setCurrentIdx(idx);
      const el = wrapperRefs.current[idx];
      if(el){
        el.scrollIntoView({behavior:'smooth',block:"start"});
      }
    }
    // Wheel for desktop (one at a time, not multiple!)
    function handleWheel(e){
      if(scrolling.current) return;
      if(Math.abs(e.deltaY)<32) return;
      e.preventDefault();
      scrolling.current=true;
      if(e.deltaY>0 && currentIdx<shorts.length-1) goTo(currentIdx+1);
      else if(e.deltaY<0 && currentIdx>0) goTo(currentIdx-1);
      setTimeout(()=>{scrolling.current=false;},410);
    }
    // Key: arrows
    function handleKey(e){
      if(document.activeElement.tagName==="INPUT") return;
      if(e.key==="ArrowDown") { goTo(currentIdx+1); e.preventDefault();}
      else if(e.key==="ArrowUp") { goTo(currentIdx-1); e.preventDefault();}
    }
    // TOUCH snap
    function handleTouchStart(e){
      if(e.touches.length!==1) return;
      lastTouchY = e.touches[0].clientY;
      dragStartIdx = currentIdx;
      velocity=0;
      lastScroll = performance.now();
    }
    function handleTouchMove(e){
      if(lastTouchY==null) return;
      velocity=e.touches[0].clientY-lastTouchY;
    }
    function handleTouchEnd(e){
      if(lastTouchY==null) return;
      // Fast downward swipe = next
      if(velocity<-39 && currentIdx<shorts.length-1) goTo(currentIdx+1);
      // Fast upward swipe = prev
      else if(velocity>39 && currentIdx>0) goTo(currentIdx-1);
      lastTouchY=null;
    }
    container.addEventListener("wheel",handleWheel,{passive:false});
    container.addEventListener("keydown",handleKey);
    container.addEventListener("touchstart",handleTouchStart,{passive:true});
    container.addEventListener("touchmove",handleTouchMove,{passive:true});
    container.addEventListener("touchend",handleTouchEnd,{passive:true});
    return ()=>{
      container.removeEventListener("wheel",handleWheel);
      container.removeEventListener("keydown",handleKey);
      container.removeEventListener("touchstart",handleTouchStart);
      container.removeEventListener("touchmove",handleTouchMove);
      container.removeEventListener("touchend",handleTouchEnd);
    };
  },[currentIdx,shorts.length,aloneVideo]);

  // --- Intersection observer fallback for visible focus
  useEffect(()=>{
    if(aloneVideo) return;
    let running=false;
    const observer = new window.IntersectionObserver(
      entries => {
        if(running) return;
        let maxRatio=0,visibleIdx=0;
        entries.forEach(entry=>{
          if(entry.intersectionRatio>maxRatio){
            maxRatio=entry.intersectionRatio;
            visibleIdx=Number(entry.target.dataset.idx);
          }
        });
        if(maxRatio>0.7 && currentIdx!==visibleIdx) setCurrentIdx(visibleIdx);
      },
      { threshold: [0,0.6,1] }
    );
    wrapperRefs.current.forEach((el,i)=>el&&observer.observe(el));
    return ()=>observer.disconnect();
  },[shorts.length,aloneVideo,currentIdx]);

  // --- Only one video plays, rest paused
  useEffect(()=>{
    if(aloneVideo) return;
    videoRefs.current.forEach((vid,idx)=>{
      if(!vid) return;
      if(idx===currentIdx){
        vid.muted=muted;
        const filename = (shorts[idx]&&shorts[idx].url.split('/').pop())||"";
        if(!overlayShown[filename]) { vid.play().catch(()=>{});}
      } else { vid.pause(); vid.muted=true; }
    });
    setShowPause(false); setShowPulseHeart(false);
  },[currentIdx,muted,aloneVideo,shorts,overlayShown]);

  useEffect(()=>{
    function visibilityHandler(){
      if(document.visibilityState!=="visible"){
        videoRefs.current.forEach((vid)=>vid&&vid.pause());
      }
    }
    document.addEventListener("visibilitychange",visibilityHandler);
    return ()=>document.removeEventListener("visibilitychange",visibilityHandler);
  },[]);

  // --- LIKE, COMMENT, SHARE LOGIC ---
  function isLiked(filename){ return localStorage.getItem("like_"+filename)==="1";}
  function setLiked(filename,yes){
    if(yes) localStorage.setItem("like_"+filename,"1");
    else localStorage.removeItem("like_"+filename);
  }
  function handleLike(idx,filename,wantPulse=false){
    if(likePending[filename]) return;
    const liked = isLiked(filename);
    setLikePending(l=>({...l,[filename]:true}));
    if(!liked){
      axios.post(`${HOST}/shorts/${filename}/like`).then(()=>{
        setShorts(prev=>prev.map((v,i)=>i===idx?{...v,likes:(v.likes||0)+1}:v));
        setAloneVideo(prev=>prev&&prev.url&&prev.url.endsWith(filename)?{...prev,likes:(prev.likes||0)+1}:prev);
        setLiked(filename,true);
        setLikePending(l=>({...l,[filename]:false}));
      });
      if(wantPulse){setShowPulseHeart(true);setTimeout(()=>setShowPulseHeart(false),720);}
    }else{
      setShorts(prev=>prev.map((v,i)=>i===idx&&(v.likes||0)>0?{...v,likes:v.likes-1}:v));
      setAloneVideo(prev=>prev&&prev.url&&prev.url.endsWith(filename)&&(prev.likes||0)>0
        ?{...prev,likes:prev.likes-1}:prev);
      setLiked(filename,false);
      setLikePending(l=>({...l,[filename]:false}));
    }
  }
  function handleShare(filename){
    const url=window.location.origin + "/?v=" + filename;
    if(navigator.share){
      navigator.share({url,title:"Watch this short!"});
    }else{
      navigator.clipboard.writeText(url);
      const temp = document.createElement('div');
      temp.innerText="Link copied!";
      temp.style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222c;padding:8px 26px;border-radius:17px;color:white;font-weight:600;z-index:9999;font-size:15px;box-shadow:0 4px 16px #0004";
      document.body.appendChild(temp); setTimeout(()=>document.body.removeChild(temp),1200);
    }
  }

  // --------- COMMENTS (threaded, like, reply, real time, dedup) -------------
  function getThreadedComments(short, filename){
    let base = (globalComments[filename]||short.comments||[]) ?? [];
    // comment shape: {id?,localId:string, name, text, date, likes, liked, replies:[]}
    // Always assign a localId to each comment for dedup-client.
    const withId = base.map((c,i)=>({
      ...c, localId: c.localId||(c.id?(""+c.id):filename+"_"+i), avatar:c.avatar||fakeAvatar(i),
      date: c.date||c.time||nowDateString(), replies:(c.replies||[]).map((r,j)=>({
        ...r, localId: r.localId||(r.id?(""+r.id):c.localId+"_r"+j), avatar: r.avatar||fakeAvatar(i*3+j+11), date:r.date||nowDateString()
      }))
    }));
    // Deduplicate by localId (prevents duplicates after quick posts)
    return useUniqueList(withId,c=>c.localId);
  }
  // Like comment or reply (by updating globalComments!)
  function likeComment(filename, comment, parentLocalId){
    setGlobalComments(prev=>{
      let list = [...(prev[filename]||[])];
      if(parentLocalId){
        // Reply like
        list = list.map(c=>
          c.localId===parentLocalId
          ?{
            ...c,
            replies: c.replies.map(r=>r.localId===comment.localId
              ? {...r, liked:!r.liked, likes:(r.likes||0)+(r.liked?-1:1)}
              :r
            )
          }
          :c
        );
      }else{
        // Top comment like
        list = list.map(c=>
          c.localId===comment.localId
            ?{...c, liked:!c.liked, likes:(c.likes||0)+(c.liked?-1:1)}
            :c
        );
      }
      return {...prev,[filename]:list};
    });
  }
  // Add top-level comment
  async function handleAddComment(idx,filename){
    const text = (commentInputs[filename]||"").trim();
    if(!text||commentPosting) return;
    setCommentPosting(true);
    const commentObj={
      name:"You", text, date:nowDateString(),
      avatar:fakeAvatar(333), likes:0, liked:false, replies:[],
      localId:filename+"_"+nowDateString()+Math.floor(Math.random()*100000)
    };
    setGlobalComments(prev=>{
      const curr=useUniqueList([...(prev[filename]||[]), commentObj],c=>c.localId);
      return {...prev,[filename]:curr};
    });
    setCommentInputs(p=>({...p,[filename]:""}));
    try{
      await axios.post(`${HOST}/shorts/${filename}/comment`, { name: "You", text });
    }catch(e){}
    setCommentPosting(false);
  }
  // Add a reply, threaded (one level)
  async function handleAddReply(filename, parentComment){
    const reply = (replyInput||"").trim();
    if(!reply||replyPending) return;
    setReplyPending(true);
    const replyObj={
      name:"You", text:reply, date:nowDateString(),
      avatar:fakeAvatar(77), likes:0, liked:false,
      localId:parentComment.localId+"_reply_"+(Math.random()*100000)|0
    };
    setGlobalComments(prev=>{
      const n = (prev[filename]||[]).map(c=>{
        if(c.localId===parentComment.localId){
          // dedupe too!
          let newReplies = useUniqueList([...(c.replies||[]),replyObj],r=>r.localId);
          return {...c,replies:newReplies};
        }
        return c;
      });
      return {...prev,[filename]:n};
    });
    setReplyingTo(null); setReplyInput("");
    try{
      await axios.post(`${HOST}/shorts/${filename}/comment/reply`, {
        parentId:parentComment.localId, text:reply, name:"You"
      });
    }catch(e){}
    setReplyPending(false);
  }

  // Caption expand
  const handleCaptionExpand = (filename) =>
    setExpandedCaptions(prev=>({...prev,[filename]:!prev[filename]}));

  // Drag-close
  function handleModalTouchStart(e){
    if(!e.touches||e.touches.length!==1) return;
    dragStartY.current = e.touches[0].clientY;
    setIsDraggingModal(true);
  }
  function handleModalTouchMove(e){
    if(!isDraggingModal||!e.touches||e.touches.length!==1) return;
    const dy = e.touches[0].clientY-dragStartY.current;
    if(dy>0) setModalDragY(dy);
  }
  function handleModalTouchEnd(){
    setIsDraggingModal(false);
    if(modalDragY>65) setShowComments(null);
    setModalDragY(0);
  }
  // Video UI
  function handleVideoEvents(idx,filename){
    let tapTimeout=null;
    return {
      onClick:()=>{
        if(tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = setTimeout(()=>{
          const vid=videoRefs.current[idx];
          if(!vid) return;
          if(vid.paused) {vid.play(); setShowPause(false);}
          else{ vid.pause(); setShowPause(true);}
        },230);
      },
      onDoubleClick:()=>{
        if(tapTimeout){clearTimeout(tapTimeout);tapTimeout=null;}
        if(!isLiked(filename)) handleLike(idx,filename,true);
        setShowPulseHeart(true);
        setTimeout(()=>setShowPulseHeart(false),660);
      },
      onTouchEnd:e=>{
        if(!e||!e.changedTouches||e.changedTouches.length!==1) return;
        if(tapTimeout){
          clearTimeout(tapTimeout);tapTimeout=null;
          if(!isLiked(filename)) handleLike(idx,filename,true);
          setShowPulseHeart(true);
          setTimeout(()=>setShowPulseHeart(false),660);
        }else{
          tapTimeout=setTimeout(()=>{
            const vid=videoRefs.current[idx];
            if(vid){
              if(vid.paused){ vid.play(); setShowPause(false);}
              else{ vid.pause(); setShowPause(true);}
            }
            tapTimeout=null;
          },250);
        }
      }
    };
  }
  function handleSeek(idx,e,isTouch=false){
    let clientX;
    if(isTouch){
      if(!e.touches||e.touches.length!==1) return;
      clientX = e.touches[0].clientX;
    }else{
      clientX = e.clientX;
    }
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = clientX-rect.left;
    const percent = x/rect.width;
    const vid = videoRefs.current[idx];
    if(vid&&vid.duration&&isFinite(vid.duration)){
      vid.currentTime = Math.max(0,Math.min(percent,1))*vid.duration;
    }
  }
  function handleTimeUpdate(idx,filename){
    const vid = videoRefs.current[idx];
    setVideoProgress((prev)=>({
      ...prev,
      [filename]:vid&&vid.duration&&isFinite(vid.duration)?
        vid.currentTime/vid.duration:0
    }));
  }
  // Replay overlay
  function handleVideoEnded(idx,filename){
    setReplayCounts(prev=>{
      const prevCount = prev[filename]||0;
      if(prevCount<2){
        if(videoRefs.current[idx]){
          videoRefs.current[idx].currentTime=0;
          videoRefs.current[idx].play().catch(()=>{});
        }
        return {...prev,[filename]:prevCount+1};
      }else{
        setOverlayShown(ov=>({...ov,[filename]:true}));
        if(videoRefs.current[idx]) videoRefs.current[idx].pause();
        return {...prev,[filename]:prevCount+1};
      }
    });
  }
  function handleOverlayContinue(idx,filename){
    setReplayCounts(prev=>({...prev,[filename]:0}));
    setOverlayShown(prev=>({...prev,[filename]:false}));
    if(videoRefs.current[idx]){
      videoRefs.current[idx].currentTime=0; videoRefs.current[idx].play().catch(()=>{});
    }
  }

  // ---- MAIN RENDER UI ----
  function renderVideo({
    v, idx, filename, prog, liked, isCurrent, inFeed, commentList, caption,showFull,isTruncated,displayedCaption
  }) {
    const isOverlayShown=overlayShown[filename];
    return (
      <div key={filename} data-idx={idx}
        ref={el => inFeed && (wrapperRefs.current[idx] = el)}
        style={{
          width:"100vw",height:"100dvh",scrollSnapAlign:"start",
          position:"relative",background:"black",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"
        }}
      >
        {/* VIDEO */}
        <video
          ref={el => (videoRefs.current[idx]=el)}
          src={HOST+v.url}
          loop={false} playsInline
          style={{width:"100vw",height:"100dvh",objectFit:"contain",background:"#111",cursor:"pointer",display:"block"}}
          muted={muted}
          autoPlay
          onTimeUpdate={()=>handleTimeUpdate(idx,filename)}
          onEnded={()=>handleVideoEnded(idx,filename)}
          {...handleVideoEvents(idx,filename)}
        />
        {/* Replay overlay */}
        {isOverlayShown && (
          <div style={{
            position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1002,
          }}>
            <div style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",
              minWidth:"260px",minHeight:"92px",background:"rgba(30,30,38,0.41)",borderRadius:"16px",
              boxShadow:"0 8px 32px 0 rgba(12,16,30,0.21), 0 1.5px 11px #0004",
              backdropFilter:"blur(14px) saturate(160%)",border:"1.6px solid rgba(80,80,86,0.16)",
              padding:"24px 26px 18px 26px"
            }}>
              <span style={{
                color:"#fff",fontSize:"1.11rem",fontWeight:600,letterSpacing:"0.01em",marginBottom:"6px"
              }}>Continue watching?</span>
              <button onClick={()=>handleOverlayContinue(idx,filename)} style={{
                background:"rgba(0,0,0,0.30)",color:"#fff",fontFamily:"inherit",
                padding:"8px 28px",fontSize:"1rem",fontWeight:500,borderRadius:"12px",border:"1.1px solid rgba(255,255,255,0.085)",
                boxShadow:"0 1.5px 8px #0004",marginTop:"1px",cursor:"pointer"
              }}>
                Continue
              </button>
            </div>
          </div>
        )}
        {/* Mute/Unmute */}
        {(inFeed?isCurrent:true)&&(
          <button
            onClick={e=>{e.stopPropagation();setMuted(m=>!m);setMutePulse(true);setTimeout(()=>setMutePulse(false),350);}}
            aria-label={muted?"Unmute":"Mute"}
            tabIndex={0}
            style={{
              position:"absolute",top:20,right:20,zIndex:60,background:"rgba(28,29,34,0.61)",
              border:"none",borderRadius:16,width:39,height:39,display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",boxShadow:"0 2px 6px #0002",outline:"none",
              transition:"box-shadow .22s,ease",
              ...(mutePulse
                ?{animation:"mutepulseanim .38s cubic-bezier(.3,1.5,.65,1.05)",boxShadow:"0 0 0 9px #33b6ff27"}
                :{})
            }}>
            <MuteMicIcon muted={muted}/>
            <style>{`@keyframes mutepulseanim{0%{box-shadow:0 0 0 0 #33b6ff88;transform:scale(1.09);}75%{box-shadow:0 0 0 13px #33b6ff22;transform:scale(1.13);}100%{box-shadow:0 0 0 0 #33b6ff00;transform:scale(1);}}`}</style>
          </button>
        )}
        {/* Pause + Heart */}
        {(inFeed?isCurrent:true)&&showPause &&
          <div style={{
            position:'absolute',top:0,left:0,width:'100%',height:'100%',
            display:'flex',alignItems:'center',justifyContent:'center',
            zIndex:105,background:'rgba(0,0,0,0.26)',pointerEvents:"none"
          }}>
            <PauseIcon/>
          </div>
        }
        {(inFeed?isCurrent:true)&&<PulseHeart visible={showPulseHeart}/>}
        {/* Progress Bar */}
        <div style={{
            position:"absolute",left:0,right:0,bottom:0,height:4,background:"rgba(255,255,255,0.18)",
            zIndex:32,borderRadius:2,overflow:"hidden",cursor:"pointer"
          }}
            onClick={e=>handleSeek(idx,e,false)}
            onTouchStart={e=>handleSeek(idx,e,true)}
            role="progressbar" aria-valuenow={Math.round(prog*100)}
        >
          <div style={{
            width:`${Math.min(prog*100,100)}%`,height:"100%",background:"rgb(42, 131, 254)",
            transition:"width 0.22s cubic-bezier(.4,1,.5,1)"
          }}/>
        </div>
        {/* ACTIONS */}
        <div style={{
          position:'absolute',right:'12px',bottom:'100px',display:'flex',flexDirection:'column',alignItems:'center',
          gap:'24px',zIndex:10
        }}>
          <div style={{marginBottom:6,width:48,height:48,borderRadius:"50%",overflow:"hidden"}}>
            <img src={getProfilePic(v)} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>
          </div>
          {/* Like */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button
              aria-label={liked?"Unlike":"Like"}
              disabled={likePending[filename]}
              onClick={e=>{e.stopPropagation();handleLike(idx,filename,!liked);}}
              style={{background:'none',border:'none',padding:0,cursor:'pointer',outline:0}}
            >
              <HeartSVG filled={liked}/>
            </button>
            <span style={{color:liked?'#ed4956':'#fff',fontSize:'13px',marginTop:'4px'}}>{v.likes||0}</span>
          </div>
          {/* Comment */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button
              aria-label="Comment"
              onClick={e=>{e.stopPropagation();setShowComments(filename);}}
              style={{background:'none',border:'none',padding:0,cursor:'pointer'}}
            >
              <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>{(commentList||[]).length}</span>
          </div>
          {/* Share */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <button
              aria-label="Share"
              onClick={()=>handleShare(filename)}
              style={{background:'none',border:'none',padding:0,cursor:'pointer'}}
            >
              <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"/>
                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </button>
            <span style={{color:'#fff',fontSize:'13px',marginTop:'4px'}}>Share</span>
          </div>
        </div>
        {/* Bottom Caption + "View all N comments" only! */}
        <div style={{
          position:"absolute",left:0,right:0,bottom:0,
          background:"linear-gradient(0deg,#000e 88%,transparent 100%)",
          color:"#fff",padding:"20px 18px 28px 18px",zIndex:6,
          display:"flex",flexDirection:"column",userSelect:"none"
        }}>
          <div style={{fontWeight:600,fontSize:16,marginBottom:2}}>
            @{v.author||"anonymous"}
          </div>
          {caption&&(
            <div style={{display:"flex",alignItems:"flex-end",minHeight:"26px",maxWidth:500}}>
              <div
                style={{
                  fontWeight:400,fontSize:16,color:"#fff",lineHeight:1.4,
                  maxHeight:showFull?"none":"2.8em",
                  overflow:showFull?"visible":"hidden",
                  textOverflow:"ellipsis",display:"-webkit-box",
                  WebkitLineClamp:showFull?"unset":2,WebkitBoxOrient:"vertical",
                  wordBreak:"break-word",marginRight:isTruncated?10:0,whiteSpace:"pre-line"
                }}
              >
                {displayedCaption}
              </div>
              {isTruncated&&(
                <button
                  style={{
                    background:"none",border:"none",color:"#33b6ff",fontWeight:600,fontSize:15,
                    cursor:"pointer",marginLeft:2,padding:0,lineHeight:1.3,textDecoration:"underline"
                  }}
                  tabIndex={0} onClick={()=>handleCaptionExpand(filename)}
                >{showFull?"less":"more"}</button>
              )}
            </div>
          )}
          {/* NO first comment shown here! */}
          <div
            style={{color:"#b2bec3",fontSize:15,marginTop:3,cursor:"pointer"}}
            onClick={()=>setShowComments(filename)}
          >View all {(commentList||[]).length} comments</div>
        </div>
        {/* Modern Comments Modal */}
        <CommentsModal
          open={showComments===filename}
          onClose={()=>setShowComments(null)}
          comments={commentList}
          input={commentInputs[filename]||""}
          setInput={txt=>setCommentInputs(p=>({...p,[filename]:txt}))}
          onAdd={()=>handleAddComment(idx,filename)}
          onLike={c=>likeComment(filename,c)}
          onReplyClick={c=>{
            setReplyingTo(replyingTo===c.localId?null:c.localId);
            setReplyInput("");
          }}
          replyingTo={replyingTo}
          replyInput={replyInput}
          setReplyInput={setReplyInput}
          posting={commentPosting}
          onSubmitReply={c=>{handleAddReply(filename,c);}}
          onLikeReply={(parent,r)=>likeComment(filename,r,parent.localId)}
        />
        {/* Standalone Mode: Back Button */}
        {!inFeed&&(
          <button
            onClick={()=>navigate("/",{replace:true})}
            aria-label="Back to Feed"
            style={{
              position:"absolute",top:20,left:16,zIndex:100,background:"#222f",color:"#fff",
              fontWeight:600,fontSize:16,padding:"6px 17px",borderRadius:15,
              border:"none",cursor:"pointer",letterSpacing:".02em",boxShadow:"0 2px 10px #0003"
            }}>
            ← Feed
          </button>
        )}
      </div>
    );
  }

  // --- NOT FOUND ----
  if(notFound){
    return (
      <div style={{fontFamily:"Inter,sans-serif",color:"#ca7979",textAlign:"center",marginTop:120,fontSize:22,background:"#000",minHeight:"100dvh"}}>
        <div style={{marginBottom:12}}>Video not found.</div>
        <button
          onClick={()=>navigate("/",{replace:true})}
          style={{color:"#fff",background:"#33b6ff",border:"none",borderRadius:10,fontWeight:600,fontSize:16,padding:"8px 28px",cursor:"pointer"}}>
          Back to Feed
        </button>
      </div>
    );
  }
  if(loading) return (
    <>
      {Array.from({length:2}).map((_,idx)=><SkeletonShort key={idx}/>)}
    </>
  );

  // ---- STANDALONE MODE ----
  if(aloneVideo){
    const v=aloneVideo;
    const urlParts=(v.url||"").split("/");
    const filename = urlParts[urlParts.length-1];
    const liked = isLiked(filename);
    const prog = videoProgress[filename]||0;
    const commentList = getThreadedComments(v,filename);
    const caption = v.caption||"";
    const previewLimit = 90;
    const isTruncated = caption&&caption.length>previewLimit;
    const showFull = expandedCaptions[filename];
    const displayedCaption=!caption?"":showFull?caption:truncateString(caption,previewLimit);
    return renderVideo({
      v, idx:0, filename, prog, liked, isCurrent:true, commentList,
      caption,showFull,isTruncated,displayedCaption,inFeed:false
    });
  }

  if(!loading&&shorts.length===0){
    return (
      <div style={{
        fontFamily:"Inter,Arial,sans-serif",color:"#bbb",textAlign:"center",
        marginTop:120,fontSize:20,background:"#0a0a0c",minHeight:"100dvh",letterSpacing:".01em"
      }}>
        No shorts uploaded yet.
      </div>
    );
  }

  // ---- MAIN FEED (SNAP) ----
  return (
    <div style={{
      minHeight:"100dvh",width:"100vw",background:"black",margin:0,padding:0,overflow:"hidden",
      fontFamily:"Inter,Arial,sans-serif"
    }}>
      <div ref={scrollContainerRef}
        style={{
          width:"100vw",height:"100dvh",overflowY:"scroll",overflowX:"hidden",
          scrollSnapType:"y mandatory",background:"#000", outline:'none'
        }}
        tabIndex={0}
      >
        {shorts.map((v,idx)=>{
          const filename = v.url.split("/").pop();
          const liked = isLiked(filename);
          const prog = videoProgress[filename]||0;
          const commentList = getThreadedComments(v,filename);
          const caption = v.caption||"";
          const previewLimit = 90;
          const isTruncated = caption&&caption.length>previewLimit;
          const showFull = expandedCaptions[filename];
          const displayedCaption = !caption?"":showFull?caption:truncateString(caption,previewLimit);
          const isCurrent = idx===currentIdx;
          return renderVideo({
            v,idx,filename,prog,liked,isCurrent,inFeed:true,
            commentList,caption,showFull,isTruncated,displayedCaption
          });
        })}
      </div>
    </div>
  );
}
