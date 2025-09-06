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

const CommunityBlock = ({ isMobile }) => {
  const styles = {
    wrapper: {
      maxWidth: 900,
      margin: isMobile ? "40px auto" : "54px auto",
      padding: isMobile ? "32px 16px 24px" : "48px 24px 36px",
      borderRadius: "30px",
      background: "rgba(50,100,255,0.17)",
      boxShadow: "0 4px 32px 0 rgba(74,163,255,0.19)",
      textAlign: "center",
      color: "#f1f3fa",
      backdropFilter: "blur(22px)",
      border: "1px solid rgba(64,91,255,0.16)",
      width: isMobile ? "90%" : "auto",
    },
    iconRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? "12px" : "20px",
      marginBottom: "18px",
      flexDirection: isMobile ? "column" : "row",
    },
    blockIconWrap: {
      background: "#3b5ae2",
      borderRadius: "15px",
      width: isMobile ? 44 : 54,
      height: isMobile ? 44 : 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    blockIcon: {
      width: isMobile ? 24 : 32,
      height: isMobile ? 24 : 32,
      display: "block",
    },
    title: {
      fontSize: isMobile ? "1.7rem" : "2.1rem",
      fontWeight: 800,
      color: "#e5ecff",
      margin: isMobile ? "12px 0 0" : 0,
      letterSpacing: 1.2,
      textAlign: "center",
    },
    desc: {
      margin: isMobile ? "12px 0 24px" : "18px 0 36px",
      fontSize: isMobile ? "1rem" : "1.18rem",
      maxWidth: 700,
      marginLeft: "auto",
      marginRight: "auto",
      color: "#e5e6ed",
      lineHeight: 1.7,
      padding: isMobile ? "0 8px" : 0,
    },
    btnRow: {
      display: "flex",
      justifyContent: "center",
      marginTop: isMobile ? "18px" : "22px",
    },
    socialBtn: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "#2140df",
      border: "1.8px solid #4aa3ff",
      color: "#fff",
      fontWeight: 600,
      fontSize: isMobile ? "0.95rem" : "1.09rem",
      padding: isMobile ? "8px 20px" : "10px 26px",
      borderRadius: "50px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.3s ease",
    },
    socialBtnImg: {
      width: isMobile ? "22px" : "25px",
      height: isMobile ? "22px" : "25px",
      objectFit: "contain",
      borderRadius: "50%",
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
          aria-label="Discord"
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
    feedGlow: {
      marginTop: 0,
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      color: "#fff",
      textDecoration: "none",
      fontSize: 17,
      fontWeight: 600,
      padding: "9px 20px",
      borderRadius: "24px",
      width: "max-content",
      boxShadow: "0 0 7px #4aa3ff, 0 0 14px #4aa3ff",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginLeft: 8,
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
      transition: "background 0.3s",
      marginLeft: 0,
      marginBottom: 0,
      position: "relative",
    },
    desktopCta: {
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: "10px 18px",
      color: "#fff",
      textDecoration: "none",
      fontSize: 15,
      fontWeight: 600,
      transition: "all 0.3s",
      boxShadow: "0 0 10px #4aa3ff, 0 0 20px #4aa3ff",
      cursor: "pointer",
      userSelect: "none",
      marginLeft: 7,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
    },
    feedDesktopGlow: {
      background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
      borderRadius: "20px",
      padding: "8px 16px",
      color: "#fff",
      textDecoration: "none",
      fontSize: 15,
      fontWeight: 600,
      transition: "all 0.3s",
      boxShadow: "0 0 10px #4aa3ff, 0 0 20px #4aa3ff",
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      marginLeft: 0,
      position: "relative",
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
              {navItems.map((item, index) => {
                const isFeed = item.label.toLowerCase() === "feed";
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    style={isFeed ? { ...styles.mobileCta, ...styles.feedGlow } : styles.mobileNavLink}
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
                );
              })}
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
            {navItems.map((item, index) => {
              const isFeed = item.label.toLowerCase() === "feed";
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    ...(isFeed ? styles.feedDesktopGlow : styles.desktopNavLink),
                    position: "relative",
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
              );
            })}
            <a
              href="/get-started"
              style={{
                ...styles.desktopCta,
                position: "relative",
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
      maxWidth: 900,
      margin: "0 auto",
      position: "relative",
      zIndex: 2,
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "clamp(2rem, 4vw, 2.8rem)",
      margin: "0 0 16px 0",
      background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textAlign: "center",
      fontWeight: 700,
      letterSpacing: "0.5px",
      position: "relative",
      lineHeight: 1.2,
    },
    titleUnderline: {
      position: "absolute",
      bottom: -10,
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "3px",
      background: "linear-gradient(90deg, #4aa3ff, #8a2be2)",
      borderRadius: "2px",
    },
    paragraph: {
      fontSize: isMobile ? 14 : 16,
      marginBottom: 16,
      color: "rgba(255, 255, 255, 0.93)",
      lineHeight: 1.7,
      textAlign: "center",
    },
    section: {
      background: "rgba(255, 255, 255, 0.07)",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: isMobile ? "20px" : "28px",
      marginBottom: isMobile ? "20px" : "30px",
      border: "none",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    sectionHover: { 
      transform: "translateY(-3px)",
      boxShadow: "0 6px 25px rgba(74, 163, 255, 0.2)"
    },
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
            style={{ 
              ...styles.section, 
              ...(hoverStates.section[0] ? styles.sectionHover : {}) 
            }}
            onMouseEnter={() => setHoverStates((prev) => ({ ...prev, section: [true, prev.section[1]] }))}
            onMouseLeave={() => setHoverStates((prev) => ({ ...prev, section: [false, prev.section[1]] }))}
          >
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? 18 : 22, marginBottom: 12, color: "#4aa3ff" }}>
              Our Mission
            </h2>
            <p style={{...styles.paragraph, textAlign: "left"}}>
              Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
            </p>
          </section>
          <section
            style={{ 
              ...styles.section, 
              ...(hoverStates.section[1] ? styles.sectionHover : {}) 
            }}
            onMouseEnter={() => setHoverStates((prev) => ({ ...prev, section: [prev.section[0], true] }))}
            onMouseLeave={() => setHoverStates((prev) => ({ ...prev, section: [prev.section[0], false] }))}
          >
            <h2 style={{ fontWeight: 700, fontSize: isMobile ? 18 : 22, marginBottom: 12, color: "#4aa3ff" }}>
              Our Vision
            </h2>
            <p style={{...styles.paragraph, textAlign: "left"}}>
              Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
            </p>
            <p style={{...styles.paragraph, textAlign: "left"}}>
              By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
            </p>
          </section>
        </div>
      </main>
      <CommunityBlock isMobile={isMobile} />
      <Footer isMobile={isMobile} />
    </>
  );
};



