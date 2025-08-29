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

const CombinedPage = () => {
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
    setHoverStates(prev => ({
      ...prev,
      [type]:
        type === "headerCta"
          ? isHovered
          : prev[type].map((item, i) => (i === index ? isHovered : item)),
    }));
  };

  // Styles for both header, page, and footer combined
  const styles = {
    /* Header and About styles */
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
      boxShadow: "0 2px 24px 0 rgba(74,163,255,0.13), 0 0 0 1.5px rgba(74,163,255,0.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "9px 3px" : "18px 40px",
      border: "1px solid rgba(74,163,255,0.14)",
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
      width: isMobile ? 23 : 44,
      height: isMobile ? 23 : 44,
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
      fontSize: isMobile ? 13 : 18,
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
      border: "1px solid rgba(255,255,255,0.13)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.40), 0 0 15px rgba(74, 163, 255, 0.25)",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    sectionHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.52), 0 0 20px rgba(74, 163, 255, 0.37)",
    },


    /* Footer styles */
    footerWrapper: {
      width: "100%",
      background: "linear-gradient(135deg, #151834 0%, #181c3b 100%)",
      color: "#e6eaff",
      padding: "56px 0 0 0",
      marginTop: 40,
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: 16,
      letterSpacing: "0.01em",
    },
    footerContainer: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      gap: 32,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    footerCol: {
      flex: "1 1 220px",
      minWidth: 160,
    },
    footerColTitle: {
      fontWeight: 700,
      fontSize: 20,
      marginBottom: 14,
      marginTop: 0,
    },
    footerCompany: { color: "#4aa3ff" },
    footerContact: { color: "#ffcb29" },
    footerSocial: { color: "#31d17a" },
    footerLink: {
      color: "#e6eaff",
      textDecoration: "none",
      display: "block",
      marginBottom: 12,
      fontWeight: 500,
      fontSize: 16,
      transition: "color 0.16s",
    },
    footerLinkHover: { color: "#4aa3ff" },
    footerSocialRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 13,
    },
    footerLogoRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 44,
      marginBottom: 10,
      marginLeft: 2,
    },
    footerLogoImg: {
      width: 34,
      height: 34,
      objectFit: "contain",
      borderRadius: "50%",
      background: "radial-gradient(circle at 33% 33%, #4aa3ff 35%, #181c3b 100%)",
    },
    footerDivider: {
      width: "100%",
      height: 1,
      margin: "38px 0 20px 0",
      background: "rgba(128,150,255,0.18)",
    },
    footerCopyright: {
      color: "#8b98b7",
      fontSize: 15,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      padding: "0 24px 12px 24px",
      maxWidth: 1200,
      margin: "0 auto",
      width: "100%",
    },
    footerDisclaimer: {
      margin: "28px 18px 0 18px",
      color: "#b0b7cc",
      fontSize: 13.2,
      lineHeight: 1.6,
    },
    footerDisclaimerTitle: {
      fontWeight: 700,
      color: "#f3f3f7",
      marginBottom: 3,
      fontSize: 14,
      letterSpacing: 0.01,
    },
    footerPolicyLinks: {
      display: "flex",
      gap: 23,
      fontSize: 15,
    },
    footerPolicyLink: {
      color: "#e6eaff",
      textDecoration: "none",
      fontWeight: 500,
      opacity: 0.7,
      transition: "opacity 0.2s",
    },
  };

  // Social icons SVGs!
  const socialIcons = {
    instagram: (
      <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="7" stroke="#e6eaff" strokeWidth="1.5"/><rect x="5" y="5" width="8" height="8" rx="3" stroke="#e6eaff" strokeWidth="1.2"/><circle cx="12.5" cy="5.5" r="1" fill="#e6eaff"/></svg>
    ),
    twitter: (
      <svg width="18" height="18" fill="none"><path d="M17 4.47c-.49.21-1.01.35-1.56.41A2.50 2.50 0 0 0 16.5 3.02c-.5.3-1.04.52-1.62.64A2.5 2.5 0 0 0 8.5 5.7c-3.02 0-4.95-2.5-4.95-4.56 0-.27.03-.54.08-.79C2.28.71 1.37 1.37 1.05 2.26c-.28.71-.31 1.59.33 2.04A2.54 2.54 0 0 1 .6 3.51c0 .04.01.09.01.13 0 1.4.53 2.52 1.49 3.18a2.5 2.5 0 0 1-1.13-.03c.02.75.59 1.38 1.29 1.46a2.5 2.5 0 0 1-1.18.04c.33 1.03 1.28 1.78 2.4 1.8A4.99 4.99 0 0 1 1 15.07c.63.52 1.35.83 2.13.89a7.06 7.06 0 0 1-5.51-.01 9.42 9.42 0 0 0 5.19 1.51c10.43 0 16.14-8.18 16.14-15.26 0-.23-.01-.45-.02-.68A11.52 11.52 0 0 0 17 4.47Z" fill="#e6eaff"/></svg>
    ),
    trustpilot: (
      <svg width="18" height="18" fill="none"><polygon points="9,2 11,7 16,7 12,10.5 13.5,16 9,12.8 4.5,16 6,10.5 2,7 7,7" stroke="#e6eaff" strokeWidth="1.2" fill="none"/></svg>
    ),
    discord: (
      <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="#e6eaff" strokeWidth="1.5"/><ellipse cx="6.5" cy="10.6" rx="1.2" ry="1" fill="#e6eaff"/><ellipse cx="11.5" cy="10.6" rx="1.2" ry="1" fill="#e6eaff"/><path d="M6.9 7.3c1-.2 2.1-.2 3.2 0" stroke="#e6eaff" strokeWidth="1"/></svg>
    ),
  };

  function handleHamburgerKey(e) {
    if (e.key === " " || e.key === "Enter") setMenuOpen(prev => !prev);
  }

  return (
    <>
      {/* Header */}
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
              onClick={() => setMenuOpen(open => !open)}
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

      {/* About Main Content */}
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
              setHoverStates(prev => ({ ...prev, section: [true, prev.section[1]] }))
            }
            onMouseLeave={() =>
              setHoverStates(prev => ({ ...prev, section: [false, prev.section[1]] }))
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
              setHoverStates(prev => ({ ...prev, section: [prev.section[0], true] }))
            }
            onMouseLeave={() =>
              setHoverStates(prev => ({ ...prev, section: [prev.section[0], false] }))
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

      {/* Footer */}
      <footer style={styles.footerWrapper}>
        <div style={styles.footerContainer}>
          {/* Company Links */}
          <div style={styles.footerCol}>
            <div style={{ ...styles.footerColTitle, ...styles.footerCompany }}>
              Company
            </div>
            <a
              href="#" // PASTE YOUR "About Us" LINK HERE
              style={styles.footerLink}
            >
              About Us
            </a>
            <a
              href="#" // PASTE YOUR "Terms & Conditions" LINK HERE
              style={styles.footerLink}
            >
              Terms & Conditions
            </a>
            <a
              href="#" // PASTE YOUR "Privacy Policy" LINK HERE
              style={styles.footerLink}
            >
              Privacy Policy
            </a>
            <a
              href="#" // PASTE YOUR "FAQ" LINK HERE
              style={styles.footerLink}
            >
              FAQ
            </a>
          </div>
          {/* Contact */}
          <div style={styles.footerCol}>
            <div style={{ ...styles.footerColTitle, ...styles.footerContact }}>
              Contact
            </div>
            <div style={{ marginBottom: 8 }}>Email Support</div>
            <a
              href="mailto:support@propscholar.shop" // EDIT SUPPORT EMAIL (IF NEEDED)
              style={{ ...styles.footerLink, color: "#4aa3ff" }}
            >
              support@propscholar.shop
            </a>
          </div>
          {/* Socials */}
          <div style={styles.footerCol}>
            <div style={{ ...styles.footerColTitle, ...styles.footerSocial }}>
              Socials
            </div>
            <div style={styles.footerSocialRow}>
              {socialIcons.instagram}
              <a
                href="#" // PASTE YOUR INSTAGRAM LINK HERE
                style={styles.footerLink}
                target="_blank"
                rel="noopener"
              >
                Instagram
              </a>
            </div>
            <div style={styles.footerSocialRow}>
              {socialIcons.twitter}
              <a
                href="#" // PASTE YOUR TWITTER LINK HERE
                style={styles.footerLink}
                target="_blank"
                rel="noopener"
              >
                Twitter
              </a>
            </div>
            <div style={styles.footerSocialRow}>
              {socialIcons.trustpilot}
              <a
                href="#" // PASTE YOUR TRUSTPILOT LINK HERE
                style={styles.footerLink}
                target="_blank"
                rel="noopener"
              >
                Trustpilot
              </a>
            </div>
            <div style={styles.footerSocialRow}>
              {socialIcons.discord}
              <a
                href="#" // PASTE YOUR DISCORD LINK HERE
                style={styles.footerLink}
                target="_blank"
                rel="noopener"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerLogoRow}>
          <img
            // PASTE YOUR LOGO URL HERE (if needed)
            src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
            style={styles.footerLogoImg}
            alt="PropScholar Logo"
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              background: "linear-gradient(90deg,#4aa3ff 15%, #fff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PropScholar
          </span>
        </div>
        <div style={styles.footerCopyright}>
          <span>© 2025 PropScholar. All rights reserved.</span>
          <span style={styles.footerPolicyLinks}>
            <a href="#" /* PASTE TERMS LINK HERE */ style={styles.footerPolicyLink}>
              Terms
            </a>
            <a href="#" /* PASTE PRIVACY LINK HERE */ style={styles.footerPolicyLink}>
              Privacy
            </a>
          </span>
        </div>
        <div style={styles.footerDisclaimer}>
          <div style={styles.footerDisclaimerTitle}>Disclaimer:</div>
          PropScholar is a government-registered business under the MSME (Udyam) initiative. All Test/Evaluation accounts provided by PropScholar are simulated and do not involve real financial transactions or live market exposure. We are strictly an educational platform, and our programs are designed to assess trading skills in a simulated environment. Our evaluation process is entirely skill-based, and successful participants may be eligible for a scholarship award. PropScholar does not act as or offer services as a broker, custodian, or financial advisor. Participation in our programs is voluntary, and program fees are not to be considered deposits or investments of any kind. All program fees are used solely to cover operational expenses, including but not limited to staffing, technology infrastructure, and other business-related costs. Nothing contained on our platform or in our materials constitutes a solicitation or offer to buy or sell any financial instrument, including but not limited to futures, options, or foreign exchange products.
        </div>
      </footer>
    </>
  );
};

export default CombinedPage;
