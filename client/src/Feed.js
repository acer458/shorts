import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// White Instagram-style icons
function HeartIcon({ filled }) {
  return (
    <svg fill={filled ? "#ed4956" : "#fff"} height="24" viewBox="0 0 24 24" width="24">
      {filled ? (
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
      ) : (
        <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"/>
      )}
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" stroke="#fff" strokeWidth="2"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M22 3L9 10m13-7l-13 7" stroke="#fff" strokeWidth="2"/>
      <circle cx="5" cy="12" r="2" stroke="#fff" strokeWidth="2"/>
      <circle cx="19" cy="4" r="2" stroke="#fff" strokeWidth="2"/>
      <circle cx="19" cy="20" r="2" stroke="#fff" strokeWidth="2"/>
    </svg>
  );
}

export default function Feed() {
  const [shorts, setShorts] = useState([]);
  const videoRefs = useRef([]);
  const wrapperRefs = useRef([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => { 
    axios.get(HOST + "/shorts").then(res => setShorts(res.data)); 
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setCurrentIdx(idx);
            videoRefs.current[idx]?.play().catch(() => {});
          } else {
            const idx = Number(entry.target.dataset.idx);
            videoRefs.current[idx]?.pause();
          }
        });
      }, 
      { threshold: 0.8 }
    );
    wrapperRefs.current.forEach(el => el && observer.observe(el));
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
      overflow: 'hidden',
      touchAction: 'none' // Disable zoom/scroll
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch'
      }}>
        {shorts.map((v, idx) => (
          <div
            key={idx}
            data-idx={idx}
            ref={el => (wrapperRefs.current[idx] = el)}
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
              ref={el => (videoRefs.current[idx] = el)}
              src={HOST + v.url}
              loop
              playsInline
              muted={idx !== currentIdx}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
            />

            {/* Right Action Buttons (White) */}
            <div style={{
              position: 'absolute',
              right: '12px',
              bottom: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HeartIcon filled={false} />
                <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>{v.likes || 0}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CommentIcon />
                <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>{v.comments?.length || 0}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ShareIcon />
                <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>Share</span>
              </div>
            </div>

            {/* Bottom Info Section */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '12px',
              right: '12px',
              padding: '12px',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '8px',
                  backgroundColor: '#333'
                }}>
                  <img 
                    src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(v.author || "anon")}`} 
                    alt="avatar"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <span style={{ color: '#fff', fontWeight: '600' }}>@{v.author || "anonymous"}</span>
              </div>
              <div style={{ color: '#fff', marginBottom: '8px' }}>{v.caption}</div>
              <div 
                style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                View all {v.comments?.length || 0} comments
              </div>
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
                backgroundColor: '#fff',
                transition: 'width 0.1s linear'
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
