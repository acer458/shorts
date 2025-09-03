import React, { useState } from "react";
export default function Community() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        @media (max-width: 950px) {
          .floating-header {
            padding: 12px 10px !important;
            background: rgba(16, 19, 43, 0.79) !important;
            box-shadow: 0 8px 24px 0 #4aa3ff33 !important;
          }
          .desktop-header-nav {
            display: none !important;
          }
          .hamburger {
            display: block !important;
          }
        }
        @media (max-width: 600px) {
          .floating-header {
            padding: 8px 3px !important;
            max-width: 99vw !important;
            margin: 12px 0 0 0 !important; /* Added margin-top to push down */
            border-radius: 14px !important;
          }
          .community-title {
            font-size: 1.4rem !important;
          }
        }
        .floating-header {
          background: rgba(16, 19, 43, 0.79) !important;
          border-radius: 22px !important;
          box-shadow: 0 12px 32px 0 #4aa3ff33 !important;
          backdrop-filter: blur(7px);
          border: 1px solid #4aa3ff18;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 36px;
          max-width: 1150px;
          margin: 20px auto 0 auto;
          color: #fff;
          position: relative;
          overflow: visible;
        }
        .header-logo-container {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 170px;
        }
        .header-logo-img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #000;
          object-fit: contain;
        }
        .header-title {
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(90deg, #fff 0%, #4aa3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 4px;
        }
        .desktop-header-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 22px;
        }
        .desktop-header-nav a {
          color: #fff;
          text-decoration: none;
          font-size: 15px;
          padding: 8px 14px;
          border-radius: 20px;
          font-weight: 500;
        }
        .desktop-header-nav a[href="/get-started"] {
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          border-radius: 20px;
          padding: 10px 18px;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 0 10px #4aa3ff, 0 0 20px #4aa3ff;
          cursor: pointer;
          margin-left: 7px;
          text-decoration: none;
        }
        .hamburger {
          background: none;
          border: none;
          padding: 0;
          margin-left: 15px;
          cursor: pointer;
          display: none;
        }
        .hamburger-icon {
          width: 32px;
          height: 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .hamburger-line {
          height: 4px;
          width: 100%;
          background: #4aa3ff;
          border-radius: 2px;
        }
        @media (max-width: 950px) {
          .hamburger {
            display: block;
          }
        }
        .mobile-menu-overlay {
          z-index: 3000;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(18, 21, 44, 0.97);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mobile-menu-item {
          color: #e6eaff;
          font-size: 2rem;
          font-weight: 700;
          text-decoration: none;
          margin: 18px 0;
          text-align: center;
        }
        .mobile-menu-btn {
          display: inline-block;
          background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: 30px;
          margin-top: 38px;
          padding: 16px 65px;
          box-shadow: 0 0 16px #4aa3ff55;
        }
        .mobile-menu-close {
          position: absolute;
          top: 30px;
          right: 30px;
          font-size: 2.1rem;
          color: #e6eaff;
          background: none;
          border: none;
          cursor: pointer;
        }
        .community-title {
          font-size: 2.1rem;
          font-weight: 600;
          margin-bottom: 18px;
          background: linear-gradient(90deg, #fff 0%, #4aa3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          transition: font-size 0.2s;
          text-align: center;
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
          <a className="mobile-menu-item" href="https://www.propscholar.com">
            Home
          </a>
          <a className="mobile-menu-item" href="/community">
            Community
          </a>
          <a className="mobile-menu-item" href="/shop">
            Shop
          </a>
          <a className="mobile-menu-item" href="/faq">
            FAQ
          </a>
          <a className="mobile-menu-item" href="/about">
            About
          </a>
          <a className="mobile-menu-btn" href="/get-started">
            Get Started
          </a>
        </div>
      )}
      <main
        className="container"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 20px 60px" }}
      >
        <section
          className="community-hero"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: 80,
          }}
        >
          <h1 className="community-title">Join the Official PropScholar Discord</h1>
          <p
            className="community-subtitle"
            style={{
              fontSize: "1.18rem",
              marginBottom: 37,
              maxWidth: 700,
              lineHeight: 1.55,
              color: "#e6eaff",
            }}
          >
            Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.
            Join our vibrant Discord community to access it all!
          </p>
        </section>
        <section
          className="community-content"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            justifyContent: "center",
            alignItems: "center",
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
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
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
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 30,
            }}
          >
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="feature-card"
                style={{
                  background: "rgba(25, 30, 56, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 16,
                  padding: 25,
                  textAlign: "center",
                  transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  border: "1px solid rgba(74, 163, 255, 0.2)",
                }}
              >
                <div
                  className="feature-icon"
                  style={{ fontSize: "2.5rem", marginBottom: 15, color: "#4aa3ff" }}
                >
                  {icon}
                </div>
                <h3
                  className="feature-title"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "#fff",
                  }}
                >
                  {title}
                </h3>
                <p
                  className="feature-desc"
                  style={{
                    fontSize: "0.9rem",
                    color: "#c3c8e6",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="cta-section"
          style={{
            textAlign: "center",
            marginTop: 60,
            padding: 40,
            background:
              "linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%)",
            borderRadius: 20,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(74, 163, 255, 0.2)",
          }}
        >
          <h2
            className="cta-title"
            style={{
              fontSize: "2.2rem",
              marginBottom: 20,
              background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ready to join our community?
          </h2>
          <p>
            Connect with like-minded traders, get exclusive insights, and accelerate your prop firm journey.
          </p>
          <a
            href="https://discord.gg/propscholar"
            className="cta-button"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
              color: "white",
              padding: "16px 40px",
              fontSize: "1.2rem",
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 30,
              marginTop: 20,
              boxShadow: "0 0 15px rgba(74, 163, 255, 0.5)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            Join Discord Community
          </a>
        </section>
      </main>
    </>
  );
}
