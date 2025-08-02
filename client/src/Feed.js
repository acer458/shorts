import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const HOST = "https://shorts-t2dk.onrender.com";

// Instagram-style icons
function HeartIcon({ filled }) {
  return filled ? (
    <svg aria-label="Unlike" fill="#ed4956" height="24" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
  ) : (
    <svg aria-label="Like" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-label="Comment" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22Z" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-label="Share Post" fill="#fff" height="24" viewBox="0 0 24 24" width="24">
      <line fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="#fff" strokeLinejoin="round" strokeWidth="2"></polygon>
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
  // ... [keep all your existing state and effect hooks exactly the same] ...

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      overflow: 'hidden',
      touchAction: 'none' // Prevent dragging
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory'
      }}>
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
                position: 'relative',
                width: '100vw',
                height: '100vh',
                scrollSnapAlign: 'start',
                backgroundColor: '#000'
              }}
            >
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={HOST + v.url}
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
                {...handleVideoEvents(idx, filename)}
                onTimeUpdate={() => handleTimeUpdate(idx, filename)}
              />

              {/* Right action buttons */}
              <div style={{
                position: 'absolute',
                right: '12px',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button 
                    onClick={() => handleLike(idx, filename)}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                  <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                    {v.likes || 0}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button 
                    onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    <CommentIcon />
                  </button>
                  <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                    {(v.comments && v.comments.length) || 0}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    <ShareIcon />
                  </button>
                  <span style={{ color: '#fff', fontSize: '12px', marginTop: '4px' }}>
                    Share
                  </span>
                </div>
              </div>

              {/* Bottom info section - no shadow */}
              <div style={{
                position: 'absolute',
                left: '12px',
                right: '12px',
                bottom: '60px',
                padding: '12px',
                zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginRight: '8px'
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
                {v.comments && v.comments.length > 0 && (
                  <div style={{ color: '#fff', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{v.comments[0].name}:</span> {v.comments[0].text}
                  </div>
                )}
                <button 
                  onClick={() => setShowComments(cur => ({ ...cur, [filename]: true }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    padding: 0,
                    fontSize: '14px'
                  }}
                >
                  View all {v.comments ? v.comments.length : 0} comments
                </button>
              </div>

              {/* Progress bar */}
              <div style={{
                position: 'absolute',
                bottom: '50px',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                zIndex: 3
              }}>
                <div style={{
                  width: `${Math.min(prog * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: '#fff',
                  transition: 'width 0.1s linear'
                }}/>
              </div>

              {/* Keep your existing comments modal exactly the same */}
              {showComments[filename] && (
                // ... [your existing comments modal code] ...
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
