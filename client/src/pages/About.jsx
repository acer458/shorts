// src/pages/About.jsx
import React from "react";

const styles = {
  page: {
    background: "linear-gradient(135deg, #000000 0%, #0a0a2a 100%)",
    color: "#fff",
    minHeight: "100vh",
    padding: "60px 24px",
    fontFamily: "'Inter', Arial, sans-serif",
    lineHeight: 1.6,
    maxWidth: 900,
    margin: "0 auto",
  },
  title: {
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
    marginBottom: 30,
    paddingBottom: 16,
    background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    fontWeight: 700,
    letterSpacing: "0.5px",
    position: "relative",
  },
  titleUnderline: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "4px",
    background: "linear-gradient(90deg, #4aa3ff, #8a2be2)",
    borderRadius: "2px",
  },
  section: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "40px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), 0 0 15px rgba(74, 163, 255, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  subtitle: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    marginBottom: 20,
    background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
    letterSpacing: "0.5px",
    paddingBottom: 10,
    borderBottom: "2px solid rgba(74, 163, 255, 0.3)",
  },
  paragraph: {
    fontSize: 17,
    marginBottom: 16,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 1.7,
  },
  subtitleSmall: {
    fontSize: 20,
    marginTop: 28,
    marginBottom: 16,
    color: "#4aa3ff",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  links: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },
  linkItem: {
    color: "#fff",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "50px",
    background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(74, 163, 255, 0.3)",
  },
  glow: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(74, 163, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
    top: "-250px",
    right: "-250px",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow2: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
    bottom: "-200px",
    left: "-200px",
    pointerEvents: "none",
    zIndex: 0,
  },
};

export default function About() {
  return (
    <main style={styles.page}>
      {/* Background Glow Effects */}
      <div style={styles.glow}></div>
      <div style={styles.glow2}></div>
      
      <h1 style={styles.title}>
        Making Trading Accessible
        <span style={styles.titleUnderline}></span>
      </h1>

      <p style={styles.paragraph}>
        Our mission is to make trading accessible for everyone by providing scholarship grants.
      </p>

      <p style={styles.paragraph}>
        In exchange we take a simple evaluation/test. If traders complete the test successfully, we provide the scholarship.
      </p>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Mission</h2>
        <p style={styles.paragraph}>
          Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Vision</h2>
        <p style={styles.paragraph}>
          Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
        </p>
        <p style={styles.paragraph}>
          By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Core Values</h2>

        <h3 style={styles.subtitleSmall}>
          <span style={styles.icon}>✨</span>Commitment to Our Word
        </h3>
        <p style={styles.paragraph}>We deliver what we say.</p>

        <h3 style={styles.subtitleSmall}>
          <span style={styles.icon}>🎯</span>Client-Centered Focus
        </h3>
        <p style={styles.paragraph}>Our team is focused to deliver what our clients want.</p>

        <h3 style={styles.subtitleSmall}>
          <span style={styles.icon}>🌟</span>Best Support in the Industry
        </h3>
        <p style={styles.paragraph}>
          We are committed to provide the best support in the industry. For us, support is the image of the company.
        </p>

        <h3 style={styles.subtitleSmall}>
          <span style={styles.icon}>⚡</span>Simplest Evaluation Process
        </h3>
        <p style={styles.paragraph}>We have created an evaluation tailored to be fair and transparent.</p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>The Community</h2>
        <p style={styles.paragraph}>
          We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
        </p>
        <div style={styles.links}>
          <a 
            href="https://discord.com/invite/yourserver" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.linkItem}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(74, 163, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow = "0 4px 15px rgba(74, 163, 255, 0.3)";
            }}
          >
            <span>🎮</span> Join Discord
          </a>
          <a 
            href="https://instagram.com/propscholar" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.linkItem}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(74, 163, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow = "0 4px 15px rgba(74, 163, 255, 0.3)";
            }}
          >
            <span>📸</span> Follow Instagram
          </a>
          <a 
            href="https://twitter.com/propscholar" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.linkItem}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 20px rgba(74, 163, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow = "0 4px 15px rgba(74, 163, 255, 0.3)";
            }}
          >
            <span>🐦</span> Follow Twitter
          </a>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Journey</h2>
        <p style={styles.paragraph}>
          At PropScholar, we are committed to making trading accessible to everyone. Pass our evaluation with your skill and earn a scholarship.
        </p>
      </section>
    </main>
  );
}
