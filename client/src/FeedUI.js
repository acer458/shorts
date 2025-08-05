import React from "react";

// ------------------------------------------------------------------------
// HEART SVG ICON
// ------------------------------------------------------------------------
export function HeartSVG({ filled, size = 28 }) {
  return (
    <svg aria-label={filled ? "Unlike" : "Like"} height={size} width={size} viewBox="0 0 48 48">
      <path
        fill={filled ? "#ed4956" : "none"}
        stroke={filled ? "#ed4956" : "#fff"}
        strokeWidth="3"
        d="M34.3 7.8c-3.4 0-6.5 1.7-8.3 4.4-1.8-2.7-4.9-4.4-8.3-4.4
        C11 7.8 7 12 7 17.2c0 3.7 2.6 7 6.6 11.1 3.1 3.1 9.3 8.6 10.1 9.3
        .6.5 1.5.5 2.1 0 .8-.7 7-6.2 10.1-9.3
        4-4.1 6.6-7.4 6.6-11.1 0-5.2-4-9.4-8.6-9.4z"
      />
    </svg>
  );
}

// ------------------------------------------------------------------------
// PAUSE ICON
// ------------------------------------------------------------------------
export function PauseIcon() {
  return (
    <svg width={82} height={82} viewBox="0 0 82 82">
      <circle cx={41} cy={41} r={40} fill="#000A" />
      <rect x={26} y={20} width={10} height={42} rx={3} fill="#fff" />
      <rect x={46} y={20} width={10} height={42} rx={3} fill="#fff" />
    </svg>
  );
}

// ------------------------------------------------------------------------
// PULSE HEART ANIMATION
// ------------------------------------------------------------------------
export function PulseHeart({ visible }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 106,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        animation: visible ? "heartPulseAnim .75s cubic-bezier(.1,1.6,.6,1)" : "none"
      }}
    >
      <svg viewBox="0 0 96 96" width={90} height={90} style={{ display: "block" }}>
        <path
          d="M48 86C48 86 12 60 12 32.5 12 18.8 24.5 10 36 10c6.2 0 11.9
           3.3 12 3.3S53.8 10 60 10c11.5 0 24 8.8 24 22.5C84 60 48 86
           48 86Z"
          fill="#ed4956"
          stroke="#ed4956"
          strokeWidth={7}
        />
      </svg>
      <style>
        {`
        @keyframes heartPulseAnim {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
          14% { opacity: 0.92; transform: translate(-50%,-50%) scale(1.22);}
          27% { opacity: 1; transform: translate(-50%,-50%) scale(0.89);}
          44%, 82% { opacity: 0.92; transform: translate(-50%,-50%) scale(1);}
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0);}
        }
        `}
      </style>
    </div>
  );
}

// ------------------------------------------------------------------------
// MUTE MIC ICON
// ------------------------------------------------------------------------
export function MuteMicIcon({ muted }) {
  return muted ? (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff2" stroke="#fff" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
      <line x1="4.8" y1="4.8" x2="19.2" y2="19.2" stroke="#fff" strokeWidth="2.6" />
    </svg>
  ) : (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff1" stroke="#fff" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#fff" />
    </svg>
  );
}

// ------------------------------------------------------------------------
// SKELETON LOADER
// ------------------------------------------------------------------------
export function SkeletonShort() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        scrollSnapAlign: "start",
        position: "relative",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {/* Video skeleton */}
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          background: "linear-gradient(90deg,#16181f 0%,#212332 50%,#181924 100%)",
          animation: "skelAnim 1.3s infinite linear",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />
      <style>
        {`
        @keyframes skelAnim { 
          0% { filter:brightness(1); }
          55% { filter: brightness(1.07); }
          100% { filter:brightness(1);}
        }
        `}
      </style>
      {/* Skeleton Mute button */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 20,
          background: "rgba(28,29,34,0.65)",
          borderRadius: 16,
          width: 39,
          height: 39,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            background: "linear-gradient(90deg,#222 30%,#333 60%,#222 100%)",
            borderRadius: "50%"
          }}
        />
      </div>
      {/* Side action skeletons */}
      <div
        style={{
          position: "absolute",
          right: "12px",
          bottom: "100px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px"
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 46,
              height: 49,
              marginBottom: i === 0 ? 6 : 0,
              borderRadius: 16,
              background: "linear-gradient(90deg,#20212c 30%,#292a37 60%,#20212c 100%)"
            }}
          />
        ))}
      </div>
      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(0deg,#151721 88%,transparent 100%)",
          color: "#fff",
          padding: "22px 18px 33px 18px",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          userSelect: "none"
        }}
      >
        <div
          style={{
            width: 110,
            height: 17,
            marginBottom: 10,
            borderRadius: 7,
            background: "linear-gradient(90deg,#21243a 30%,#393b56 60%,#21243a 100%)",
            marginLeft: 2
          }}
        />
        <div
          style={{
            height: 15,
            width: "70%",
            borderRadius: 5,
            background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)"
          }}
        />
        <div
          style={{
            marginTop: 8,
            width: 76,
            height: 14,
            borderRadius: 6,
            background: "linear-gradient(90deg,#292b3b 30%,#33364a 60%,#292b3b 100%)"
          }}
        />
      </div>
    </div>
  );
}
