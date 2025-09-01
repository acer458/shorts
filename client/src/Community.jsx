import React, { useEffect } from "react";

export default function Community() {
  useEffect(() => {
    // Add any JS animations or effects here if needed
  }, []);

  return (
    <div>
      <h1>Join the Official PropScholar Discord</h1>
      {/* Your page content here */}
    </div>
  );
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PropScholar Community</title>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0a0f2d 0%, #1a1f40 50%, #0a0f2d 100%);
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 100px 20px 60px;
        }
        
        .community-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 80px;
        }
        
        .community-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 20px;
            background: linear-gradient(90deg, #fff 0%, #4aa3ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .community-subtitle {
            font-size: 1.5rem;
            margin-bottom: 40px;
            max-width: 700px;
            line-height: 1.6;
            color: #e6eaff;
        }
        
        .community-content {
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            justify-content: center;
            align-items: center;
        }
        
        .community-image {
            flex: 1;
            min-width: 300px;
            max-width: 500px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .community-image:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(74, 163, 255, 0.3);
        }
        
        .community-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .community-features {
            flex: 1;
            min-width: 300px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }
        
        .feature-card {
            background: rgba(25, 30, 56, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(74, 163, 255, 0.2);
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(74, 163, 255, 0.2);
            background: rgba(33, 39, 90, 0.8);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #4aa3ff;
        }
        
        .feature-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 10px;
            color: #fff;
        }
        
        .feature-desc {
            font-size: 0.9rem;
            color: #c3c8e6;
            line-height: 1.5;
        }
        
        .cta-section {
            text-align: center;
            margin-top: 60px;
            padding: 40px;
            background: linear-gradient(90deg, rgba(25, 30, 56, 0.7) 0%, rgba(33, 39, 90, 0.7) 100%);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(74, 163, 255, 0.2);
        }
        
        .cta-title {
            font-size: 2.2rem;
            margin-bottom: 20px;
            background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
            color: white;
            padding: 16px 40px;
            font-size: 1.2rem;
            font-weight: 700;
            text-decoration: none;
            border-radius: 30px;
            margin-top: 20px;
            box-shadow: 0 0 15px rgba(74, 163, 255, 0.5);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 25px rgba(74, 163, 255, 0.7);
        }
        
        @media (max-width: 768px) {
            .community-title {
                font-size: 2.5rem;
            }
            
            .community-subtitle {
                font-size: 1.2rem;
            }
            
            .community-features {
                grid-template-columns: 1fr;
            }
            
            .feature-card {
                padding: 20px;
            }
        }
        
        /* Header styles */
        .floating-header-wrapper {
            position: fixed;
            top: 20px;
            left: 0;
            right: 0;
            z-index: 2000;
            background: transparent;
            padding: 0 20px;
        }
        
        .floating-header {
            width: 100%;
            max-width: 1150px;
            margin: 0 auto;
            border-radius: 18px;
            background: linear-gradient(90deg, #10132b 85%, #21235a 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 40px;
            color: #fff;
            border: none;
            overflow: visible;
            position: relative;
        }
        
        .header-logo-container {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 170px;
        }
        
        .header-logo {
            width: 48px;
            height: 48px;
            display: flex;
            object-fit: contain;
            border-radius: 8px;
            background: #000;
        }
        
        .header-title {
            font-weight: 700;
            font-size: 18px;
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
            position: static;
        }
        
        .desktop-nav-link {
            color: #fff;
            text-decoration: none;
            font-size: 15px;
            padding: 8px 14px;
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            background: none;
            transition: background 0.3s;
        }
        
        .desktop-nav-link:hover {
            background: rgba(74, 163, 255, 0.2);
        }
        
        .desktop-cta {
            background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
            border-radius: 20px;
            padding: 10px 18px;
            color: #fff;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s;
            box-shadow: 0 0 10px #4aa3ff, 0 0 20px #4aa3ff;
            cursor: pointer;
            user-select: none;
            margin-left: 7px;
        }
        
        .desktop-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 15px #4aa3ff, 0 0 25px #4aa3ff;
        }
        
        @media (max-width: 768px) {
            .floating-header-wrapper {
                top: 10px;
            }
            
            .floating-header {
                padding: 9px 20px;
            }
            
            .header-logo-container {
                gap: 7px;
                min-width: 65px;
            }
            
            .header-logo {
                width: 28px;
                height: 28px;
            }
            
            .header-title {
                font-size: 13px;
            }
            
            .desktop-header-nav {
                display: none;
            }
            
            .hamburger {
                display: flex;
                width: 38px;
                height: 38px;
                align-items: center;
                justify-content: center;
                background: rgba(19,28,53,0.93);
                border-radius: 8px;
                border: none;
                cursor: pointer;
                z-index: 5101;
                box-shadow: 0 2px 10px rgba(34,58,110,0.07);
                transition: background 0.18s;
                margin-left: auto;
                margin-right: 2px;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .hamburger-icon {
                width: 28px;
                height: 22px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .hamburger-line {
                height: 3px;
                width: 100%;
                background: #4aa3ff;
                border-radius: 2px;
                transition: all 0.3s;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="floating-header-wrapper">
        <header class="floating-header">
            <div class="header-logo-container">
                <img src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" alt="PropScholar Logo" class="header-logo">
                <span class="header-title">PropScholar</span>
            </div>
            <nav class="desktop-header-nav" aria-label="Main navigation">
                <a href="www.propscholar.com" class="desktop-nav-link">Home</a>
                <a href="propscholar.space/community" class="desktop-nav-link">Community</a>
                <a href="/shop" class="desktop-nav-link">Shop</a>
                <a href="/faq" class="desktop-nav-link">FAQ</a>
                <a href="/about" class="desktop-nav-link">About</a>
                <a href="/get-started" class="desktop-cta">Get Started</a>
            </nav>
            <button class="hamburger" aria-label="Toggle navigation menu" style="display: none;">
                <div class="hamburger-icon">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </div>
            </button>
        </header>
    </div>

    <!-- Community Page Content -->
    <div class="container">
        <section class="community-hero">
            <h1 class="community-title">Join the Official PropScholar Discord</h1>
            <p class="community-subtitle">Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates. Join our vibrant Discord community to access it all!</p>
        </section>
        
        <section class="community-content">
            <div class="community-image">
                <img src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1756729246/discord_jna7on.png" alt="PropScholar Discord Community">
            </div>
            
            <div class="community-features">
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3 class="feature-title">1,200+</h3>
                    <p class="feature-desc">Active Members</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎫</div>
                    <h3 class="feature-title">1 on 1</h3>
                    <p class="feature-desc">Ticket Service</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎁</div>
                    <h3 class="feature-title">Giveaways</h3>
                    <p class="feature-desc">For Community</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💬</div>
                    <h3 class="feature-title">Real-Time</h3>
                    <p class="feature-desc">Live Support</p>
                </div>
            </div>
        </section>
        
        <section class="cta-section">
            <h2 class="cta-title">Ready to join our community?</h2>
            <p>Connect with like-minded traders, get exclusive insights, and accelerate your prop firm journey.</p>
            <a href="https://discord.gg/propscholar" class="cta-button">Join Discord Community</a>
        </section>
    </div>

    <script type="text/babel">
        // This would be where the React header component would be mounted in a real application
        // For this example, we're using plain CSS/HTML for the header
        console.log("Community page loaded");
        
        // Mobile menu toggle functionality
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', function() {
                alert('Mobile menu would open here. In a React app, this would toggle state.');
            });
        }
    </script>
</body>
</html>
