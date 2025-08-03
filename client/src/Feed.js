import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// --------- CONFIG
const HOST = "https://shorts-t2dk.onrender.com";

// --------- SVG and utility functions (all your code, unchanged) ----------
function HeartSVG({ filled }) { /* ... unchanged ... */ /* use your full code here */ }
function PauseIcon() { /* ... unchanged ... */ }
function PulseHeart({ visible }) { /* ... unchanged ... */ }
function MuteMicIcon({ muted }) { /* ... unchanged ... */ }
function truncateString(str, maxLen = 90) { /* ... unchanged ... */ }
function SkeletonShort() { /* ... unchanged ... */ }
function shuffleArray(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---- THE MAIN FEED FUNCTION ----
export default function Feed() {
  const { filename } = useParams();  // <-- supports /shorts/filename.mp4
  const navigate = useNavigate();

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

  // ---- 1: Deep-linking patch to load correct video ----
  useEffect(() => {
    setLoading(true);
    axios.get(HOST + "/shorts")
      .then(res => {
        const arr = shuffleArray(res.data);
        setShorts(arr);

        if (filename) { // Jump to video if route param exists
          const idx = arr.findIndex(v => v.url.split("/").pop() === filename);
          setCurrentIdx(idx !== -1 ? idx : 0);
        } else {
          setCurrentIdx(0);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filename]);

  // ---- 2: URL sync with scrolling (deep-link stays as you swipe) ----
  useEffect(() => {
    if (shorts.length > 0) {
      const fname = shorts[currentIdx]?.url.split("/").pop();
      if (fname && fname !== filename) {
        navigate(`/shorts/${fname}`, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [currentIdx, shorts]);

  // ---- All your other code proceeds as before (autoplay, modals, comments, likes, etc) ----
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIdx) {
        vid.muted = muted;
        vid.play().catch(()=>{});
      }
      else { vid.pause(); vid.currentTime = 0; vid.muted = true; }
    });
    setShowPause(false); setShowPulseHeart(false);
  }, [currentIdx, muted]);

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
  function setLiked(filename, yes) { if (yes) localStorage.setItem("like_" + filename, "1"); else localStorage.removeItem("like_" + filename); }
  function handleLike(idx, filename, wantPulse = false) { /* ... unchanged ... */ }
  function handleShare(filename) {
    // PATCHED: Uses deep-link url
    const url = window.location.origin + "/shorts/" + filename;
    if (navigator.share) {
      navigator.share({ url, title: "Watch this short!" });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }
  /* ... all your comment, video, modal functions remain unchanged ... */
  function handleVideoEvents(idx, filename) { /* ... unchanged ... */ }
  function handleSeek(idx, e, isTouch = false) { /* ... unchanged ... */ }
  function handleTimeUpdate(idx, filename) { /* ... unchanged ... */ }
  function handleAddComment(idx, filename) { /* ... unchanged ... */ }
  function getProfilePic(v) { /* ... unchanged ... */ }
  function fakeAvatar(i) { /* ... unchanged ... */ }
  function fakeTime(i) { /* ... unchanged ... */ }
  const handleCaptionExpand = (filename) => {
    setExpandedCaptions(prev => ({ ...prev, [filename]: !prev[filename] }));
  };
  function handleModalTouchStart(e) { /* ... unchanged ... */ }
  function handleModalTouchMove(e) { /* ... unchanged ... */ }
  function handleModalTouchEnd() { /* ... unchanged ... */ }

  // ---- RENDER ----
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
          <div style={{ color: "#bbb", textAlign: "center", marginTop: 120, fontSize: 20 }}>
            No shorts uploaded yet.
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
              {/* ---- VIDEO & UI ---- */}
              <video ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop playsInline
                style={{ width: "100vw", height: "100dvh", objectFit: "contain", background: "#000", cursor: "pointer", display: "block" }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />

              {/* --- Your sidebar: profile, like, comment, share, etc. --- */}
              <div style={{
                position: 'absolute', right: '12px', bottom: '100px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '24px', zIndex: 10
              }}>
                {/* Profile, Like, Comment, and: */}
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
                {/* (rest of stack as before) */}
              </div>
              {/* ---- All your other UI (captions bar, modals, comments, pulse, drag-close, etc) here, unchanged ---- */}
              {/* ... */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
