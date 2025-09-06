import React, { useState, useEffect } from "react";

// Social icons URLs
const socialIcons = {
  discord: "https://res.cloudinary.com/dzozyqlqr/image/upload/v1755663423/Untitled_design_5_xpanov.png",
  instagram: "https://res.cloudinary.com/dzozyqlqr/image/upload/v1755663376/Untitled_design_2_ekcm2e.png",
  x: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e6eaff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const navItems = [
  { label: "Home", href: "https://www.propscholar.com" },
  { label: "Community", href: "https://propscholar.space/community" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

const Header = ({ isMobile, menuOpen, setMenuOpen, hoverStates, handleHover }) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonPress = (index) => {
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleHamburgerClick = () => setMenuOpen((open) => !open);

  const styles = {
    floatingHeaderWrapper: {
      position: "fixed",
      top: isMobile ? 10 : 32,
      left: 0,
      right: 0,
      zIndex: 2000,
      background: "transparent",
    },
    floatingHeader: {
      width: isMobile ? "90%" : "100%",
      maxWidth: 1150,
      margin: "0 auto",
      borderRadius: "18px",
      background: "linear-gradient(90deg, #10132b 85%, #21235a 100%)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "12px 16px" : "18px 40px",
      color: "#fff",
      border: "none",
      overflow: "visible",
      position: "relative",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    },
    headerLogoContainer: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? 7 : 14,
      minWidth: isMobile ? 65 : 170,
      zIndex: 2001,
    },
    headerLogo: {
      width: isMobile ? 28 : 48,
      height: isMobile ? 28 : 48,
      display: "flex",
      objectFit: "contain",
      borderRadius: "8px",
      background: "#000",
    },
    headerTitle: {
      fontWeight: 700,
      fontSize: isMobile ? 13 : 18,
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginLeft: 4,
    },
    hamburger: {
      display: isMobile ? "flex" : "none",
      width: 38,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(19,28,53,0.93)",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      zIndex: 5101,
      boxShadow: "0 2px 10px rgba(34,58,110,0.07)",
      transition: "background 0.18s",
      marginLeft: "auto",
      marginRight: 2,
      position: "absolute",
      right: 15,
      top: "50%",
      transform: "translateY(-50%)",
    },
    hamburgerIcon: {
      width: 28,
      height: 22,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    hamburgerLine: {
      height: 3,
      width: "100%",
      background: "#4aa3ff",
      borderRadius: 2,
      transition: "all 0.3s",
    },
    mobileMenuOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(20, 24, 43, 0.98)",
      zIndex: 5100,
      display: menuOpen ? "flex" : "none",
      flexDirection: "column",
      alignItems: "center",
      animation: menuOpen ? "fadeInMenu 0.2s" : "",
      paddingTop: 80,
    },
    mobileNav: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 20,
      gap: 18,
      width: "90%",
    },
    mobileNavLink: {
      fontSize: 18,
      color: "#e6eaff",
      textDecoration: "none",
      borderRadius: "10px",
      padding: "14px 0",
      width: "100%",
      textAlign: "center",
      fontWeight: 600,
      transition: "background 0.13s",
      background: "none",
      boxShadow: "none",
      cursor: "pointer",
      position: "relative",
    },
    mobileCta: {
      marginTop: 44,
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      color: "#fff",
      textDecoration: "none",
      fontSize: 17,
      fontWeight: 600,
      padding: "15px 0",
      borderRadius: "24px",
      width: "100%",
      boxShadow: "0 0 7px #4aa3ff, 0 0 14px #4aa3ff",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    desktopHeaderNav: {
      display: isMobile ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: isMobile ? 12 : 22,
      position: "static",
    },
    desktopNavLink: {
      color: "#fff",
      textDecoration: "none",
      fontSize: isMobile ? 13 : 15,
      padding: "8px 14px",
      borderRadius: "20px",
      fontWeight: 500,
      cursor: "pointer",
      background: "none",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      marginLeft: 0,
      marginBottom: 0,
      position: "relative",
      border: "1px solid transparent",
    },
    desktopCta: {
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: "10px 18px",
      color: "#fff",
      textDecoration: "none",
      fontSize: 15,
      fontWeight: 600,
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      boxShadow: "0 0 10px #4aa3ff, 0 0 20px #4aa3ff",
      cursor: "pointer",
      userSelect: "none",
      marginLeft: 7,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      transform: "scale(1)",
    },
    touchEffect: {
      position: "absolute",
      top: "-8px",
      left: "-8px",
      right: "-8px",
      bottom: "-8px",
      borderRadius: "28px",
      background: "rgba(74, 163, 255, 0.3)",
      opacity: 0,
      transition: "opacity 0.2s ease",
      pointerEvents: "none",
    },
    touchEffectActive: {
      opacity: 1,
    },
  };

  return (
    <div style={styles.floatingHeaderWrapper}>
      <header style={styles.floatingHeader}>
        <div style={styles.headerLogoContainer}>
          <img
            src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
            alt="PropScholar Logo"
            style={styles.headerLogo}
          />
          <span style={styles.headerTitle}>PropScholar</span>
        </div>
        {isMobile && (
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="nav"
            style={styles.hamburger}
            tabIndex={0}
            onClick={handleHamburgerClick}
          >
            <div style={styles.hamburgerIcon}>
              <span style={{...styles.hamburgerLine, transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none"}}></span>
              <span style={{...styles.hamburgerLine, opacity: menuOpen ? 0 : 1}}></span>
              <span style={{...styles.hamburgerLine, transform: menuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none"}}></span>
            </div>
          </button>
        )}
        {isMobile && menuOpen && (
          <div style={styles.mobileMenuOverlay} onClick={() => setMenuOpen(false)}>
            <nav id="nav" style={styles.mobileNav} aria-label="Main navigation">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                  onTouchStart={() => handleButtonPress(index)}
                >
                  {item.label}
                  <div 
                    style={{
                      ...styles.touchEffect,
                      ...(activeButton === index ? styles.touchEffectActive : {})
                    }}
                  />
                </a>
              ))}
              <a 
                href="/get-started" 
                style={styles.mobileCta} 
                onClick={() => setMenuOpen(false)}
                onTouchStart={() => handleButtonPress(navItems.length)}
              >
                Get Started
                <div 
                  style={{
                    ...styles.touchEffect,
                    ...(activeButton === navItems.length ? styles.touchEffectActive : {})
                  }}
                />
              </a>
            </nav>
          </div>
        )}
        {!isMobile && (
          <nav id="nav" style={styles.desktopHeaderNav} aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...styles.desktopNavLink,
                  position: "relative",
                  ...(hoverStates.headerLink[index] ? {
                    background: "linear-gradient(135deg, rgba(74, 163, 255, 0.15) 0%, rgba(138, 43, 226, 0.15) 100%)",
                    border: "1px solid rgba(74, 163, 255, 0.3)",
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 8px 25px rgba(74, 163, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    color: "#4aa3ff",
                  } : {}),
                }}
                onMouseEnter={() => handleHover("headerLink", index, true)}
                onMouseLeave={() => handleHover("headerLink", index, false)}
                onTouchStart={() => handleButtonPress(index)}
              >
                {item.label}
                <div 
                  style={{
                    ...styles.touchEffect,
                    ...(activeButton === index ? styles.touchEffectActive : {})
                  }}
                />
              </a>
            ))}
            <a
              href="/get-started"
              style={{
                ...styles.desktopCta,
                position: "relative",
                ...(hoverStates.headerCta ? {
                  transform: "translateY(-3px) scale(1.1) rotateZ(-1deg)",
                  boxShadow: "0 0 25px #4aa3ff, 0 0 50px #4aa3ff, 0 15px 35px rgba(74, 163, 255, 0.5)",
                  background: "linear-gradient(90deg, #5ab4ff 0%, #9a3bee 100%)",
                } : {}),
              }}
              onMouseEnter={() => handleHover("headerCta", 0, true)}
              onMouseLeave={() => handleHover("headerCta", 0, false)}
              onTouchStart={() => handleButtonPress(navItems.length)}
            >
              Get Started
              <div 
                style={{
                  ...styles.touchEffect,
                  ...(activeButton === navItems.length ? styles.touchEffectActive : {})
                }}
              />
            </a>
          </nav>
        )}
      </header>
    </div>
  );
};

const Footer = ({ isMobile }) => {
  const styles = {
    wrapper: {
      width: "100%",
      background: "linear-gradient(135deg, #10132b 0%, #181c3b 100%)",
      color: "#e6eaff",
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: isMobile ? 14 : 16,
      paddingTop: isMobile ? 40 : 60,
      paddingBottom: isMobile ? 20 : 24,
    },
    colsRow: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "40px" : "120px",
      maxWidth: 1200,
      margin: "0 auto",
      flexWrap: "wrap",
      textAlign: "left",
      padding: isMobile ? "0 16px" : 0,
      flexDirection: isMobile ? "column" : "row",
    },
    col: {
      minWidth: isMobile ? "100%" : 180,
      flex: isMobile ? "1 1 100%" : "1 1 220px",
    },
    colTitle: {
      fontWeight: 700,
      fontSize: isMobile ? 18 : 21,
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
      display: "flex",
      alignItems: "center",
      marginBottom: 13,
      fontWeight: 500,
      fontSize: isMobile ? 14 : 16,
      transition: "color 0.16s",
      gap: 8,
      borderRadius: "50%",
      padding: 2,
    },
    linkImg: {
      width: isMobile ? 16 : 18,
      height: isMobile ? 16 : 18,
      objectFit: "contain",
      borderRadius: "50%",
      background: "none",
      display: "block",
    },
    divider: {
      width: isMobile ? "85%" : "92%",
      maxWidth: 1200,
      height: 1,
      background: "rgba(128,150,255,0.18)",
      margin: isMobile ? "30px auto 20px" : "50px auto 30px auto",
    },
    lowerBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: 1200,
      margin: "0 auto",
      width: isMobile ? "85%" : "92%",
      flexWrap: "wrap",
      gap: isMobile ? 12 : 18,
      fontSize: isMobile ? 13 : 15,
      color: "#8b98b7",
      flexDirection: isMobile ? "column" : "row",
      textAlign: isMobile ? "center" : "left",
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      minWidth: isMobile ? "100%" : 180,
      justifyContent: isMobile ? "center" : "flex-start",
      marginBottom: isMobile ? 10 : 0,
    },
    logoImg: {
      width: isMobile ? 28 : 32,
      height: isMobile ? 28 : 32,
      objectFit: "contain",
      borderRadius: "8px",
      background: "#000",
    },
    brand: {
      fontWeight: 700,
      fontSize: isMobile ? 16 : 18,
      background: "linear-gradient(90deg,#4aa3ff 15%, #fff 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    copyright: {
      fontSize: isMobile ? 13 : 15,
      color: "#e6eaff",
      flex: isMobile ? "none" : 2,
      textAlign: "center",
      marginBottom: isMobile ? 10 : 0,
      order: isMobile ? 3 : "unset",
    },
    lowerLinks: {
      display: "flex",
      gap: isMobile ? 16 : 22,
      alignItems: "center",
      fontWeight: 500,
      fontSize: isMobile ? 13 : 15,
      minWidth: isMobile ? "100%" : 130,
      justifyContent: isMobile ? "center" : "flex-end",
      marginBottom: isMobile ? 10 : 0,
      order: isMobile ? 2 : "unset",
    },
    lowerLink: {
      color: "#e6eaff",
      textDecoration: "none",
      opacity: 0.7,
      transition: "opacity 0.2s",
      fontWeight: 500,
      fontSize: isMobile ? 13 : 15,
    },
    disclaimer: {
      margin: isMobile ? "20px auto 0" : "30px auto 0 auto",
      color: "#b0b7cc",
      fontSize: isMobile ? 12 : 13.2,
      lineHeight: 1.58,
      maxWidth: 1200,
      textAlign: "left",
      padding: isMobile ? "0 16px" : 0,
      width: isMobile ? "85%" : "auto",
    },
    disclaimerTitle: {
      fontWeight: 700,
      color: "#f3f3f7",
      marginBottom: 3,
      fontSize: isMobile ? 13 : 14,
      display: "block",
      letterSpacing: 0.01,
    },
  };

  return (
    <footer style={styles.wrapper}>
      <div style={styles.colsRow}>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.company }}>Company</div>
          <a
            href="https://propscholar.com/about"
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </a>
          <a href="#" style={styles.link} target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </a>
          <a href="#" style={styles.link} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a
            href="https://help.propscholar.com"
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            FAQ
          </a>
        </div>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.contact }}>Contact</div>
          <div style={{ marginBottom: 9, color: "#e6eaff", fontSize: isMobile ? 14 : 16 }}>Email Support</div>
          <a
            href="mailto:support@propscholar.shop"
            style={{ ...styles.link, color: "#4aa3ff" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            support@propscholar.shop
          </a>
        </div>
        <div style={styles.col}>
          <div style={{ ...styles.colTitle, ...styles.social }}>Socials</div>
          <a
            href="https://instagram.com/yourprofile"
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={socialIcons.instagram}
              alt="Instagram"
              style={styles.linkImg}
            />
            Instagram
          </a>
          <a
            href="https://x.com/propscholar"
            style={{
              ...styles.link,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 0,
              padding: 0,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {socialIcons.x}
            X
          </a>
          <a
            href="https://discord.gg/ZXqcq5Mj"
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={socialIcons.discord}
              alt="Discord"
              style={styles.linkImg}
            />
            Discord
          </a>
        </div>
      </div>
      <div style={styles.divider} />
      <div style={styles.lowerBar}>
        <div style={styles.logoRow}>
          <img
            src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
            alt="PropScholar Logo"
            style={styles.logoImg}
          />
          <span style={styles.brand}>PropScholar</span>
        </div>
        <div style={styles.copyright}>© 2025 PropScholar. All rights reserved.</div>
        <div style={styles.lowerLinks}>
          <a href="#" style={styles.lowerLink} target="_blank" rel="noopener noreferrer">
            Terms
          </a>
          <a href="#" style={styles.lowerLink} target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
        </div>
      </div>
      <div style={styles.disclaimer}>
        <span style={styles.disclaimerTitle}>Disclaimer:</span>
        PropScholar is a government-registered business under the MSME (Udyam) initiative. All
        Test/Evaluation accounts provided by PropScholar are simulated and do not involve real
        financial transactions or live market exposure. We are strictly an educational platform,
        and our programs are designed to assess trading skills in a simulated environment. Our
        evaluation process is entirely skill-based, and successful participants may be eligible
        for a scholarship award. PropScholar does not act as or offer services as a broker,
        custodian, or financial advisor. Participation in our programs is voluntary, and program
        fees are not to be considered deposits or investments of any kind. All program fees are
        used solely to cover operational expenses, including but not limited to staffing,
        technology infrastructure, and other business-related costs. Nothing contained on our
        platform or in our materials constitutes a solicitation or offer to buy or sell any
        financial instrument, including but not limited to futures, options, or foreign exchange
        products.
      </div>
    </footer>
  );
};

const AboutPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    headerLink: Array(navItems.length).fill(false),
    headerCta: false,
    teamMember: Array(6).fill(false),
  });

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
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

  const teamMembers = [
    { name: "Alex Chen", role: "CEO & Founder", avatar: "AC" },
    { name: "Sarah Johnson", role: "Head of Trading", avatar: "SJ" },
    { name: "Michael Davis", role: "CTO", avatar: "MD" },
    { name: "Emily Rodriguez", role: "Community Manager", avatar: "ER" },
    { name: "David Kim", role: "Lead Developer", avatar: "DK" },
    { name: "Lisa Thompson", role: "Marketing Director", avatar: "LT" },
  ];

  const styles = {
    page: {
      background: "linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%)",
      color: "#fff",
      minHeight: "100vh",
      padding: isMobile ? "80px 16px 40px" : "120px 24px 60px",
      fontFamily: "'Inter', Arial, sans-serif",
      lineHeight: 1.6,
      maxWidth: "100%",
      margin: 0,
      position: "relative",
      overflow: "hidden",
    },
    container: {
      maxWidth: 1100,
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    heroSection: {
      textAlign: "center",
      marginBottom: isMobile ? 60 : 80,
    },
    title: {
      fontSize: isMobile ? "2.5rem" : "4rem",
      margin: "0 0 24px 0",
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 800,
      letterSpacing: "-1px",
      lineHeight: 1.1,
    },
    subtitle: {
      fontSize: isMobile ? "1.1rem" : "1.4rem",
      color: "rgba(255, 255, 255, 0.85)",
      maxWidth: 700,
      margin: "0 auto",
      lineHeight: 1.6,
    },
    section: {
      background: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: isMobile ? "32px 20px" : "48px 40px",
      marginBottom: isMobile ? "32px" : "48px",
      border: "1px solid rgba(74, 163, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    },
    sectionTitle: {
      fontSize: isMobile ? "1.8rem" : "2.4rem",
      fontWeight: 700,
      marginBottom: 24,
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    sectionText: {
      fontSize: isMobile ? "1rem" : "1.15rem",
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 1.8,
      marginBottom: 16,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      gap: isMobile ? 24 : 32,
      marginTop: 48,
    },
    statCard: {
      background: "linear-gradient(135deg, rgba(74, 163, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)",
      borderRadius: "16px",
      padding: isMobile ? "24px" : "32px",
      textAlign: "center",
      border: "1px solid rgba(74, 163, 255, 0.2)",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
    },
    statNumber: {
      fontSize: isMobile ? "2.5rem" : "3rem",
      fontWeight: 800,
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: 8,
    },
    statLabel: {
      fontSize: isMobile ? "0.95rem" : "1.1rem",
      color: "rgba(255, 255, 255, 0.8)",
    },
    teamGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
      gap: isMobile ? 20 : 32,
      marginTop: 32,
    },
    teamCard: {
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "16px",
      padding: isMobile ? "20px" : "28px",
      textAlign: "center",
      border: "1px solid rgba(74, 163, 255, 0.15)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      cursor: "pointer",
    },
    teamAvatar: {
      width: isMobile ? 60 : 80,
      height: isMobile ? 60 : 80,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      fontSize: isMobile ? "1.2rem" : "1.5rem",
      fontWeight: 700,
      color: "#fff",
      border: "3px solid rgba(74, 163, 255, 0.3)",
    },
    teamName: {
      fontSize: isMobile ? "1rem" : "1.2rem",
      fontWeight: 600,
      color: "#fff",
      marginBottom: 4,
    },
    teamRole: {
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      color: "rgba(255, 255, 255, 0.7)",
    },
    valuesGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? 24 : 32,
      marginTop: 32,
    },
    valueCard: {
      display: "flex",
      gap: 20,
      alignItems: "flex-start",
    },
    valueIcon: {
      width: 48,
      height: 48,
      borderRadius: "12px",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    valueContent: {
      flex: 1,
    },
    valueTitle: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      fontWeight: 600,
      color: "#4aa3ff",
      marginBottom: 8,
    },
    valueText: {
      fontSize: isMobile ? "0.95rem" : "1.05rem",
      color: "rgba(255, 255, 255, 0.85)",
      lineHeight: 1.6,
    },
    ctaSection: {
      background: "linear-gradient(135deg, rgba(74, 163, 255, 0.15) 0%, rgba(138, 43, 226, 0.15) 100%)",
      borderRadius: "24px",
      padding: isMobile ? "40px 24px" : "60px 48px",
      textAlign: "center",
      marginTop: isMobile ? 48 : 64,
      border: "1px solid rgba(74, 163, 255, 0.2)",
    },
    ctaTitle: {
      fontSize: isMobile ? "1.8rem" : "2.5rem",
      fontWeight: 700,
      marginBottom: 16,
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    ctaText: {
      fontSize: isMobile ? "1rem" : "1.2rem",
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 32,
      maxWidth: 600,
      margin: "0 auto 32px",
    },
    ctaButton: {
      display: "inline-block",
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      color: "#fff",
      padding: isMobile ? "14px 32px" : "16px 40px",
      borderRadius: "50px",
      fontSize: isMobile ? "1rem" : "1.15rem",
      fontWeight: 600,
      textDecoration: "none",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      boxShadow: "0 0 20px rgba(74, 163, 255, 0.4)",
      cursor: "pointer",
    },
  };

  const values = [
    {
      icon: "🎯",
      title: "Skill-Based Evaluation",
      text: "We believe in merit over capital. Our evaluation system focuses purely on trading skills.",
    },
    {
      icon: "🤝",
      title: "Community First",
      text: "Building a supportive community where traders help each other grow and succeed.",
    },
    {
      icon: "📚",
      title: "Continuous Learning",
      text: "Education is at our core. We provide resources and mentorship for continuous improvement.",
    },
    {
      icon: "🚀",
      title: "Breaking Barriers",
      text: "Removing financial obstacles that prevent talented traders from reaching their potential.",
    },
  ];

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
          <div style={styles.heroSection}>
            <h1 style={styles.title}>About PropScholar</h1>
            <p style={styles.subtitle}>
              Revolutionizing trading education through skill-based scholarships and removing capital barriers for talented traders worldwide.
            </p>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Our Story</h2>
            <p style={styles.sectionText}>
              PropScholar was founded with a simple yet powerful vision: to democratize access to professional trading. We recognized that many talented individuals with exceptional trading skills were held back by one major obstacle - capital requirements.
            </p>
            <p style={styles.sectionText}>
              Traditional prop firms often demand substantial deposits or fees, creating barriers that exclude promising traders from opportunities. We decided to change this paradigm by introducing a scholarship-based model that evaluates pure skill rather than financial capacity.
            </p>
            <p style={styles.sectionText}>
              Today, PropScholar stands as a beacon of opportunity for traders worldwide, providing a platform where talent is the only currency that matters. Through our comprehensive evaluation system and supportive community, we're building the next generation of professional traders.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>By The Numbers</h2>
            <div style={styles.statsGrid}>
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoverStates.teamMember[0] ? {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 40px rgba(74, 163, 255, 0.3)",
                  } : {})
                }}
                onMouseEnter={() => handleHover("teamMember", 0, true)}
                onMouseLeave={() => handleHover("teamMember", 0, false)}
              >
                <div style={styles.statNumber}>10K+</div>
                <div style={styles.statLabel}>Active Traders</div>
              </div>
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoverStates.teamMember[1] ? {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 40px rgba(74, 163, 255, 0.3)",
                  } : {})
                }}
                onMouseEnter={() => handleHover("teamMember", 1, true)}
                onMouseLeave={() => handleHover("teamMember", 1, false)}
              >
                <div style={styles.statNumber}>$5M+</div>
                <div style={styles.statLabel}>Scholarships Awarded</div>
              </div>
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoverStates.teamMember[2] ? {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 40px rgba(74, 163, 255, 0.3)",
                  } : {})
                }}
                onMouseEnter={() => handleHover("teamMember", 2, true)}
                onMouseLeave={() => handleHover("teamMember", 2, false)}
              >
                <div style={styles.statNumber}>95%</div>
                <div style={styles.statLabel}>Success Rate</div>
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Our Values</h2>
            <div style={styles.valuesGrid}>
              {values.map((value, index) => (
                <div key={index} style={styles.valueCard}>
                  <div style={styles.valueIcon}>
                    <span style={{ fontSize: "24px" }}>{value.icon}</span>
                  </div>
                  <div style={styles.valueContent}>
                    <h3 style={styles.valueTitle}>{value.title}</h3>
                    <p style={styles.valueText}>{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Meet Our Team</h2>
            <div style={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.teamCard,
                    ...(hoverStates.teamMember[index + 3] ? {
                      transform: "translateY(-8px) scale(1.05)",
                      boxShadow: "0 12px 40px rgba(74, 163, 255, 0.3)",
                      background: "rgba(74, 163, 255, 0.1)",
                      border: "1px solid rgba(74, 163, 255, 0.3)",
                    } : {})
                  }}
                  onMouseEnter={() => handleHover("teamMember", index + 3, true)}
                  onMouseLeave={() => handleHover("teamMember", index + 3, false)}
                >
                  <div style={styles.teamAvatar}>{member.avatar}</div>
                  <h3 style={styles.teamName}>{member.name}</h3>
                  <p style={styles.teamRole}>{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          <div style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p style={styles.ctaText}>
              Join thousands of traders who have transformed their skills into successful careers through PropScholar.
            </p>
            <a 
              href="/get-started"
              style={{
                ...styles.ctaButton,
                ...(hoverStates.teamMember[9] ? {
                  transform: "scale(1.1)",
                  boxShadow: "0 0 30px rgba(74, 163, 255, 0.6), 0 0 60px rgba(138, 43, 226, 0.4)",
                } : {})
              }}
              onMouseEnter={() => handleHover("teamMember", 9, true)}
              onMouseLeave={() => handleHover("teamMember", 9, false)}
            >
              Get Started Today
            </a>
          </div>
        </div>
      </main>
      <Footer isMobile={isMobile} />
    </>
  );
};

export default AboutPage;
