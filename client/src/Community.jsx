import React, { useState, useEffect } from "react";

const CommunityPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { value: "2,000+", label: "Active Members", icon: "👥" },
    { value: "24/7", label: "Live Support", icon: "💬" },
    { value: "Weekly", label: "Giveaways", icon: "🎁" }
  ];

  const benefits = [
    {
      title: "Expert Guidance",
      description: "Learn from experienced traders who've been where you are",
      icon: "🚀"
    },
    {
      title: "Real-time Updates",
      description: "Get instant notifications on market movements and opportunities",
      icon: "📈"
    },
    {
      title: "Collaborative Learning",
      description: "Share ideas, strategies and get feedback from the community",
      icon: "🤝"
    },
    {
      title: "Exclusive Resources",
      description: "Access tools and content available only to community members",
      icon: "🔒"
    }
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(74, 163, 255, 0.4); }
            50% { box-shadow: 0 0 30px rgba(74, 163, 255, 0.8); }
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
          }
          
          .join-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(74, 163, 255, 0.5) !important;
          }
          
          .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
          }

          @media (max-width: 768px) {
            .mobile-menu {
              display: ${menuOpen ? 'flex' : 'none'} !important;
              position: fixed;
              top: 90px;
              left: 0;
              right: 0;
              background: rgba(16, 19, 43, 0.98);
              backdrop-filter: blur(10px);
              flex-direction: column;
              padding: 20px;
              border-radius: 0 0 18px 18px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
              z-index: 999;
              border-top: 1px solid rgba(74, 163, 255, 0.2);
            }
            
            .mobile-menu a {
              padding: 15px 0;
              text-align: center;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mobile-menu button {
              margin-top: 15px;
              width: 100%;
            }
          }
        `}
      </style>
      
      {/* Floating Header */}
      <header style={styles.floatingHeader}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <img 
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" 
              alt="PropScholar" 
              style={styles.logo}
            />
            <span style={styles.logoText}>PropScholar</span>
          </div>
          
          {!isMobile ? (
            <nav style={styles.nav}>
              <a href="#" style={styles.navLink}>Home</a>
              <a href="#" style={styles.navLink}>Community</a>
              <a href="#" style={styles.navLink}>Shop</a>
              <a href="#" style={styles.navLink}>FAQ</a>
              <a href="#" style={styles.navLink}>About</a>
              <button style={styles.ctaButton}>Get Started</button>
            </nav>
          ) : (
            <>
              <button 
                style={styles.menuButton} 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span style={{
                  ...styles.menuIcon, 
                  transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                  transition: 'transform 0.3s ease'
                }}></span>
                <span style={{
                  ...styles.menuIcon, 
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}></span>
                <span style={{
                  ...styles.menuIcon, 
                  transform: menuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
                  transition: 'transform 0.3s ease'
                }}></span>
              </button>
              
              <nav className="mobile-menu" style={{display: 'none'}}>
                <a href="#" style={styles.navLink}>Home</a>
                <a href="#" style={styles.navLink}>Community</a>
                <a href="#" style={styles.navLink}>Shop</a>
                <a href="#" style={styles.navLink}>FAQ</a>
                <a href="#" style={styles.navLink}>About</a>
                <button style={styles.ctaButton}>Get Started</button>
              </nav>
            </>
          )}
        </div>
      </header>

      <div style={styles.container}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.discordLogo}>
              <svg viewBox="0 0 245 240" width="80" height="80">
                <path fill="#4aa3ff" d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/>
                <path fill="#4aa3ff" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/>
              </svg>
            </div>
            
            <h1 style={{...styles.heroTitle, fontSize: isMobile ? '2.2rem' : '3.5rem'}}>
              Join the Official <span style={styles.highlight}>PropScholar</span> Discord
            </h1>
            
            <p style={{...styles.heroSubtitle, fontSize: isMobile ? '1rem' : '1.2rem'}}>
              Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.
              Join our vibrant Discord community to access it all!
            </p>
            
            <div style={styles.buttonGroup}>
              <button style={styles.joinButton} className="join-btn">
                Join Our Community
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginLeft: '10px'}}>
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section style={styles.benefitsSection}>
          <h2 style={{...styles.sectionTitle, fontSize: isMobile ? '2rem' : '2.5rem'}}>Why Join Our Community?</h2>
          <div style={{...styles.benefitsGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'}}>
            {benefits.map((benefit, index) => (
              <div key={index} style={styles.benefitCard} className="benefit-card">
                <div style={styles.benefitIcon}>{benefit.icon}</div>
                <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                <p style={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section style={styles.statsSection}>
          <div style={{...styles.statsGrid, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '50px'}}>
            {stats.map((stat, index) => (
              <div key={index} style={{...styles.statCard, minWidth: isMobile ? 'auto' : '250px'}} className="stat-card">
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Giveaway Section */}
        <section style={styles.giveawaySection}>
          <div style={{...styles.giveawayCard, padding: isMobile ? '30px' : '60px'}}>
            <div style={styles.giveawayContent}>
              <div style={styles.giveawayIcon}>🎁</div>
              <h2 style={{...styles.giveawayTitle, fontSize: isMobile ? '1.8rem' : '2.2rem'}}>Weekly Giveaways!</h2>
              <p style={{...styles.giveawayText, fontSize: isMobile ? '1rem' : '1.1rem'}}>
                Join our community for a chance to win exclusive trading resources, 
                funded accounts, and premium tools every week!
              </p>
              <button style={{...styles.joinButton, ...styles.giveawayButton}} className="join-btn">
                Join to Participate
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{...styles.ctaSection, padding: isMobile ? '30px' : '60px'}}>
          <div style={styles.ctaContent}>
            <h2 style={{...styles.ctaTitle, fontSize: isMobile ? '2rem' : '2.5rem'}}>Ready to Level Up Your Trading?</h2>
            <p style={{...styles.ctaText, fontSize: isMobile ? '1rem' : '1.2rem'}}>
              Join over 2,000 active traders in our Discord community. Get the support you need to succeed.
            </p>
            <button style={{...styles.joinButton, ...styles.ctaButton}} className="join-btn">
              Join Discord Community
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'linear-gradient(135deg, #0A0A1A 0%, #1A1A3A 100%)',
    minHeight: '100vh',
    color: '#FFFFFF',
    fontFamily: '"Inter", sans-serif',
    padding: '0',
    margin: '0',
    paddingTop: '90px', // Space for floating header
  },
  floatingHeader: {
    position: 'fixed',
    top: '20px',
    left: '0',
    right: '0',
    zIndex: '1000',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 20px',
  },
  headerContent: {
    background: 'rgba(16, 19, 43, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '18px',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(74, 163, 255, 0.2)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  navLink: {
    color: '#E6E6FA',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  ctaButton: {
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  menuButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    padding: '0',
  },
  menuIcon: {
    width: '25px',
    height: '3px',
    backgroundColor: '#4aa3ff',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 0',
    marginBottom: '80px',
  },
  heroContent: {
    maxWidth: '800px',
  },
  discordLogo: {
    marginBottom: '30px',
    animation: 'float 5s ease-in-out infinite',
  },
  heroTitle: {
    fontWeight: '800',
    margin: '0 0 20px 0',
    lineHeight: '1.2',
  },
  highlight: {
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    color: '#C3C8E6',
    lineHeight: '1.6',
    margin: '0 0 40px 0',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  joinButton: {
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 32px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    animation: 'pulse 2s infinite',
  },
  benefitsSection: {
    marginBottom: '80px',
  },
  sectionTitle: {
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 60px 0',
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  benefitsGrid: {
    display: 'grid',
    gap: '30px',
  },
  benefitCard: {
    background: 'rgba(25, 30, 56, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid rgba(74, 163, 255, 0.2)',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  benefitIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  benefitTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#FFFFFF',
  },
  benefitDescription: {
    color: '#C3C8E6',
    fontSize: '1rem',
    lineHeight: '1.6',
    margin: '0',
  },
  statsSection: {
    marginBottom: '80px',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statCard: {
    background: 'rgba(25, 30, 56, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px 30px',
    textAlign: 'center',
    border: '1px solid rgba(74, 163, 255, 0.2)',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  statIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '10px',
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    color: '#C3C8E6',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  giveawaySection: {
    marginBottom: '80px',
    display: 'flex',
    justifyContent: 'center',
  },
  giveawayCard: {
    background: 'linear-gradient(135deg, rgba(74, 163, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    textAlign: 'center',
    border: '1px solid rgba(74, 163, 255, 0.3)',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
  },
  giveawayContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  giveawayIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    animation: 'float 5s ease-in-out infinite',
  },
  giveawayTitle: {
    fontWeight: '800',
    margin: '0 0 20px 0',
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  giveawayText: {
    color: '#C3C8E6',
    lineHeight: '1.6',
    margin: '0 0 30px 0',
  },
  giveawayButton: {
    margin: '0 auto',
  },
  ctaSection: {
    background: 'linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    textAlign: 'center',
    border: '1px solid rgba(74, 163, 255, 0.2)',
    marginBottom: '60px',
  },
  ctaContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontWeight: '800',
    margin: '0 0 20px 0',
    background: 'linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  ctaText: {
    color: '#C3C8E6',
    lineHeight: '1.6',
    margin: '0 0 40px 0',
  },
  ctaButton: {
    margin: '0 auto',
    padding: '18px 40px',
  },
};

export default CommunityPage;
