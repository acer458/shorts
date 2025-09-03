import React, { useState, useEffect } from "react";

const CommunityRedesign = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { value: "1,200+", label: "Active Members", icon: "👥" },
    { value: "1 on 1", label: "Ticket Service", icon: "🎫" },
    { value: "Weekly", label: "Giveaways", icon: "🎁" },
    { value: "24/7", label: "Live Support", icon: "💬" }
  ];

  return (
    <div style={styles.page}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(90, 108, 234, 0.4); }
            50% { box-shadow: 0 0 30px rgba(90, 108, 234, 0.8); }
          }
          
          @keyframes glow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          
          .stat-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
          }
          
          .join-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(90, 108, 234, 0.5) !important;
          }
        `}
      </style>
      
      <div style={styles.container}>
        {/* Header Section */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" 
              alt="PropScholar" 
              style={styles.logo}
            />
            <h1 style={styles.logoText}>PropScholar</h1>
          </div>
          
          <nav style={styles.nav}>
            <a href="#" style={styles.navLink}>Home</a>
            <a href="#" style={styles.navLink}>Community</a>
            <a href="#" style={styles.navLink}>Shop</a>
            <a href="#" style={styles.navLink}>FAQ</a>
            <a href="#" style={styles.navLink}>About</a>
            <button style={styles.ctaButton}>Get Started</button>
          </nav>
          
          {isMobile && (
            <button style={styles.menuButton}>
              <span style={styles.menuIcon}></span>
              <span style={styles.menuIcon}></span>
              <span style={styles.menuIcon}></span>
            </button>
          )}
        </header>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.discordLogo}>
              <svg viewBox="0 0 245 240" width="80" height="80">
                <path fill="#5A6CEA" d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/>
                <path fill="#5A6CEA" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/>
              </svg>
            </div>
            
            <h1 style={styles.heroTitle}>
              Join the Official <span style={styles.highlight}>PropScholar</span> Discord
            </h1>
            
            <p style={styles.heroSubtitle}>
              Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.
              Join our vibrant Discord community to access it all!
            </p>
            
            <div style={styles.buttonGroup}>
              <button style={styles.joinButton}>
                Join Our Community
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginLeft: '10px'}}>
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button style={styles.secondaryButton}>
                Learn More
              </button>
            </div>
          </div>
          
          <div style={styles.heroVisual}>
            <div style={styles.floatingCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardAvatar}></div>
                <div>
                  <div style={styles.cardUsername}>Trading Mentor</div>
                  <div style={styles.cardStatus}>Online now</div>
                </div>
              </div>
              <div style={styles.cardMessage}>
                "Hey! Need help with your trading strategy? Join our Discord for personalized guidance!"
              </div>
            </div>
            
            <div style={{...styles.floatingCard, animationDelay: '1s'}}>
              <div style={styles.cardHeader}>
                <div style={{...styles.cardAvatar, background: '#FF6B6B'}}></div>
                <div>
                  <div style={styles.cardUsername}>Market Analyst</div>
                  <div style={styles.cardStatus}>Active 5 min ago</div>
                </div>
              </div>
              <div style={styles.cardMessage}>
                "Just shared real-time market insights in the #analysis channel!"
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={styles.statsSection}>
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard} className="stat-card">
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Why Join Our Community?</h2>
          
          <div style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🚀</div>
              <h3 style={styles.featureTitle}>Exclusive Content</h3>
              <p style={styles.featureDesc}>
                Get access to premium trading strategies, market analysis, and educational resources.
              </p>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🤝</div>
              <h3 style={styles.featureTitle}>Networking</h3>
              <p style={styles.featureDesc}>
                Connect with like-minded traders, share insights, and grow together in your trading journey.
              </p>
            </div>
            
            <div style={styles.feature}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>Real-time Alerts</h3>
              <p style={styles.featureDesc}>
                Receive instant notifications on market movements, opportunities, and community events.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Level Up Your Trading?</h2>
            <p style={styles.ctaText}>
              Join over 1,200 active traders in our Discord community. Get the support you need to succeed.
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
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    marginBottom: '40px',
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
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
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
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
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
    gap: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  menuIcon: {
    width: '25px',
    height: '3px',
    backgroundColor: '#5A6CEA',
    borderRadius: '2px',
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
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: '0 0 20px 0',
    lineHeight: '1.2',
  },
  highlight: {
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
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
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
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
  secondaryButton: {
    background: 'rgba(90, 108, 234, 0.1)',
    color: '#5A6CEA',
    border: '1px solid #5A6CEA',
    borderRadius: '50px',
    padding: '16px 32px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  heroVisual: {
    position: 'relative',
    marginTop: '60px',
    width: '100%',
    maxWidth: '800px',
    height: '300px',
  },
  floatingCard: {
    position: 'absolute',
    background: 'rgba(25, 30, 56, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    width: '280px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    animation: 'float 6s ease-in-out infinite',
    border: '1px solid rgba(90, 108, 234, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px',
  },
  cardAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
  },
  cardUsername: {
    fontWeight: '600',
    fontSize: '16px',
  },
  cardStatus: {
    color: '#5A6CEA',
    fontSize: '12px',
    fontWeight: '500',
  },
  cardMessage: {
    color: '#C3C8E6',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  statsSection: {
    marginBottom: '100px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  statCard: {
    background: 'rgba(25, 30, 56, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid rgba(90, 108, 234, 0.2)',
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
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    color: '#C3C8E6',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  featuresSection: {
    marginBottom: '100px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 60px 0',
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  feature: {
    background: 'rgba(25, 30, 56, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px 30px',
    textAlign: 'center',
    border: '1px solid rgba(90, 108, 234, 0.2)',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '3.5rem',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#FFFFFF',
  },
  featureDesc: {
    color: '#C3C8E6',
    lineHeight: '1.6',
    margin: '0',
  },
  ctaSection: {
    background: 'linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    padding: '60px',
    textAlign: 'center',
    border: '1px solid rgba(90, 108, 234, 0.2)',
    marginBottom: '60px',
  },
  ctaContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 20px 0',
    background: 'linear-gradient(90deg, #5A6CEA 0%, #8A2BE2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  ctaText: {
    fontSize: '1.2rem',
    color: '#C3C8E6',
    lineHeight: '1.6',
    margin: '0 0 40px 0',
  },
  ctaButton: {
    margin: '0 auto',
    fontSize: '1.1rem',
    padding: '18px 40px',
  },
};

export default CommunityRedesign;
