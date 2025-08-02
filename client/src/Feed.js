import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// Instagram exact icons
const Icons = {
  Heart: ({ filled }) => (
    <svg aria-label="Like" fill={filled ? "#ed4956" : "#fff"} height="24" viewBox="0 0 24 24" width="24">
      {filled ? (
        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218z"></path>
      ) : (
        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218z"></path>
      )}
    </svg>
  ),
  Comment: () => (
    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  ),
  Share: () => (
    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
  ),
  Close: () => (
    <svg aria-label="Close" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
      <polyline fill="none" points="20.649 20.649 12 12 3.354 3.354" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
    </svg>
  )
};

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Fetch shorts
  useEffect(() => {
    axios.get(`${HOST}/shorts`).then(res => setShorts(res.data));
  }, []);

  // Handle video play/pause
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIdx) {
        video.play().catch(() => {});
        video.muted = false;
      } else {
        video.pause();
        video.muted = true;
      }
    });
  }, [currentIdx]);

  // Intersection observer for scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setCurrentIdx(Number(entry.target.dataset.idx));
          }
        });
      },
      { threshold: 0.8 }
    );

    if (containerRef.current) {
      Array.from(containerRef.current.children).forEach(child => {
        observer.observe(child);
      });
    }

    return () => observer.disconnect();
  }, [shorts]);

  const handleLike = async (shortId) => {
    // Implement like logic
  };

  const handleCommentSubmit = async (shortId) => {
    if (!commentText.trim()) return;
    // Implement comment submission
    setCommentText("");
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'hidden',
      touchAction: 'pan-y'
    }}>
      {/* Main Reels Feed */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {shorts.map((short, idx) => (
          <div
            key={short.id}
            data-idx={idx}
            style={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              scrollSnapAlign: 'start',
              overflow: 'hidden'
            }}
          >
            {/* Video */}
            <video
              ref={el => videoRefs.current[idx] = el}
              src={`${HOST}${short.url}`}
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
            />

            {/* Right Action Buttons */}
            <div style={{
              position: 'absolute',
              right: '12px',
              bottom: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => handleLike(short.id)}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <Icons.Heart filled={false} />
                </button>
                <div style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                  {short.likes || 0}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => setShowComments(short.id)}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <Icons.Comment />
                </button>
                <div style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                  {short.comments?.length || 0}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => {/* Share logic */}}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <Icons.Share />
                </button>
                <div style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                  Share
                </div>
              </div>
            </div>

            {/* Bottom Info Section */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '12px',
              right: '12px',
              padding: '12px',
              zIndex: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.5) 30%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '8px',
                  background: '#333'
                }}>
                  <img 
                    src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(short.author || "user")}`}
                    alt="Profile"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <span style={{ color: '#fff', fontWeight: '600' }}>@{short.author || "user"}</span>
              </div>
              <div style={{ color: '#fff', marginBottom: '8px' }}>{short.caption}</div>
              <button 
                onClick={() => setShowComments(short.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  padding: 0,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                View all {short.comments?.length || 0} comments
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              zIndex: 3
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#fff'
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            backgroundColor: '#262626',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            maxHeight: '80vh',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #363636',
              position: 'relative'
            }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>Comments</span>
              <button 
                onClick={() => setShowComments(null)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
              >
                <Icons.Close />
              </button>
            </div>

            <div style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '16px'
            }}>
              {shorts.find(s => s.id === showComments)?.comments?.length ? (
                shorts.find(s => s.id === showComments).comments.map((comment, i) => (
                  <div key={i} style={{ display: 'flex', marginBottom: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginRight: '12px',
                      flexShrink: 0,
                      background: '#333'
                    }}>
                      <img 
                        src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(comment.name || "user")}`}
                        alt="Profile"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{comment.name}</div>
                      <div style={{ color: '#fff' }}>{comment.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
                  No comments yet
                </div>
              )}
            </div>

            <div style={{
              padding: '16px',
              borderTop: '1px solid #363636',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '12px',
                  fontSize: '14px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(showComments)}
              />
              <button
                onClick={() => handleCommentSubmit(showComments)}
                disabled={!commentText.trim()}
                style={{
                  color: commentText.trim() ? '#0095f6' : '#8e8e8e',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  padding: '0 8px',
                  fontSize: '14px',
                  cursor: commentText.trim() ? 'pointer' : 'default'
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
