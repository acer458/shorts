import React from "react";

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
          className="floating-header"
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
            className="header-logo-container"
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
              className="header-title"
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

          <nav
            className="desktop-header-nav"
            aria-label="Main navigation"
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 22 }}
          >
            <a
              href="https://www.propscholar.com"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              Home
            </a>
            <a
              href="/community"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              Community
            </a>
            <a
              href="/shop"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              Shop
            </a>
            <a
              href="/faq"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              FAQ
            </a>
            <a
              href="/about"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              About
            </a>
            <a
              href="/get-started"
              style={{
                background: "linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)",
                borderRadius: 20,
                padding: "10px 18px",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 0 10px #4aa3ff, 0 0 20px #4aa3ff",
                cursor: "pointer",
                marginLeft: 7,
                textDecoration: "none",
              }}
            >
              Get Started
            </a>
          </nav>

          <button
            className="hamburger"
            aria-label="Toggle navigation menu"
            onClick={handleMobileMenuToggle}
            style={{ display: "none" }}
          >
            <div
              className="hamburger-icon"
              style={{
                width: 28,
                height: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span
                className="hamburger-line"
                style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}
              ></span>
              <span
                className="hamburger-line"
                style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}
              ></span>
              <span
                className="hamburger-line"
                style={{ height: 3, width: "100%", background: "#4aa3ff", borderRadius: 2 }}
              ></span>
            </div>
          </button>
        </header>
      </div>

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
          <h1
            className="community-title"
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
            className="community-subtitle"
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
                  style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10, color: "#fff" }}
                >
                  {title}
                </h3>
                <p
                  className="feature-desc"
                  style={{ fontSize: "0.9rem", color: "#c3c8e6", lineHeight: 1.5 }}
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
            background: "linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%)",
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
