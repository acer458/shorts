import React from "react";

// Footer Component (taken exactly from your provided Footer code)
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
      display: "flex",
      alignItems: "center",
      marginBottom: 13,
      fontWeight: 500,
      fontSize: 16,
      transition: "color 0.16s",
      gap: 8,
      borderRadius: "50%",
      padding: 2,
    },
    linkImg: {
      width: 18,
      height: 18,
      objectFit: "contain",
      borderRadius: "50%",
      background: "none",
      display: "block",
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
      borderRadius: "8px",
      background: "#000",
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
          <div style={{ marginBottom: 9 }}>Email Support</div>
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

// Community component updated with matching background
export default function Community() {
  const handleMobileMenuToggle = () => {
    alert("Mobile menu would open here. In a React app, this would toggle state.");
  };

  const features = [
    { icon: "👥", title: "1,200+", desc: "Active Members" },
    { icon: "🎫", title: "1 on 1", desc: "Ticket Service" },
    { icon: "🎁", title: "Giveaways", desc: "For Community" },
    { icon: "💬", title: "Real-Time", desc: "Live Support" },
  ];

  return (
    <>
      <div
        className="floating-header-wrapper"
        style={{
          position: "fixed",
          top: 20,
          left: 0,
          right: 0,
          zIndex: 2000,
          background: "transparent",
          padding: "0 20px",
        }}
      >
        <header
          style={{
            maxWidth: 1150,
            margin: "0 auto",
            borderRadius: 18,
            background: "linear-gradient(90deg, #10132b 85%, #21235a 100%)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 40px",
            color: "#fff",
            position: "relative",
            overflow: "visible",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 170 }}
          >
            <img
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png"
              alt="PropScholar Logo"
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: "#000",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: 4,
              }}
            >
              PropScholar
            </span>
          </div>
          {/* Add your nav here or separate component */}
          {/* Mobile menu button example */}
          <button
            aria-label="Toggle navigation menu"
            onClick={handleMobileMenuToggle}
            style={{ display: "none" }}
          >
            {/* Hamburger icon */}
            <div
              style={{
                width: 28,
                height: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}></span>
              <span style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}></span>
              <span style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}></span>
            </div>
          </button>
        </header>
      </div>

      <main
        style={{
          background: "linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%)",
          color: "#fff",
          minHeight: "100vh",
          padding: "100px 20px 60px",
          fontFamily: "'Inter', Arial, sans-serif",
          lineHeight: 1.6,
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: 80,
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              marginBottom: 20,
              background: "linear-gradient(90deg, #fff 0%, #4aa3ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Join the Official PropScholar Discord
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: 40,
              maxWidth: 700,
              lineHeight: 1.6,
              color: "#e6eaff",
            }}
          >
            Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates. Join our vibrant Discord community to access it all!
          </p>
        </section>

        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
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
                <div style={{ fontSize: "2.5rem", marginBottom: 15, color: "#4aa3ff" }}>{icon}</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10, color: "#fff" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#c3c8e6", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
