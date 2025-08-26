// src/pages/About.jsx
import React, { useState, useEffect } from "react";

const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = {
    page: {
      background: "linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%)",
      color: "#fff",
      minHeight: "100vh",
      padding: "60px 24px",
      fontFamily: "'Inter', Arial, sans-serif",
      lineHeight: 1.6,
      maxWidth: 900,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
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
      zIndex: 2,
    },
    titleUnderline: {
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
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "24px",
      padding: "32px",
      marginBottom: "40px",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 163, 255, 0.25)",
      transition: "transform 0.4s ease, box-shadow 0.4s ease",
      position: "relative",
      zIndex: 2,
      overflow: "hidden",
    },
    sectionHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 45px 0 rgba(0, 0, 0, 0.5), 0 0 25px rgba(74, 163, 255, 0.4)",
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
      color: "rgba(255, 255, 255, 0.9)",
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
      filter: "drop-shadow(0 0 5px rgba(74, 163, 255, 0.7))",
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
      boxShadow: "0 4px 15px rgba(74, 163, 255, 0.4)",
      cursor: "pointer",
      userSelect: "none",
      position: "relative",
      overflow: "hidden",
      zIndex: 1,
    },
    linkItemHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(74, 163, 255, 0.6)",
    },
    linkItemBefore: {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, #8a2be2 0%, #4aa3ff 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
      zIndex: -1,
    },
    linkItemBeforeHover: {
      opacity: 1,
    },
    glow: {
      position: "fixed",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(74, 163, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
      top: `calc(-300px + ${scrollPosition * 0.1}px)`,
      right: `calc(-300px + ${scrollPosition * 0.05}px)`,
      pointerEvents: "none",
      zIndex: 0,
      transition: "top 0.1s ease, right 0.1s ease",
    },
    glow2: {
      position: "fixed",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
      bottom: `calc(-250px + ${scrollPosition * -0.1}px)`,
      left: `calc(-250px + ${scrollPosition * -0.05}px)`,
      pointerEvents: "none",
      zIndex: 0,
      transition: "bottom 0.1s ease, left 0.1s ease",
    },
    floatingShortsButton: {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "24px",
      boxShadow: "0 5px 20px rgba(74, 163, 255, 0.5)",
      cursor: "pointer",
      zIndex: 1000,
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      animation: "pulse 2s infinite",
    },
    particle: {
      position: "absolute",
      borderRadius: "50%",
      background: "linear-gradient(45deg, #4aa3ff, #8a2be2)",
      opacity: 0.3,
      zIndex: 1,
    },
  };

  // Generate random particles
  const particles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.random() * 8 + 2;
    return {
      id: i,
      size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    };
  });

  const [hoverStates, setHoverStates] = useState({
    section: Array(6).fill(false),
    link: Array(3).fill(false),
  });

  const handleHover = (type, index, isHovered) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? isHovered : item)
    }));
  };

  return (
    <main style={styles.page}>
      {/* Background Glow Effects */}
      <div style={styles.glow}></div>
      <div style={styles.glow2}></div>
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            animation: `float ${Math.random() * 10 + 5}s ease-in-out ${particle.animationDelay} infinite`,
          }}
        ></div>
      ))}
      
      {/* Floating Shorts Button */}
      <div 
        style={styles.floatingShortsButton}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 8px 25px rgba(74, 163, 255, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 5px 20px rgba(74, 163, 255, 0.5)";
        }}
        onClick={() => alert("Shorts feature coming soon!")}
      >
        <span style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))" }}>🎬</span>
      </div>

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

      <section 
        style={{
          ...styles.section,
          ...(hoverStates.section[0] && styles.sectionHover)
        }}
        onMouseEnter={() => handleHover('section', 0, true)}
        onMouseLeave={() => handleHover('section', 0, false)}
      >
        <h2 style={styles.subtitle}>Our Mission</h2>
        <p style={styles.paragraph}>
          Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
        </p>
      </section>

      <section 
        style={{
          ...styles.section,
          ...(hoverStates.section[1] && styles.sectionHover)
        }}
        onMouseEnter={() => handleHover('section', 1, true)}
        onMouseLeave={() => handleHover('section', 1, false)}
      >
        <h2 style={styles.subtitle}>Our Vision</h2>
        <p style={styles.paragraph}>
          Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
        </p>
        <p style={styles.paragraph}>
          By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
        </p>
      </section>

      <section 
        style={{
          ...styles.section,
          ...(hoverStates.section[2] && styles.sectionHover)
        }}
        onMouseEnter={() => handleHover('section', 2, true)}
        onMouseLeave={() => handleHover('section', 2, false)}
      >
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

      <section 
        style={{
          ...styles.section,
          ...(hoverStates.section[3] && styles.sectionHover)
        }}
        onMouseEnter={() => handleHover('section', 3, true)}
        onMouseLeave={() => handleHover('section', 3, false)}
      >
        <h2 style={styles.subtitle}>The Community</h2>
        <p style={styles.paragraph}>
          We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
        </p>
        <div style={styles.links}>
          <a 
            href="https://discord.com/invite/yourserver" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...styles.linkItem,
              ...(hoverStates.link[0] && styles.linkItemHover)
            }}
            onMouseEnter={() => handleHover('link', 0, true)}
            onMouseLeave={() => handleHover('link', 0, false)}
          >
            <span>🎮</span> Join Discord
            <span style={{
              ...styles.linkItemBefore,
              ...(hoverStates.link[0] && styles.linkItemBeforeHover)
            }}></span>
          </a>
          <a 
            href="https://instagram.com/propscholar" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...styles.linkItem,
              ...(hoverStates.link[1] && styles.linkItemHover)
            }}
            onMouseEnter={() => handleHover('link', 1, true)}
            onMouseLeave={() => handleHover('link', 1, false)}
          >
            <span>📸</span> Follow Instagram
            <span style={{
              ...styles.linkItemBefore,
              ...(hoverStates.link[1] && styles.linkItemBeforeHover)
            }}></span>
          </a>
          <a 
            href="https://twitter.com/propscholar" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              ...styles.linkItem,
              ...(hoverStates.link[2] && styles.linkItemHover)
            }}
            onMouseEnter={() => handleHover('link', 2, true)}
            onMouseLeave={() => handleHover('link', 2, false)}
          >
            <span>🐦</span> Follow Twitter
            <span style={{
              ...styles.linkItemBefore,
              ...(hoverStates.link[2] && styles.linkItemBeforeHover)
            }}></span>
          </a>
        </div>
      </section>

      <section 
        style={{
          ...styles.section,
          ...(hoverStates.section[4] && styles.sectionHover)
        }}
        onMouseEnter={() => handleHover('section', 4, true)}
        onMouseLeave={() => handleHover('section', 4, false)}
      >
        <h2 style={styles.subtitle}>Our Journey</h2>
        <p style={styles.paragraph}>
          At PropScholar, we are committed to making trading accessible to everyone. Pass our evaluation with your skill and earn a scholarship.
        </p>
      </section>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(74, 163, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0); }
          }
        `}
      </style>
    </main>
  );
};

export default About;
