import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./index.css"; // Ensure this is imported for styles

// UI helpers
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

// Truncate
function truncateString(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  let nextSpace = str.indexOf(" ", maxLen);
  if (nextSpace === -1) nextSpace = str.length;
  return str.substring(0, nextSpace) + '…';
}

const HOST = "https://shorts-t2dk.onrender.com";

export default function VideoPlayer({ user, onLogout }) {
  const { filename } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [mutePulse, setMutePulse] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [caption, setCaption] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(HOST + "/shorts/" + filename)
      .then(res => {
        setVideo(res.data);
        setCaption(res.data.caption || "");
        setComments(res.data.comments || []);
      })
      .catch(() => {
        setVideo(null); // Video not found
      })
      .finally(() => setLoading(false));
  }, [filename]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      if (!loading) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [muted, loading]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCommentError("Please log in to comment.");
        return;
      }
      
      const res = await axios.post(
        `${HOST}/shorts/${filename}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      setCommentError(err.response?.data?.error || "Failed to post comment.");
    }
  };

  const showButton = () => (
    <button
      onClick={() => { setMuted(m => !m); setMutePulse(true); setTimeout(() => setMutePulse(false), 350); }}
      aria-label={muted ? "Unmute" : "Mute"}
      style={{
        position: "absolute", top: 20, right: 20, zIndex: 60,
        background: "rgba(28,29,34,0.65)", border: "none", borderRadius: 16,
        width: 39, height: 39, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 2px 6px #0002", outline: "none",
        transition: "box-shadow .22s,ease",
        ...(mutePulse ? { animation: "mutepulseanim 0.38s cubic-bezier(.3,1.5,.65,1.05)", boxShadow: "0 0 0 9px #33b6ff27" } : {})
      }}>
      <MuteMicIcon muted={muted} />
      <style>{`@keyframes mutepulseanim {
        0% { box-shadow: 0 0 0 0 #33b6ff88; transform: scale(1.09);}
        75%{ box-shadow:0 0 0 13px #33b6ff22; transform: scale(1.13);}
        100% { box-shadow: 0 0 0 0 #33b6ff00; transform: scale(1);}
      }`}</style>
    </button>
  );

  function handleVideoClick() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setShowPause(false); }
    else { videoRef.current.pause(); setShowPause(true); }
  }

  // Handle case where video is not found
  if (loading) return (
    <div style={{ width: "100vw", height: "100dvh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#85d3ff", fontWeight: 600, fontSize: 22, letterSpacing: ".04em" }}>Loading Video...</span>
    </div>
  );

  if (!video) return (
    <div style={{ width: "100vw", height: "100dvh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#f33", fontSize: 30, fontWeight: 700, marginBottom: 10 }}>404</div>
        <div style={{ color: "#eee", fontSize: 20 }}>Video not found</div>
        <button style={{
          marginTop: 32, fontSize: 18, borderRadius: 7, border: "none",
          background: "#3bdcff", color: "#111", fontWeight: 700,
          padding: "12px 38px", cursor: "pointer"
        }}
        onClick={() => navigate("/")}>
          Go to Feed
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100dvh", width: "100vw", position: "relative", background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <video
        ref={videoRef}
        src={HOST + video.url}
        style={{
          width: "100vw", height: "100dvh", objectFit: "contain", background: "#000",
          cursor: "pointer", display: "block"
        }}
        playsInline loop onClick={handleVideoClick}
      />
      {showButton()}
      {showPause && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 105, background: 'rgba(0,0,0,0.26)', pointerEvents: "none",
          animation: 'fadeInPause .29s'
        }}>
          {/* Pause Icon */}
          <style>{`@keyframes fadeInPause { from {opacity:0; transform:scale(.85);} to {opacity:1; transform:scale(1);} }`}</style>
        </div>
      )}

      {/* Video Details and Comments Section */}
      <div className="video-details-and-comments">
        <div className="video-details-section">
          <div className="video-details-top">
            <button className="back-to-feed-btn" onClick={() => navigate("/")}>← Feed</button>
            {user && (
              <div className="user-info-container">
                <span className="user-name">Hello, {user.name}</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            )}
            {!user && (
              <button className="login-prompt-btn" onClick={() => navigate("/login")}>Login / Signup</button>
            )}
          </div>
          <div className="video-caption-author">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
              @{video.author || "anonymous"}
            </div>
            {caption && (
              <div style={{ display: "flex", alignItems: "flex-end", minHeight: "26px", maxWidth: 500 }}>
                <div
                  style={{
                    fontWeight: 400, fontSize: 16, color: "#fff", lineHeight: 1.4,
                    maxHeight: showFull ? "none" : "2.8em",
                    overflow: showFull ? "visible" : "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: showFull ? "unset" : 2,
                    WebkitBoxOrient: "vertical", wordBreak: "break-word",
                    marginRight: caption.length > 90 ? 10 : 0, whiteSpace: "pre-line"
                  }}>
                  {showFull ? caption : truncateString(caption)}
                </div>
                {caption.length > 90 && (
                  <button
                    style={{
                      background: "none", border: "none", color: "#33b6ff", fontWeight: 600, fontSize: 15,
                      cursor: "pointer", marginLeft: 2, padding: 0, lineHeight: 1.3,
                      textDecoration: "underline", transition: "color .15s"
                    }}
                    onClick={() => setShowFull(f => !f)}
                    tabIndex={0}
                  >
                    {showFull ? "less" : "more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <strong>{comment.name}:</strong> {comment.text}
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit-btn">Send</button>
              {commentError && <p className="comment-error">{commentError}</p>}
            </form>
          ) : (
            <p className="comment-login-message">
              <span onClick={() => navigate("/login")}>Log in</span> to post a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
