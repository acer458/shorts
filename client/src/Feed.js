import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// Clean Instagram-style icons (no shadows)
const Icons = {
  Heart: ({ filled }) => (
    <svg fill={filled ? "#ed4956" : "#fff"} height="24" viewBox="0 0 24 24" width="24">
      {filled ? (
        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218z"/>
      ) : (
        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218z"/>
      )}
    </svg>
  ),
  Comment: () => (
    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22z" stroke="#fff" strokeWidth="2"/>
    </svg>
  ),
  Share: () => (
    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M22 3L9 10m13-7l-13 7" stroke="#fff" strokeWidth="2"/>
      <circle cx="5" cy="12" r="2" stroke="#fff" strokeWidth="2"/>
      <circle cx="19" cy="4" r="2" stroke="#fff" strokeWidth="2"/>
      <circle cx="19" cy="20" r="2" stroke="#fff" strokeWidth="2"/>
    </svg>
  )
};

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showComments, setShowComments] = useState(null);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    axios.get(`${HOST}/shorts`).then(res => setShorts(res.data));
  }, []);

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Main Reels Feed */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory'
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
              scrollSnapAlign: 'start'
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
              onTimeUpdate={(e) => {
                // Force progress bar to show immediately
                if (e.target.currentTime === 0) {
                  e.target.currentTime = 0.001;
                }
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
                <Icons.Heart filled={false} />
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
                <Icons.Share />
                <div style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                  Share
                </div>
              </div>
            </div>

            {/* Bottom Info Section - NO SHADOW */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '12px',
              right: '12px',
              padding: '12px',
              zIndex: 2,
              background: 'rgba(0,0,0,0.5)' // Solid background instead of gradient
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
                  fontSize: '14px'
                }}
              >
                View all {short.comments?.length || 0} comments
              </button>
            </div>

            {/* Progress Bar - Always Visible */}
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
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 100
        }}>
          {/* Modal content here */}
        </div>
      )}
    </div>
  );
}
