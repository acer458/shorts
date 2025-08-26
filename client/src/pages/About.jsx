// src/pages/About.jsx
import React from "react";

const styles = {
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px 24px",
    fontFamily: "'Inter', Arial, sans-serif",
    lineHeight: 1.6,
    maxWidth: 860,
    margin: "0 auto",
  },
  title: {
    fontSize: 36,
    marginBottom: 24,
    borderBottom: "3px solid #fff",
    paddingBottom: 8,
  },
  section: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 28,
    marginBottom: 16,
    borderBottom: "2px solid #666",
    paddingBottom: 6,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
  },
  subtitleSmall: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  links: {
    display: "flex",
    gap: 16,
    marginTop: 12,
  },
  linkItem: {
    color: "#4aa3ff",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default function About() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Making Trading Accessible</h1>

      <p style={styles.paragraph}>
        Our mission is to make trading accessible for everyone by providing scholarship grants.
      </p>

      <p style={styles.paragraph}>
        In exchange we take a simple evaluation/test. If trader complete the test we provide the scholarship.
      </p>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Mission</h2>
        <p style={styles.paragraph}>
          Through this scholarship trader can afford anything they want in their journey of becoming a professional trader. We are not a prop firm we are a scholarship based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Vision</h2>
        <p style={styles.paragraph}>
          Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
        </p>
        <p style={styles.paragraph}>
          By using our platform one can prove himself by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Our Core Values</h2>

        <h3 style={styles.subtitleSmall}>Commitment to Our Word</h3>
        <p style={styles.paragraph}>We deliver what we say.</p>

        <h3 style={styles.subtitleSmall}>Client-Centered Focus</h3>
        <p style={styles.paragraph}>Our team is focused to deliver what our client want.</p>

        <h3 style={styles.subtitleSmall}>Best Support in the Industry</h3>
        <p style={styles.paragraph}>
          We are committed to provide the best support in the industry. For us, support is the image of the company.
        </p>

        <h3 style={styles.subtitleSmall}>Simplest Evaluation Process</h3>
        <p style={styles.paragraph}>We have created an evaluation tailored to be fair and transparent.</p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>The Community</h2>
        <p style={styles.paragraph}>
          We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
        </p>
        <div style={styles.links}>
          <a href="https://discord.com/invite/yourserver" target="_blank" rel="noopener noreferrer" style={styles.linkItem}>Discord</a>
          <a href="https://instagram.com/propscholar" target="_blank" rel="noopener noreferrer" style={styles.linkItem}>Instagram</a>
          <a href="https://twitter.com/propscholar" target="_blank" rel="noopener noreferrer" style={styles.linkItem}>X (Twitter)</a>
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
