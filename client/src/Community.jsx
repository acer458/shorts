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
  { label: "Community", href: "/community" },
  { label: "Shop", href: "/shop" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

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

export default function Community() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    }
    
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((o) => !o);
  };
  
  const features = [
    { icon: "👥", title: "1,200+", desc: "Active Members" },
    { icon: "🎫", title: "1 on 1", desc: "Ticket Service" },
    { icon: "🎁", title: "Giveaways", desc: "For Community" },
    { icon: "💬", title: "Real-Time", desc: "Live Support" },
  ];
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', Arial, sans-serif;
          background: linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%);
          color: #fff;
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        .floating-header-wrapper {
          position: fixed;
          top: ${isMobile ? '10px' : '20px'};
          left: 0;
          right: 0;
          z-index: 2000;
          background: transparent;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .floating-header {
          background: rgba(16, 19, 43, 0.89) !important;
          border-radius: 18px !important;
          box-shadow: 0 8px 32px rgba(74, 163, 255, 0.2) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 163, 255, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${isMobile ? '12px 16px' : '14px 36px'};
          max-width: 1150px;
          width: ${isMobile ? '90%' : '95%'};
          color: #fff;
          position: relative;
          overflow: visible;
          transition: all 0.3s ease;
        }
        
        .header-logo-container {
          display: flex;
          align-items: center;
          gap: ${isMobile ? '10px' : '14px'};
          min-width: ${isMobile ? 'auto' : '170px'};
          z-index: 2001;
        }
        
        .header-logo-img {
          width: ${isMobile ? '32px' : '40px'};
          height: ${isMobile ? '32px' : '40px'};
          border-radius: 8px;
          background: #000;
          object-fit: contain;
        }
        
        .header-title {
          font-weight: 700;
          font-size: ${isMobile ? '14px' : '16px'};
          background: linear-gradient(90deg, #fff 0%, #4aa3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 4px;
          white-space: nowrap;
        }
        
        .desktop-header-nav {
          display: ${isMobile ? 'none' : 'flex'};
          flex-direction: row;
          align-items: center;
          gap: ${isMobile ? '12px' : '22px'};
        }
        
        .desktop-header-nav a {
          color: #fff;
          text-decoration: none;
          font-size: ${isMobile ? '13px' : '15px'};
          padding: 8px 14px;
          border-radius: 20px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .desktop-header-nav a:not([href="/get-started"]):hover {
          background: rgba(74, 163, 255, 0.15);
        }
        
        .desktop-header-nav a[href="/get-started"] {
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          border-radius: 20px;
          padding: 10px 18px;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 0 10px rgba(74, 163, 255, 0.5), 0 0 20px rgba(74, 163, 255, 0.3);
          cursor: pointer;
          margin-left: 7px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .desktop-header-nav a[href="/get-started"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(74, 163, 255, 0.7), 0 0 25px rgba(74, 163, 255, 0.4);
        }
        
        .hamburger {
          background: rgba(19, 28, 53, 0.8);
          border: none;
          border-radius: 8px;
          padding: 8px;
          margin-left: 15px;
          cursor: pointer;
          display: ${isMobile ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          transition: background 0.2s ease;
        }
        
        .hamburger:hover {
          background: rgba(19, 28, 53, 1);
        }
        
        .hamburger-icon {
          width: 24px;
          height: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        
        .hamburger-line {
          height: 3px;
          width: 100%;
          background: #4aa3ff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .hamburger-line:nth-child(1) {
          transform: ${mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
        }
        
        .hamburger-line:nth-child(2) {
          opacity: ${mobileMenuOpen ? '0' : '1'};
        }
        
        .hamburger-line:nth-child(3) {
          transform: ${mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
        }
        
        .mobile-menu-overlay {
          z-index: 3000;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(18, 21, 44, 0.98);
          display: ${mobileMenuOpen ? 'flex' : 'none'};
          flex-direction: column;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .mobile-menu-item {
          color: #e6eaff;
          font-size: 1.5rem;
          font-weight: 600;
          text-decoration: none;
          margin: 15px 0;
          text-align: center;
          padding: 10px 30px;
          border-radius: 12px;
          transition: background 0.2s ease;
          width: 80%;
          max-width: 300px;
        }
        
        .mobile-menu-item:hover {
          background: rgba(74, 163, 255, 0.15);
        }
        
        .mobile-menu-btn {
          display: inline-block;
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: 30px;
          margin-top: 30px;
          padding: 14px 40px;
          box-shadow: 0 0 16px rgba(74, 163, 255, 0.4);
          transition: all 0.3s ease;
        }
        
        .mobile-menu-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(74, 163, 255, 0.6);
        }
        
        .mobile-menu-close {
          position: absolute;
          top: 25px;
          right: 25px;
          font-size: 2rem;
          color: #e6eaff;
          background: none;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s ease;
        }
        
        .mobile-menu-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .community-title {
          font-size: ${isMobile ? '1.8rem' : '2.5rem'};
          font-weight: 700;
          margin-bottom: 20px;
          background: linear-gradient(90deg, #fff 0%, #4aa3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          line-height: 1.2;
        }
        
        .community-subtitle {
          font-size: ${isMobile ? '1rem' : '1.18rem'};
          margin-bottom: 40px;
          max-width: 700px;
          line-height: 1.6;
          color: #e6eaff;
          text-align: center;
          padding: 0 20px;
        }
        
        .feature-card {
          background: rgba(25, 30, 56, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: ${isMobile ? '20px' : '25px'};
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(74, 163, 255, 0.2);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(74, 163, 255, 0.2);
          border-color: rgba(74, 163, 255, 0.4);
        }
        
        .feature-icon {
          font-size: ${isMobile ? '2rem' : '2.5rem'};
          margin-bottom: 15px;
          color: #4aa3ff;
        }
        
        .feature-title {
          font-size: ${isMobile ? '1.1rem' : '1.2rem'};
          font-weight: 700;
          margin-bottom: 10px;
          color: #fff;
        }
        
        .feature-desc {
          font-size: ${isMobile ? '0.85rem' : '0.9rem'};
          color: #c3c8e6;
          line-height: 1.5;
        }
        
        .cta-title {
          font-size: ${isMobile ? '1.8rem' : '2.2rem'};
          margin-bottom: 20px;
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        
        .cta-button {
          display: inline-block;
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          color: white;
          padding: ${isMobile ? '14px 30px' : '16px 40px'};
          font-size: ${isMobile ? '1rem' : '1.2rem'};
          font-weight: 700;
          text-decoration: none;
          border-radius: 30px;
          margin-top: 20px;
          box-shadow: 0 0 15px rgba(74, 163, 255, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(74, 163, 255, 0.7);
        }
        
        @media (max-width: 768px) {
          .community-features {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .community-content {
            flex-direction: column;
            gap: 30px !important;
          }
          
          .cta-section {
            padding: 30px 20px !important;
          }
        }
      `}</style>
      
      <div className="floating-header-wrapper">
        <header className="floating-header" role="banner">
          <div className="header-logo-container">
            <img
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
              alt="PropScholar Logo"
              className="header-logo-img"
            />
            <span className="header-title">PropScholar</span>
          </div>
          <nav className="desktop-header-nav" aria-label="Main navigation">
            <a href="https://www.propscholar.com">Home</a>
            <a href="/community">Community</a>
            <a href="/shop">Shop</a>
            <a href="/faq">FAQ</a>
            <a href="/about">About</a>
            <a href="/get-started">Get Started</a>
          </nav>
          <button
            className="hamburger"
            aria-label="Toggle navigation menu"
            onClick={handleMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
          >
            <div className="hamburger-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </button>
        </header>
      </div>
      
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
          <button
            className="mobile-menu-close"
            onClick={handleMobileMenuToggle}
            aria-label="Close menu"
          >
            ×
          </button>
          <a className="mobile-menu-item" href="https://www.propscholar.com" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>
          <a className="mobile-menu-item" href="/community" onClick={() => setMobileMenuOpen(false)}>
            Community
          </a>
          <a className="mobile-menu-item" href="/shop" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </a>
          <a className="mobile-menu-item" href="/faq" onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </a>
          <a className="mobile-menu-item" href="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </a>
          <a className="mobile-menu-btn" href="/get-started" onClick={() => setMobileMenuOpen(false)}>
            Get Started
          </a>
        </div>
      )}
      
      <main
        className="container"
        style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: `${isMobile ? '100px 20px 40px' : '120px 20px 60px'}`,
          minHeight: '100vh'
        }}
      >
        <section
          className="community-hero"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: isMobile ? 50 : 80,
          }}
        >
          <h1 className="community-title">Join the Official PropScholar Discord</h1>
          <p className="community-subtitle">
            Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.
            Join our vibrant Discord community to access it all!
          </p>
        </section>
        
        <section
          className="community-content"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? 30 : 40,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 50 : 80,
          }}
        >
          <div
            className="community-image"
            style={{
              flex: 1,
              minWidth: 300,
              maxWidth: 500,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
            }}
          >
            <img
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1756729246/discord_jna7on.png"
              alt="PropScholar Discord Community"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          
          <div
            className="community-features"
            style={{
              flex: 1,
              minWidth: 300,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: isMobile ? 20 : 30,
            }}
          >
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section
          className="cta-section"
          style={{
            textAlign: "center",
            padding: isMobile ? "30px 20px" : "40px",
            background: "linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%)",
            borderRadius: 20,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(74, 163, 255, 0.2)",
          }}
        >
          <h2 className="cta-title">Ready to join our community?</h2>
          <p style={{ color: "#e6eaff", marginBottom: "10px", fontSize: isMobile ? "1rem" : "1.1rem" }}>
            Connect with like-minded traders, get exclusive insights, and accelerate your prop firm journey.
          </p>
          <a
            href="https://discord.gg/propscholar"
            className="cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Discord Community
          </a>
        </section>
      </main>
      
      <Footer isMobile={isMobile} />
    </>
  );
}
