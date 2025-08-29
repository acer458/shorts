import React, { useState, useEffect } from "react";

const navItems = [
  // Change URLs in 'href' fields as needed
  { label: "Home", href: "/" },
  { label: "Platforms", href: "/platforms" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

const About = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    headerLink: Array(navItems.length).fill(false),
    headerCta: false,
    section: [false, false],
  });

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
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

  // Header positioning here!
  const styles = {
    page: {
      background: "linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%)",
      color: "#fff",
      minHeight: "100vh",
      padding: isMobile ? "40px 8px" : "60px 24px",
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
      paddingTop: 64,
    },
    // Move header lower on both desktop and mobile
    floatingHeaderWrapper: {
      position: "fixed",
      top: isMobile ? 10 : 32,  // Moves header lower (desktop: 32px, mobile: 10px)
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      zIndex: 2000,
      pointerEvents: "auto",
      background: "transparent",
    },
    floatingHeader: {
      width: "100%",
      maxWidth: 1150,
      margin: "0 auto",
      borderRadius: "18px",
      background: "linear-gradient(90deg, #10132b 85%, #21235a 100%)",
      boxShadow: "0 2px 24px 0 rgba(74,163,255,0.13), 0 0 0 1.5px rgba(74,163,255,0.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "9px 3px" : "18px 40px", // smaller on mobile
      border: "1px solid rgba(74,163,255,0.14)",
      color: "#fff",
      userSelect: "none",
      overflow: "hidden",
    },
    headerLogoContainer: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 7 : 14,
      minWidth: isMobile ? 65 : 170, // Smaller min width mobile
      flexShrink: 0,
    },
    headerLogo: {
      width: isMobile ? 23 : 44,    // Smaller logo mobile
      height: isMobile ? 23 : 44,   // Smaller logo mobile
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
      fontSize: isMobile ? 13 : 18, // Smaller title on mobile
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    headerNav: {
      display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 0 : 22,
      position: isMobile ? "absolute" : "static",
      top: "46px",
      right: "10px",
      background: isMobile ? "rgba(16,19,43,0.97)" : "none",
      borderRadius: isMobile ? "12px" : 0,
      boxShadow: isMobile ? "0 6px 22px 0 rgba(74,163,255,0.13)" : "none",
      minWidth: isMobile ? 120 : undefined,
      width: isMobile ? "max-content" : undefined,
      zIndex: isMobile ? 5000 : "auto",
      padding: isMobile ? "7px 6px" : 0,
      transition: "all 0.3s",
    },
    headerLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 12.5 : 15,
      padding: isMobile ? "8px 0" : "8px 14px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.3s",
      userSelect: "none",
      width: isMobile ? "100%" : "auto",
      display: "block",
      textAlign: isMobile ? "left" : "center",
      marginLeft: isMobile ? 0 : undefined,
      marginBottom: isMobile ? 2 : 0,
    },
    headerLinkHover: {
      background: "rgba(74, 163, 255, 0.13)",
    },
    headerLinkActive: {
      background: "linear-gradient(90deg, #4aa3ff 15%, #8a2be2 95%)",
      boxShadow: "0 0 14px 3px #4aa3ff39",
      color: "#fff",
    },
    headerCta: {
      // Change GET STARTED button link below where it's used in <a href=...>
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: isMobile ? "8px 11px" : "10px 18px",
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 12.5 : 15,
      fontWeight: 500,
      transition: "all 0.3s",
      boxShadow: "0 4px 12px rgba(74, 163, 255, 0.3)",
      cursor: "pointer",
      userSelect: "none",
      marginTop: isMobile ? 7 : 0,
      width: isMobile ? "100%" : undefined,
      textAlign: isMobile ? "center" : "left",
    },
    headerCtaHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(74, 163, 255, 0.5)",
    },
    hamburger: {
      display: isMobile ? "flex" : "none",
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
      background: "none",
      border: "none",
      cursor: "pointer",
      zIndex: 5100,
      position: "relative",
    },
    hamburgerBars: {
      display: "block",
      background: "#4aa3ff",
      height: 3,
      borderRadius: 2,
      width: 22,
      margin: "0 auto",
      transition: "all 0.4s",
      position: "relative",
    },
    hamburgerBarsMid: {
      margin: "4px 0",
    },
    hamburgerBarsOpen1: {
      transform: "rotate(45deg) translate(5px, 4px)",
    },
    hamburgerBarsOpen2: {
      opacity: 0,
    },
    hamburgerBarsOpen3: {
      transform: "rotate(-45deg) translate(5px, -3px)",
    },
    // Rest are unchanged
    title: {
      fontSize: isMobile ? "1.3rem" : "clamp(2rem, 4vw, 2.8rem)",
      margin: 0,
      paddingBottom: 12,
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
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
      fontSize: isMobile ? 13 : 15,
      marginBottom: 14,
      color: "rgba(255, 255, 255, 0.93)",
      lineHeight: 1.70,
    },
    section: {
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: isMobile ? "15px" : "28px",
      marginBottom: "30px",
      border: "1px solid rgba(255,255,255,0.13)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.40), 0 0 15px rgba(74, 163, 255, 0.25)",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    sectionHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.52), 0 0 20px rgba(74, 163, 255, 0.37)",
    },
  };

  function handleHamburgerKey(e) {
    if (e.key === " " || e.key === "Enter") setMenuOpen((prev) => !prev);
  }

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
            <button
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="nav"
              style={styles.hamburger}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={handleHamburgerKey}
              tabIndex={0}
            >
              <span
                style={{
                  ...styles.hamburgerBars,
                  ...(menuOpen ? styles.hamburgerBarsOpen1 : {}),
                }}
              />
              <span
                style={{
                  ...styles.hamburgerBars,
                  ...styles.hamburgerBarsMid,
                  ...(menuOpen ? styles.hamburgerBarsOpen2 : {}),
                }}
              />
              <span
                style={{
                  ...styles.hamburgerBars,
                  ...(menuOpen ? styles.hamburgerBarsOpen3 : {}),
                }}
              />
            </button>
          </div>
          <nav id="nav" style={styles.headerNav} aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a
                // Change nav links here:
                // Example: href="/your-page"
                key={item.href}
                href={item.href}
                style={{
                  ...styles.headerLink,
                  ...(hoverStates.headerLink[index] && styles.headerLinkHover),
                  ...(item.href === "/about" && styles.headerLinkActive),
                }}
                onMouseEnter={() => handleHover("headerLink", index, true)}
                onMouseLeave={() => handleHover("headerLink", index, false)}
                tabIndex={menuOpen || !isMobile ? 0 : -1}
              >
                {item.label}
              </a>
            ))}
            <a
              // Change Get Started link here:
              href="/get-started"
              style={{
                ...styles.headerCta,
                ...(hoverStates.headerCta && styles.headerCtaHover),
              }}
              onMouseEnter={() => handleHover("headerCta", 0, true)}
              onMouseLeave={() => handleHover("headerCta", 0, false)}
              tabIndex={menuOpen || !isMobile ? 0 : -1}
            >
              Get Started
            </a>
          </nav>
        </header>
      </div>
      <main style={styles.page}>
        <div style={styles.container}>
          <header>
            <h1 style={styles.title}>
              Making Trading Accessible
              <span style={styles.titleUnderline}></span>
            </h1>
          </header>
          <p style={styles.paragraph}>
            Our mission is to make trading accessible for everyone by providing scholarship grants.
          </p>
          <p style={styles.paragraph}>
            In exchange, we take a simple evaluation/test. If traders complete the test successfully, we provide the scholarship.
          </p>
          <section
            style={{
              ...styles.section,
              ...(hoverStates.section[0] && styles.sectionHover),
            }}
            onMouseEnter={() =>
              setHoverStates((prev) => ({ ...prev, section: [true, prev.section[1]] }))
            }
            onMouseLeave={() =>
              setHoverStates((prev) => ({ ...prev, section: [false, prev.section[1]] }))
            }
          >
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? 15 : 22, marginBottom: 8 }}>
              Our Mission
            </h2>
            <p style={styles.paragraph}>
              Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
            </p>
          </section>
          <section
            style={{
              ...styles.section,
              ...(hoverStates.section[1] && styles.sectionHover),
            }}
            onMouseEnter={() =>
              setHoverStates((prev) => ({ ...prev, section: [prev.section[0], true] }))
            }
            onMouseLeave={() =>
              setHoverStates((prev) => ({ ...prev, section: [prev.section[0], false] }))
            }
          >
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? 15 : 22, marginBottom: 8 }}>
              Our Vision
            </h2>
            <p style={styles.paragraph}>
              Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
            </p>
            <p style={styles.paragraph}>
              By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default About;

// To change any button or nav link, simply edit the href value above in the navItems list or in the Get Started <a> tag!
