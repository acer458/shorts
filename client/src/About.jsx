import React, { useState, useEffect } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Platforms", href: "/platforms" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

const About = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoverStates, setHoverStates] = useState({
    headerLink: Array(navItems.length).fill(false),
    headerCta: false,
    section: Array(2).fill(false),
  });

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
      padding: isMobile ? "40px 8px" : "60px 0",
      fontFamily: "'Inter', Arial, sans-serif",
      lineHeight: 1.6,
      maxWidth: "100%",
      margin: 0,
      position: "relative",
      overflowX: "hidden",
    },
    container: {
      width: "100%",
      maxWidth: 900,
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
      paddingTop: 80,
      paddingLeft: isMobile ? 0 : 24,
      paddingRight: isMobile ? 0 : 24,
    },
    floatingHeaderWrapper: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      zIndex: 2000,
      pointerEvents: "auto",
      background: "transparent",
    },
    floatingHeader: {
      width: "100%",
      maxWidth: 1200,
      margin: "0 auto",
      borderRadius: "18px",
      background: "linear-gradient(90deg, #10132b 85%, #21235a 100%)",
      boxShadow:
        "0 2px 24px 0 rgba(74,163,255,0.13), 0 0 0 1.5px rgba(74,163,255,0.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "10px 8px" : "18px 40px",
      border: "1px solid rgba(74,163,255,0.14)",
      color: "#fff",
      userSelect: "none",
    },
    headerLogoContainer: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "10px" : "16px",
      minWidth: isMobile ? 90 : 180,
    },
    headerLogo: {
      width: isMobile ? 32 : 42,
      height: isMobile ? 32 : 42,
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
      fontWeight: 700,
      fontSize: isMobile ? 16 : 18,
      background:
        "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    headerNav: {
      display: "flex",
      gap: isMobile ? 6 : 20,
      alignItems: "center",
      flexWrap: isMobile ? "nowrap" : "wrap",
      overflowX: isMobile ? "auto" : "visible",
      maxWidth: isMobile ? "calc(100vw - 150px)" : "unset", // keep within screen
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    },
    headerLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 13 : 14,
      padding: isMobile ? "6px 8px" : "8px 14px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      userSelect: "none",
      whiteSpace: "nowrap",
    },
    headerLinkHover: {
      background: "rgba(74, 163, 255, 0.15)",
    },
    headerLinkActive: {
      background: "linear-gradient(90deg, #4aa3ff 15%, #8a2be2 95%)",
      color: "#fff",
      boxShadow: "0 0 14px 3px #4aa3ff39",
    },
    headerCta: {
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: isMobile ? "8px 10px" : "10px 18px",
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 13 : 14,
      fontWeight: 500,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(74, 163, 255, 0.3)",
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
      marginLeft: isMobile ? 6 : 16,
      flexShrink: 0,
    },
    headerCtaHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(74, 163, 255, 0.5)",
    },
    title: {
      fontSize: isMobile ? "1.7rem" : "2.3rem",
      margin: 0,
      paddingBottom: 12,
      background:
        "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
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
    paragraph: {
      fontSize: isMobile ? 14 : 15,
      marginBottom: 14,
      color: "rgba(255, 255, 255, 0.92)",
      lineHeight: 1.7,
    },
    section: {
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: isMobile ? "16px" : "28px",
      marginBottom: "30px",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(74, 163, 255, 0.25)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    sectionHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 163, 255, 0.4)",
    },
    subtitle: {
      fontWeight: 700,
      letterSpacing: "0.02em",
      fontSize: isMobile ? 16 : 18,
      color: "#fff",
      marginBottom: 8,
    },
  };

  return (
    <>
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
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...styles.headerLink,
                  ...(hoverStates.headerLink[index] && styles.headerLinkHover),
                  ...(item.href === "/about" && styles.headerLinkActive),
                }}
                onMouseEnter={() => handleHover("headerLink", index, true)}
                onMouseLeave={() => handleHover("headerLink", index, false)}
                tabIndex={0}
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
              tabIndex={0}
            >
              Get Started
            </a>
          </nav>
        </header>
      </div>
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              Making Trading Accessible
              <span style={styles.titleUnderline}></span>
            </h1>
          </div>
          <p style={styles.paragraph}>
            Our mission is to make trading accessible for everyone by providing scholarship grants.
          </p>
          <p style={styles.paragraph}>
            In exchange we take a simple evaluation/test. If traders complete the test successfully, we provide the scholarship.
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
              Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
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
              Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
            </p>
            <p style={styles.paragraph}>
              By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
            </p>
          </section>
        </div>
      </main>
      {/* Hide header scrollbar for aesthetics */}
      <style>
        {`
        @media (max-width: 767px) {
          header nav::-webkit-scrollbar { display: none; }
        }
        `}
      </style>
    </>
  );
};

export default About;
