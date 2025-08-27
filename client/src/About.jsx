// src/pages/About.jsx
import React, { useState, useEffect } from "react";

const About = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    section: Array(6).fill(false),
    link: Array(3).fill(false),
    headerLink: Array(6).fill(false),
    headerCta: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsHeaderVisible(window.scrollY > 100);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleHover = (type, index, isHovered) => {
    setHoverStates((prev) => ({
      ...prev,
      [type]:
        type === "headerCta"
          ? isHovered
          : prev[type].map((item, i) => (i === index ? isHovered : item)),
    }));
  };

  const styles = {
    page: {
      background: "linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%)",
      color: "#fff",
      minHeight: "100vh",
      padding: isMobile ? "40px 16px" : "60px 24px",
      fontFamily: "'Inter', Arial, sans-serif",
      lineHeight: 1.6,
      maxWidth: "100%",
      margin: 0,
      position: "relative",
      overflow: "hidden",
    },
    container: {
      maxWidth: 900,
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: isMobile ? 20 : 30,
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? 12 : 20,
    },
    logo: {
      width: isMobile ? 40 : 50,
      height: isMobile ? 40 : 50,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      boxShadow: "0 0 20px rgba(74, 163, 255, 0.5)",
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "clamp(2rem, 4vw, 2.8rem)",
      margin: 0,
      paddingBottom: 12,
      background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
      fontWeight: 700,
      letterSpacing: "0.5px",
      position: "relative",
    },
    titleUnderline: {
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "3px",
      background: "linear-gradient(90deg, #4aa3ff, #8a2be2)",
      borderRadius: "2px",
    },
    section: {
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: isMobile ? "20px" : "28px",
      marginBottom: "30px",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(74, 163, 255, 0.25)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      position: "relative",
      zIndex: 2,
      overflow: "hidden",
    },
    sectionHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 163, 255, 0.4)",
    },
    subtitle: {
      fontSize: isMobile ? "1.4rem" : "1.7rem",
      marginBottom: 16,
      background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 600,
      letterSpacing: "0.5px",
      paddingBottom: 8,
      borderBottom: "2px solid rgba(74, 163, 255, 0.3)",
    },
    paragraph: {
      fontSize: isMobile ? 14 : 15,
      marginBottom: 14,
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 1.7,
    },
    floatingHeaderWrapper: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      pointerEvents: "none",
      display: "flex",
      justifyContent: "center",
      paddingTop: isMobile ? 6 : 8,
    },
    floatingHeader: {
      position: "relative",
      top: 0,
      left: 0,
      right: 0,
      maxWidth: 1150,
      background: "linear-gradient(90deg, #10132b 85%, #21235a 100%)",
      borderRadius: "18px",
      margin: "0 12px",
      boxShadow:
        "0 2px 24px 0 rgba(74,163,255,0.13), 0 0 0 1.5px rgba(74,163,255,0.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pointerEvents: "auto",
      padding: isMobile ? "12px 10px" : "18px 40px",
      border: "1px solid rgba(74,163,255,0.14)",
      transform: isHeaderVisible
        ? "translateY(0)"
        : "translateY(-110%)",
      transition:
        "transform 0.3s cubic-bezier(.45,.45,.05,1), box-shadow 0.2s",
      zIndex: 1000,
    },
    headerLogoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minWidth: isMobile ? 130 : 200,
    },
    headerLogo: {
      width: isMobile ? 34 : 44,
      height: isMobile ? 34 : 44,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 18px 4px rgba(74,163,255,0.18)",
      border: "2px solid rgba(74,163,255,0.17)",
      overflow: "hidden",
    },
    headerTitle: {
      color: "#fff",
      fontWeight: 700,
      fontSize: isMobile ? 16 : 18,
      background:
        "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      userSelect: "none",
    },
    headerNav: {
      display: "flex",
      gap: isMobile ? 10 : 26,
      alignItems: "center",
    },
    headerLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 13 : 14,
      padding: isMobile ? "6px 10px" : "8px 14px",
      borderRadius: "20px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      userSelect: "none",
    },
    headerLinkHover: {
      background: "rgba(74, 163, 255, 0.15)",
    },
    headerLinkActive: {
      background:
        "linear-gradient(90deg, #4aa3ff 15%, #8a2be2 95%)",
      color: "#fff",
      boxShadow: "0 0 14px 3px #4aa3ff39",
    },
    headerCta: {
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: isMobile ? "8px 14px" : "10px 18px",
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 13 : 14,
      fontWeight: 500,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(74, 163, 255, 0.3)",
      cursor: "pointer",
      userSelect: "none",
    },
    headerCtaHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(74, 163, 255, 0.5)",
    },
    glow: {
      position: "fixed",
      width: isMobile ? "300px" : "500px",
      height: isMobile ? "300px" : "500px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(74, 163, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
      top: `calc(-150px + ${scrollPosition * 0.1}px)`,
      right: `calc(-150px + ${scrollPosition * 0.05}px)`,
      pointerEvents: "none",
      zIndex: 0,
      transition: "top 0.1s ease, right 0.1s ease",
    },
    glow2: {
      position: "fixed",
      width: isMobile ? "250px" : "400px",
      height: isMobile ? "250px" : "400px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
      bottom: `calc(-125px + ${scrollPosition * -0.1}px)`,
      left: `calc(-125px + ${scrollPosition * -0.05}px)`,
      pointerEvents: "none",
      zIndex: 0,
      transition: "bottom 0.1s ease, left 0.1s ease",
    },
    floatingShortsButton: {
      position: "fixed",
      right: isMobile ? "15px" : "20px",
      bottom: isMobile ? "15px" : "20px",
      width: isMobile ? "50px" : "60px",
      height: isMobile ? "50px" : "60px",
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: isMobile ? "20px" : "24px",
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
  const particles = Array.from({ length: isMobile ? 10 : 15 }, (_, i) => {
    const size = Math.random() * 6 + 2;
    return {
      id: i,
      size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    };
  });

  return (
    <main style={styles.page}>
      {/* Floating Header Wrapper */}
      <div style={styles.floatingHeaderWrapper}>
        <header style={styles.floatingHeader}>
          <div style={styles.headerLogoContainer}>
            <div style={styles.headerLogo}>
              <img
                src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
                alt="PropScholar Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <span style={styles.headerTitle}>PropScholar</span>
          </div>

          <nav style={styles.headerNav}>
            {[
              { label: "Home", href: "/" },
              { label: "Platforms", href: "/platforms" },
              { label: "Shop", href: "/shop" },
              { label: "FAQ", href: "/faq" },
              { label: "Community", href: "/community" },
              { label: "About", href: "/about" },
            ].map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...styles.headerLink,
                  ...(hoverStates.headerLink[idx] && styles.headerLinkHover),
                  ...(item.href === "/about" && styles.headerLinkActive),
                }}
                onMouseEnter={() => handleHover("headerLink", idx, true)}
                onMouseLeave={() => handleHover("headerLink", idx, false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/get-started"
              style={{
                ...styles.headerCta,
                ...(hoverStates.headerCta && styles.headerCtaHover),
              }}
              onMouseEnter={() => handleHover("headerCta", 0, true)}
              onMouseLeave={() => handleHover("headerCta", 0, false)}
            >
              Get Started
            </a>
          </nav>
        </header>
      </div>

      {/* Background Glow Effects */}
      <div style={styles.glow}></div>
      <div style={styles.glow2}></div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            animation: `float ${Math.random() * 10 + 5}s ease-in-out ${
              particle.animationDelay
            } infinite`,
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
        onClick={() => window.open("https://www.propscholar.space", "_blank")}
      >
        <span style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))" }}>🎬</span>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <img
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
              alt="PropScholar Logo"
              style={styles.logoImg}
            />
          </div>
          <h1 style={styles.title}>
            Making Trading Accessible
            <span style={styles.titleUnderline}></span>
          </h1>
        </div>
        <p style={styles.paragraph}>
          Our mission is to make trading accessible for everyone by providing
          scholarship grants.
        </p>
        <p style={styles.paragraph}>
          In exchange we take a simple evaluation/test. If traders complete the
          test successfully, we provide the scholarship.
        </p>
        <section
          style={{
            ...styles.section,
            ...(hoverStates.section[0] && styles.sectionHover),
          }}
          onMouseEnter={() => handleHover("section", 0, true)}
          onMouseLeave={() => handleHover("section", 0, false)}
        >
          <h2 style={styles.subtitle}>Our Mission</h2>
          <p style={styles.paragraph}>
            Through this scholarship, traders can afford anything they want in
            their journey of becoming a professional trader. We are not a prop
            firm; we are a scholarship-based model where traders can evaluate
            themselves by taking part in an evaluation which will ultimately
            grant scholarship. Skill-based evaluation system.
          </p>
        </section>
        <section
          style={{
            ...styles.section,
            ...(hoverStates.section[1] && styles.sectionHover),
          }}
          onMouseEnter={() => handleHover("section", 1, true)}
          onMouseLeave={() => handleHover("section", 1, false)}
        >
          <h2 style={styles.subtitle}>Our Vision</h2>
          <p style={styles.paragraph}>
            Our vision is to make the process skill-based. We want to eliminate
            the capital barrier in a trader's journey. Using our platform, a
            trader can use their skill and earn a scholarship which will support
            their journey.
          </p>
          <p style={styles.paragraph}>
            By using our platform one can prove themselves by providing a
            skill-based test and hence passing, claiming, and earning a
            scholarship from us.
          </p>
        </section>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0.7); }
            70% { box-shadow: 0 0 0 12px rgba(74, 163, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0); }
          }
          @media (max-width: 768px) {
            nav {
              gap: 8px;
            }
          }
        `}
      </style>
    </main>
  );
};

export default About;
