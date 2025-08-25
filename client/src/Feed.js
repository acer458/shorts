function handleVideoEvents(idx, filename) {
  let clickTimer = null;
  let lastTap = 0;
  const SINGLE_DELAY = 250;

  const likeThenPulse = () => {
    if (!isLiked(filename)) {
      handleLike(idx, filename); // like immediately
    }
    // Optional: trigger your big pulse UI here (if desired)
    // setShowPulseHeart(true);
    // requestAnimationFrame(() => setTimeout(() => setShowPulseHeart(false), 700));
  };

  return {
    onClick: (e) => {
      // If browser provides click detail (count), ignore multi-clicks here
      if (e.detail > 1) return; // prevents firing on the second click of a double-click [1]
      if (clickTimer) return;
      clickTimer = setTimeout(() => {
        clickTimer = null;
        const vid = videoRefs.current[idx];
        if (!vid) return;
        if (vid.paused) {
          vid.play();
          setShowPause(false);
        } else {
          vid.pause();
          setShowPause(true);
        }
      }, SINGLE_DELAY);
    },
    onDoubleClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      likeThenPulse();
    },
    onTouchEnd: (e) => {
      if (!e || !e.changedTouches || e.changedTouches.length !== 1) return;
      const now = Date.now();
      const isDouble = now - lastTap < 260; // within double-tap window
      lastTap = now;

      if (isDouble) {
        e.preventDefault();
        e.stopPropagation();
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        likeThenPulse();
      } else {
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          clickTimer = null;
          const vid = videoRefs.current[idx];
          if (!vid) return;
          if (vid.paused) {
            vid.play();
            setShowPause(false);
          } else {
            vid.pause();
            setShowPause(true);
          }
        }, SINGLE_DELAY);
      }
    }
  };
}
