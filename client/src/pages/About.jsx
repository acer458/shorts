import React from "react";
import "./About.css"; // Import the CSS for this page

export default function About() {
  return (
    <main className="about-page">
      <h1 className="about-title">Making Trading Accessible</h1>

      <p className="about-paragraph">
        Our mission is to make trading accessible for everyone by providing scholarship grants.
      </p>

      <p className="about-paragraph">
        In exchange we take a simple evaluation/test. If trader complete the test we provide the scholarship.
      </p>

      <section className="about-section">
        <h2 className="about-subtitle">Our Mission</h2>
        <p className="about-paragraph">
          Through this scholarship trader can afford anything they want in their journey of becoming a professional trader. We are not a prop firm we are a scholarship based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">Our Vision</h2>
        <p className="about-paragraph">
          Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
        </p>
        <p className="about-paragraph">
          By using our platform one can prove himself by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">Our Core Values</h2>

        <h3 className="about-subtitle-sm">Commitment to Our Word</h3>
        <p className="about-paragraph">We deliver what we say.</p>

        <h3 className="about-subtitle-sm">Client-Centered Focus</h3>
        <p className="about-paragraph">Our team is focused to deliver what our client want.</p>

        <h3 className="about-subtitle-sm">Best Support in the Industry</h3>
        <p className="about-paragraph">
          We are committed to provide the best support in the industry. For us, support is the image of the company.
        </p>

        <h3 className="about-subtitle-sm">Simplest Evaluation Process</h3>
        <p className="about-paragraph">We have created an evaluation tailored to be fair and transparent.</p>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">The Community</h2>
        <p className="about-paragraph">
          We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
        </p>
        <div className="about-links">
          <a href="https://discord.com/invite/yourserver" target="_blank" rel="noopener noreferrer" className="about-link">Discord</a>
          <a href="https://instagram.com/propscholar" target="_blank" rel="noopener noreferrer" className="about-link">Instagram</a>
          <a href="https://twitter.com/propscholar" target="_blank" rel="noopener noreferrer" className="about-link">X (Twitter)</a>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-subtitle">Our Journey</h2>
        <p className="about-paragraph">
          At PropScholar, we are committed to making trading accessible to everyone. Pass our evaluation with your skill and earn a scholarship.
        </p>
      </section>
    </main>
  );
}
