import React, { useState, useEffect } from "react";

// Configurable social icons URLs
const socialIcons = {
  discord: "https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg", // Change Discord icon URL here
  instagram: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png", // Change Instagram icon URL here
};

// Navigation items
const navItems = [
  { label: "Home", href: "/" },
  { label: "Platforms", href: "/platforms" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];

// Community Block Component
const CommunityBlock = () => {
  const styles = {
    wrapper: {
      maxWidth: 900,
      margin: "54px auto",
      padding: "48px 24px 36px 24px",
      borderRadius: "30px",
      background: "rgba(50,100,255,0.17)",
      boxShadow: "0 4px 32px 0 rgba(74,163,255,0.19)",
      textAlign: "center",
      color: "#f1f3fa",
      backdropFilter: "blur(22px)",
      border: "1px solid rgba(64,91,255,0.16)",
    },
    iconRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "18px",
    },
    blockIconWrap: {
      background: "#3b5ae2",
      borderRadius: "15px",
      width: 54,
      height: 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    blockIcon: {
      width: 32,
      height: 32,
      display: "block",
    },
    title: {
      fontSize: "2.1rem",
      fontWeight: 800,
      color: "#e5ecff",
      margin: 0,
      letterSpacing: 1.2,
    },
    desc: {
      margin: "18px 0 36px 0",
      fontSize: "1.18rem",
      maxWidth: 700,
      marginLeft: "auto",
      marginRight: "auto",
      color: "#e5e6ed",
      lineHeight: 1.7,
    },
    btnRow: {
      display: "flex",
      justifyContent: "center",
      marginTop: "22px",
    },
    socialBtn: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "#2140df",
      border: "1.8px solid #4aa3ff",
      color: "#fff",
      fontWeight: 600,
      fontSize: "1.09rem",
      padding: "10px 26px",
      borderRadius: "13px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.17s, box-shadow 0.21s",
    },
    socialBtnImg: {
      width: "25px",
      height: "25px",
      objectFit: "contain",
      borderRadius: "5px",
      background: "none",
    },
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.iconRow}>
        <div style={styles.blockIconWrap}>
          <svg style={styles.blockIcon} viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="8" fill="#417bf3" />
            <path d="M8 19c0-2 2-4 7-4s7 2 7 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="12" r="3.5" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
        <h2 style={styles.title}>The Community</h2>
      </div>
      <div style={styles.desc}>
        We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
      </div>
      <div style={styles.btnRow}>
        <a
          href="https://discord.com/invite/your-community"
          style={styles.socialBtn}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={socialIcons.discord}
            alt="Discord Logo"
            style={styles.socialBtnImg}
          />
          Discord
        </a>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const styles = {
    wrapper: {
      width: "100%",
      background: "linear-gradient(135deg, #10132b 0%, #181c3b 100%)",
      color: "#e6eaff",
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: 16,
      paddingTop: 60,
      paddingBottom: 24,
    },
    colsRow: {
      display: "flex",
      justifyContent: "center",
      gap: "120px",
      maxWidth: 1200,
      margin: "0 auto",
      flexWrap: "wrap",
      textAlign: "left",
    },
    col: {
      minWidth: 180,
      flex: "1 1 220px",
    },
    colTitle: {
      fontWeight: 700,
      fontSize: 21,
      marginBottom: 16,
      marginTop: 0,
      letterSpacing: "0.01em",
    },
    company: { color: "#4aa3ff" },
    contact: { color: "#ffcb29" },
    social: { color: "#31d17a" },
    link: {
      color: "#e6eaff",
      textDecoration: "none",
      display: "block",
      marginBottom: 13,
      fontWeight: 500,
      fontSize: 16,
      transition: "color 0.16s",
    },
    divider: {
      width: "92%",
      maxWidth: 1200,
      height: 1,
      background: "rgba(128,150,255,0.18)",
      margin: "50px auto 30px auto",
    },
    lowerBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: 1200,
      margin: "0 auto",
      width: "92%",
      flexWrap: "wrap",
      gap: 18,
      fontSize: 15,
      color: "#8b98b7",
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      minWidth: 180,
    },
    logoImg: {
      width: 32,
      height: 32,
      objectFit: "contain",
      borderRadius: "50%",
      background: "none",
    },
    brand: {
      fontWeight: 700,
      fontSize: 18,
      background: "linear-gradient(90deg,#4aa3ff 15%, #fff 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    copyright: {
      fontSize: 15,
      color: "#e6eaff",
      flex: 2,
      textAlign: "center",
    },
    lowerLinks: {
      display: "flex",
      gap: 22,
      alignItems: "center",
      fontWeight: 500,
      fontSize: 15,
      minWidth: 130,
      justifyContent: "flex-end",
    },
    lowerLink: {
      color: "#e6eaff",
      textDecoration: "none",
      opacity: 0.7,
      transition: "opacity 0.2s",
      fontWeight: 500,
      fontSize: 15,
    },
    disclaimer: {
      margin: "30px auto 0 auto",
      color: "#b0b7cc",
      fontSize: 13.2,
      lineHeight: 1.58,
      maxWidth: 1200,
      textAlign: "left",
    },
    disclaimerTitle: {
      fontWeight: 700,
      color: "#f3f3f7",
      marginBottom: 3,
      fontSize: 14,
      display: "block",
      letterSpacing: 0.01,
    },
  };
  return (
    <footer style={styles.wrapper}>
      {/* Top row: Three columns, centered */}
      <div style={styles.colsRow}>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.company }}>Company</div>
          <a href="https://propscholar.com/about" style={styles.link} target="_blank" rel="noopener noreferrer">
            About Us
          </a>
          <a href="#" style={styles.link} target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </a>
          <a href="#" style={styles.link} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a href="https://help.propscholar.com" style={styles.link} target="_blank" rel="noopener noreferrer">
            FAQ
          </a>
        </div>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.contact }}>Contact</div>
          <div style={{ marginBottom: 9 }}>Email Support</div>
          <a href="mailto:support@propscholar.shop" style={{ ...styles.link, color: "#4aa3ff" }} target="_blank" rel="noopener noreferrer">
            support@propscholar.shop
          </a>
        </div>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.social }}>Socials</div>
          <a href="https://instagram.com/yourprofile" style={styles.link} target="_blank" rel="noopener noreferrer">
            <img src={socialIcons.instagram} alt="Instagram" style={{ width: 18, height: 18, marginRight: 8 }} />
            Instagram
          </a>
          <a href="https://x.com/propscholar" style={styles.link} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" fill="none" style={{ marginRight: 6 }} aria-hidden="true">
              <path
                d="M17 4.47c-.49.21-1.01.35-1.56.41A2.50 2.50 0 0 0 16.5 3.02c-.5.3-1.04.52-1.62.64A2.5 2.5 0 0 0 8.5 5.7c-3.02 0-4.95-2.5-4.95-4.56 0-.27.03-.54.08-.79C2.28.71 1.37 1.37 1.05 2.26c-.28.71-.31 1.59.33 2.04A2.54 2.54 0 0 1 .6 3.51c0 .04.01.09.01.13 0 1.4.53 2.52 1.49 3.18a2.5 2.5 0 0 1-1.13-.03c.02.75.59 1.38 1.29 1.46a2.5 2.5 0 0 1-1.18.04c.33 1.03 1.28 1.78 2.4 1.8A4.99 4.99 0 0 1 1 15.07c.63.52 1.35.83 2.13.89a7.06 7.06 0 0 1-5.51-.01 9.42 9.42 0 0 0 5.19 1.51c10.43 0 16.14-8.18 16.14-15.26 0-.23-.01-.45-.02-.68A11.52 11.52 0 0 0 17 4.47Z"
                fill="#e6eaff"
              />
            </svg>
            X
          </a>
          <a href="https://www.trustpilot.com/review/propscholar.com" style={styles.link} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" fill="none" style={{ marginRight: 6 }} aria-hidden="true">
              <polygon points="9,2 11,7 16,7 12,10.5 13.5,16 9,12.8 4.5,16 6,10.5 2,7 7,7" stroke="#e6eaff" strokeWidth="1.2" fill="none" />
            </svg>
            Trustpilot
          </a>
          <a href="https://discord.gg/ZXqcq5Mj" style={styles.link} target="_blank" rel="noopener noreferrer">
            <img src={socialIcons.discord} alt="Discord" style={{ width: 18, height: 18, marginRight: 8 }} />
            Discord
          </a>
        </div>
      </div>
      {/* Divider Line */}
      <div style={styles.divider} />
      {/* Lower bar: Logo (left), Copyright (center), Terms/Privacy (right) */}
      <div style={styles.lowerBar}>
        <div style={styles.logoRow}>
          <img
            src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
            alt="PropScholar Logo"
            style={styles.logoImg}
          />
          <span style={styles.brand}>PropScholar</span>
        </div>
        <div style={styles.copyright}>
          © 2025 PropScholar. All rights reserved.
        </div>
        <div style={styles.lowerLinks}>
          <a href="#" style={styles.lowerLink} target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="#" style={styles.lowerLink} target="_blank" rel="noopener noreferrer">Privacy</a>
        </div>
      </div>
      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <span style={styles.disclaimerTitle}>Disclaimer:</span>
        PropScholar is a government-registered business under the MSME (Udyam) initiative. All Test/Evaluation accounts provided by PropScholar are simulated and do not involve real financial transactions or live market exposure. We are strictly an educational platform, and our programs are designed to assess trading skills in a simulated environment. Our evaluation process is entirely skill-based, and successful participants may be eligible for a scholarship award. PropScholar does not act as or offer services as a broker, custodian, or financial advisor. Participation in our programs is voluntary, and program fees are not to be considered deposits or investments of any kind. All program fees are used solely to cover operational expenses, including but not limited to staffing, technology infrastructure, and other business-related costs. Nothing contained on our platform or in our materials constitutes a solicitation or offer to buy or sell any financial instrument, including but not limited to futures, options, or foreign exchange products.
      </div>
    </footer>
  );
};
// Header Component
const Header = ({ isMobile, menuOpen, setMenuOpen, hoverStates, handleHover }) => {
  const styles = {
    floatingHeaderWrapper: {
      position: "fixed",
      top: isMobile ? 10 : 32,
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
      boxShadow: "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "9px 3px" : "18px 40px",
      border: "none",
      color: "#fff",
      userSelect: "none",
      overflow: "hidden",
    },
    headerLogoContainer: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 7 : 14,
      minWidth: isMobile ? 65 : 170,
      flexShrink: 0,
    },
    headerLogo: {
      width: isMobile ? 24 : 48,
      height: isMobile ? 24 : 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      boxShadow: "none",
      marginRight: 4,
    },
    headerTitle: {
      fontWeight: 700,
      fontSize: isMobile ? 13 : 18,
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginLeft: 4
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
      boxShadow: "none",
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
    headerLinkHover: { background: "rgba(74, 163, 255, 0.13)" },
    headerLinkActive: {
      background: "linear-gradient(90deg, #4aa3ff 15%, #8a2be2 95%)",
      color: "#fff",
    },
    headerCta: {
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
    hamburgerBarsMid: { margin: "4px 0" },
    hamburgerBarsOpen1: { transform: "rotate(45deg) translate(5px, 4px)" },
    hamburgerBarsOpen2: { opacity: 0 },
    hamburgerBarsOpen3: { transform: "rotate(-45deg) translate(5px, -3px)" },
  };
  function handleHamburgerKey(e) {
    if (e.key === " " || e.key === "Enter") setMenuOpen((prev) => !prev);
  }
  return (
    <div style={styles.floatingHeaderWrapper}>
      <header style={styles.floatingHeader}>
        <div style={styles.headerLogoContainer}>
          <img
            src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar\_u6jhij.png"
            alt="PropScholar Logo"
            style={styles.headerLogo}
          />
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
            <span style={{ ...styles.hamburgerBars, ...(menuOpen ? styles.hamburgerBarsOpen1 : {}) }} />
            <span style={{ ...styles.hamburgerBars, ...styles.hamburgerBarsMid, ...(menuOpen ? styles.hamburgerBarsOpen2 : {}) }} />
            <span style={{ ...styles.hamburgerBars, ...(menuOpen ? styles.hamburgerBarsOpen3 : {}) }} />
          </button>
        </div>
        <nav id="nav" style={styles.headerNav} aria-label="Main navigation">
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
              tabIndex={menuOpen || !isMobile ? 0 : -1}
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
            tabIndex={menuOpen || !isMobile ? 0 : -1}
          >
            Get Started
          </a>
        </nav>
      </header>
    </div>
  );
};
// Main Page Component
const MainPage = () => {
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
      [type]: type === "headerCta"
        ? isHovered
        : prev[type].map((item, i) => (i === index ? isHovered : item)),
    }));
  };
  // Styles for Main content and sections
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
      lineHeight: 1.7,
    },
    section: {
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: isMobile ? "15px" : "28px",
      marginBottom: "30px",
      border: "none",
      boxShadow: "none",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    sectionHover: { transform: "translateY(-3px)" },
  };
  return (
    <>
      <Header
        isMobile={isMobile}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        hoverStates={hoverStates}
        handleHover={handleHover}
      />
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
            style={{ ...styles.section }}
            onMouseEnter={() => setHoverStates(prev => ({ ...prev, section: [true, prev.section[1]] }))}
            onMouseLeave={() => setHoverStates(prev => ({ ...prev, section: [false, prev.section[1]] }))}
          >
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? 15 : 22, marginBottom: 8 }}>
              Our Mission
            </h2>
            <p style={styles.paragraph}>
              Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
            </p>
          </section>
          <section
            style={{ ...styles.section }}
            onMouseEnter={() => setHoverStates(prev => ({ ...prev, section: [prev.section[0], true] }))}
            onMouseLeave={() => setHoverStates(prev => ({ ...prev, section: [prev.section[0], false] }))}
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
      <CommunityBlock />
      <Footer />
    </>
  );
};
export default MainPage;
