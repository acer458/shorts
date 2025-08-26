// src/components/Header.jsx
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = {
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: isScrolled ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(10px)",
      borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 1000,
      transition: "all 0.3s ease",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
    },
    logo: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
      boxShadow: "0 0 15px rgba(74, 163, 255, 0.5)",
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    logoText: {
      color: "#fff",
      fontSize: "24px",
      fontWeight: "700",
      background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
    },
    navLink: {
      color: "rgba(255, 255, 255, 0.9)",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      position: "relative",
      padding: "8px 0",
    },
    navLinkHover: {
      color: "#4aa3ff",
    },
    navLinkAfter: {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "0%",
      height: "2px",
      background: "linear-gradient(90deg, #4aa3ff, #8a2be2)",
      transition: "width 0.3s ease",
    },
    navLinkAfterHover: {
      width: "100%",
    },
    mobileMenuButton: {
      display: "none",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "30px",
      height: "30px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    mobileMenuLine: {
      width: "100%",
      height: "3px",
      background: "#fff",
      margin: "3px 0",
      transition: "all 0.3s ease",
      borderRadius: "2px",
    },
    mobileMenuLine1Open: {
      transform: "rotate(45deg) translate(5px, 5px)",
    },
    mobileMenuLine2Open: {
      opacity: 0,
    },
    mobileMenuLine3Open: {
      transform: "rotate(-45deg) translate(7px, -6px)",
    },
    mobileMenu: {
      position: "fixed",
      top: "64px",
      left: 0,
      width: "100%",
      background: "rgba(0, 0, 0, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      zIndex: 999,
      transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
  };

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Platforms", href: "#" },
    { label: "Shop", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Community", href: "#" },
    { label: "About", href: "#" },
  ];

  const [hoverStates, setHoverStates] = useState(Array(navItems.length).fill(false));

  const handleHover = (index, isHovered) => {
    setHoverStates(prev => prev.map((item, i) => i === index ? isHovered : item));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header style={styles.header}>
        <a href="#" style={styles.logoContainer}>
          <div style={styles.logo}>
            <img 
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" 
              alt="PropScholar Logo" 
              style={styles.logoImg}
            />
          </div>
          <span style={styles.logoText}>PropScholar</span>
        </a>

        <nav style={styles.nav}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                ...styles.navLink,
                ...(hoverStates[index] && styles.navLinkHover)
              }}
              onMouseEnter={() => handleHover(index, true)}
              onMouseLeave={() => handleHover(index, false)}
            >
              {item.label}
              <span style={{
                ...styles.navLinkAfter,
                ...(hoverStates[index] && styles.navLinkAfterHover)
              }}></span>
            </a>
          ))}
        </nav>

        <button 
          style={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.mobileMenuLine,
            ...(isMobileMenuOpen && styles.mobileMenuLine1Open)
          }}></span>
          <span style={{
            ...styles.mobileMenuLine,
            ...(isMobileMenuOpen && styles.mobileMenuLine2Open)
          }}></span>
          <span style={{
            ...styles.mobileMenuLine,
            ...(isMobileMenuOpen && styles.mobileMenuLine3Open)
          }}></span>
        </button>
      </header>

      <div style={styles.mobileMenu}>
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            style={{
              ...styles.navLink,
              fontSize: "18px",
              padding: "12px 0",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            nav {
              display: none !important;
            }
            
            button[aria-label="Toggle menu"] {
              display: flex !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
