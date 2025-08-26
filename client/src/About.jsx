// src/pages/About.jsx
import React from "react";

const sx = {
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  heroTitle: { fontSize: 40, lineHeight: 1.1, margin: 0 },
  heroSub: { color: "#c7c7c7", marginTop: 8, maxWidth: 720 },
  grid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
  },
  h2: { fontSize: 20, margin: "0 0 8px" },
  p: { color: "#d8d8d8", margin: 0 },
  ul: { margin: 0, paddingLeft: 18, color: "#d8d8d8" },
  ctaWrap: { display: "flex", alignItems: "center", gap: 12 },
  btn: {
    display: "inline-block",
    padding: "12px 16px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    transition: "transform .15s ease, box-shadow .2s ease, background .2s ease",
    boxShadow: "0 6px 24px rgba(0,0,0,.35), inset 0 0 0 0 rgba(255,255,255,.2)",
  },
};

export default function About() {
  return (
    <main style={sx.page}>
      <section>
        <h1 style={sx.heroTitle}>About PropScholar</h1>
        <p style={sx.heroSub}>
          Trading education. Shorts that teach. Tools that compound skills.
        </p>
      </section>

      <section style={sx.grid}>
        <div>
          <h2 style={sx.h2}>What this is</h2>
          <p style={sx.p}>
            PropScholar is a focused learning platform for traders—bite‑size
            videos, curated notes, and practical workflows.
          </p>
        </div>
        <div>
          <h2 style={sx.h2}>How it helps</h2>
          <p style={sx.p}>
            Learn faster with short formats, repeat key setups, and apply
            checklists directly in the market.
          </p>
        </div>
        <div>
          <h2 style={sx.h2}>Roadmap</h2>
          <ul style={sx.ul}>
            <li>Creator uploads with hashing/dedup</li>
            <li>Topic tagging and search</li>
            <li>Email lessons and playbook PDFs</li>
          </ul>
        </div>
      </section>

      <section style={sx.ctaWrap}>
        <a
          href="/"
          style={sx.btn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          onMouseDown={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 999px rgba(255,255,255,0.05)")}
          onMouseUp={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.35), inset 0 0 0 0 rgba(255,255,255,.2)")}
        >
          Open Shorts Feed →
        </a>
      </section>
    </main>
  );
}
