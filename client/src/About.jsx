<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PropScholar - Making Trading Accessible</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #000000 0%, #0a0a2a 30%, #1a1a4a 100%);
            color: #fff;
            line-height: 1.6;
            overflow-x: hidden;
            min-height: 100vh;
            padding-top: 70px;
        }

        /* Header Styles */
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        }

        header.scrolled {
            background: rgba(0, 0, 0, 0.95);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
            border-bottom: 1px solid rgba(74, 163, 255, 0.2);
            padding: 10px 5%;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            box-shadow: 0 0 20px rgba(74, 163, 255, 0.7);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        header.scrolled .logo {
            box-shadow: 0 0 25px rgba(74, 163, 255, 0.9);
            transform: scale(1.05);
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(1.1) contrast(1.1);
        }

        .logo-text {
            color: #fff;
            font-size: 26px;
            font-weight: 800;
            background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 10px rgba(74, 163, 255, 0.5);
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
        }

        header.scrolled .logo-text {
            text-shadow: 0 0 15px rgba(74, 163, 255, 0.7);
        }

        nav {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        .nav-link {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            padding: 10px 0;
        }

        .nav-link:hover {
            color: #4aa3ff;
            text-shadow: 0 0 8px rgba(74, 163, 255, 0.7);
        }

        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #4aa3ff, #8a2be2);
            transition: width 0.3s ease;
            border-radius: 2px;
        }

        .nav-link:hover::after {
            width: 100%;
        }

        .mobile-menu-button {
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 35px;
            height: 35px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            cursor: pointer;
            padding: 0;
        }

        .mobile-menu-line {
            width: 70%;
            height: 3px;
            background: #fff;
            margin: 3px 0;
            transition: all 0.3s ease;
            border-radius: 2px;
        }

        .mobile-menu-button.open .mobile-menu-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-button.open .mobile-menu-line:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-button.open .mobile-menu-line:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-menu {
            position: fixed;
            top: 69px;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.97);
            backdrop-filter: blur(15px);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            z-index: 999;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .mobile-menu.open {
            transform: translateX(0);
        }

        /* About Page Styles */
        .page-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            position: relative;
            z-index: 2;
        }

        .page-header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 40px;
            flex-direction: column;
            gap: 20px;
            text-align: center;
        }

        .page-logo {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            box-shadow: 0 0 30px rgba(74, 163, 255, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .page-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .page-title {
            font-size: 2.8rem;
            margin: 0;
            padding-bottom: 15px;
            background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            font-weight: 700;
            letter-spacing: 0.5px;
            position: relative;
        }

        .title-underline {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #4aa3ff, #8a2be2);
            border-radius: 2px;
        }

        .section {
            background: rgba(255, 255, 255, 0.07);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(74, 163, 255, 0.25);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            z-index: 2;
            overflow: hidden;
        }

        .section:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 163, 255, 0.4);
        }

        .subtitle {
            font-size: 1.7rem;
            margin-bottom: 16px;
            background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(74,163,255,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 600;
            letter-spacing: 0.5px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(74, 163, 255, 0.3);
        }

        .paragraph {
            font-size: 15px;
            margin-bottom: 14px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.7;
        }

        .subtitle-small {
            font-size: 18px;
            margin-top: 24px;
            margin-bottom: 12px;
            color: #4aa3ff;
            font-weight: 600;
            display: flex;
            align-items: center;
        }

        .icon {
            margin-right: 8px;
            font-size: 16px;
            filter: drop-shadow(0 0 5px rgba(74, 163, 255, 0.7));
        }

        .links {
            display: flex;
            gap: 16px;
            margin-top: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .link-item {
            color: #fff;
            text-decoration: none;
            padding: 12px 22px;
            border-radius: 50px;
            background: linear-gradient(90deg, #4aa3ff 0%, #8a2be2 100%);
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(74, 163, 255, 0.4);
            cursor: pointer;
            user-select: none;
            position: relative;
            overflow: hidden;
            z-index: 1;
            font-size: 14px;
        }

        .link-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 163, 255, 0.6);
        }

        .link-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #8a2be2 0%, #4aa3ff 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        .link-item:hover::before {
            opacity: 1;
        }

        .glow {
            position: fixed;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(74, 163, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
            top: -250px;
            right: -250px;
            pointer-events: none;
            z-index: 0;
        }

        .glow2 {
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
            bottom: -200px;
            left: -200px;
            pointer-events: none;
            z-index: 0;
        }

        .floating-shorts-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4aa3ff 0%, #8a2be2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 24px;
            box-shadow: 0 5px 20px rgba(74, 163, 255, 0.5);
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.2);
            animation: pulse 2s infinite;
        }

        .floating-shorts-button:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(74, 163, 255, 0.7);
        }

        .particle {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, #4aa3ff, #8a2be2);
            opacity: 0.3;
            z-index: 1;
        }

        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0.7); }
            70% { box-shadow: 0 0 0 12px rgba(74, 163, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 163, 255, 0); }
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
            header {
                padding: 10px 5%;
            }
            
            nav {
                display: none;
            }
            
            .mobile-menu-button {
                display: flex;
            }
            
            .page-container {
                padding: 20px 16px;
            }
            
            .page-title {
                font-size: 1.8rem;
            }
            
            .page-logo {
                width: 50px;
                height: 50px;
            }
            
            .section {
                padding: 20px;
            }
            
            .subtitle {
                font-size: 1.4rem;
            }
            
            .paragraph {
                font-size: 14px;
            }
            
            .subtitle-small {
                font-size: 16px;
            }
            
            .links {
                justify-content: center;
            }
            
            .link-item {
                padding: 10px 18px;
                font-size: 13px;
            }
            
            .floating-shorts-button {
                width: 50px;
                height: 50px;
                font-size: 20px;
                right: 15px;
                bottom: 15px;
            }
            
            .glow {
                width: 300px;
                height: 300px;
                top: -150px;
                right: -150px;
            }
            
            .glow2 {
                width: 250px;
                height: 250px;
                bottom: -125px;
                left: -125px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header id="header">
        <a href="#" class="logo-container">
            <div class="logo">
                <img src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" alt="PropScholar Logo">
            </div>
            <span class="logo-text">PropScholar</span>
        </a>

        <nav>
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">Platforms</a>
            <a href="#" class="nav-link">Shop</a>
            <a href="#" class="nav-link">FAQ</a>
            <a href="#" class="nav-link">Community</a>
            <a href="#" class="nav-link">About</a>
        </nav>

        <button class="mobile-menu-button" id="mobileMenuButton" aria-label="Toggle menu">
            <span class="mobile-menu-line"></span>
            <span class="mobile-menu-line"></span>
            <span class="mobile-menu-line"></span>
        </button>
    </header>

    <div class="mobile-menu" id="mobileMenu">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link">Platforms</a>
        <a href="#" class="nav-link">Shop</a>
        <a href="#" class="nav-link">FAQ</a>
        <a href="#" class="nav-link">Community</a>
        <a href="#" class="nav-link">About</a>
    </div>

    <!-- About Page Content -->
    <div class="page-container">
        <div class="page-header">
            <div class="page-logo">
                <img src="https://res.cloudinary.com/dzozyqlqr/image/upload/v1752921306/LOGO-PropScholar_u6jhij.png" alt="PropScholar Logo">
            </div>
            <h1 class="page-title">
                Making Trading Accessible
                <span class="title-underline"></span>
            </h1>
        </div>

        <p class="paragraph">
            Our mission is to make trading accessible for everyone by providing scholarship grants.
        </p>

        <p class="paragraph">
            In exchange we take a simple evaluation/test. If traders complete the test successfully, we provide the scholarship.
        </p>

        <section class="section">
            <h2 class="subtitle">Our Mission</h2>
            <p class="paragraph">
                Through this scholarship, traders can afford anything they want in their journey of becoming a professional trader. We are not a prop firm; we are a scholarship-based model where traders can evaluate themselves by taking part in an evaluation which will ultimately grant scholarship. Skill-based evaluation system.
            </p>
        </section>

        <section class="section">
            <h2 class="subtitle">Our Vision</h2>
            <p class="paragraph">
                Our vision is to make the process skill-based. We want to eliminate the capital barrier in a trader's journey. Using our platform, a trader can use their skill and earn a scholarship which will support their journey.
            </p>
            <p class="paragraph">
                By using our platform one can prove themselves by providing a skill-based test and hence passing, claiming, and earning a scholarship from us.
            </p>
        </section>

        <section class="section">
            <h2 class="subtitle">Our Core Values</h2>

            <h3 class="subtitle-small">
                <span class="icon">✨</span>Commitment to Our Word
            </h3>
            <p class="paragraph">We deliver what we say.</p>

            <h3 class="subtitle-small">
                <span class="icon">🎯</span>Client-Centered Focus
            </h3>
            <p class="paragraph">Our team is focused to deliver what our clients want.</p>

            <h3 class="subtitle-small">
                <span class="icon">🌟</span>Best Support in the Industry
            </h3>
            <p class="paragraph">
                We are committed to provide the best support in the industry. For us, support is the image of the company.
            </p>

            <h3 class="subtitle-small">
                <span class="icon">⚡</span>Simplest Evaluation Process
            </h3>
            <p class="paragraph">We have created an evaluation tailored to be fair and transparent.</p>
        </section>

        <section class="section">
            <h2 class="subtitle">The Community</h2>
            <p class="paragraph">
                We want to create a community of skilled individuals and enthusiasts who are committed and want to join us in making the trading process skill-based and devoid of capital barriers. Our Discord is an active place where we are committed to providing 24×7 support.
            </p>
            <div class="links">
                <a href="https://discord.com/invite/yourserver" target="_blank" rel="noopener noreferrer" class="link-item">
                    <span>🎮</span> Discord
                </a>
                <a href="https://instagram.com/propscholar" target="_blank" rel="noopener noreferrer" class="link-item">
                    <span>📸</span> Instagram
                </a>
                <a href="https://twitter.com/propscholar" target="_blank" rel="noopener noreferrer" class="link-item">
                    <span>🐦</span> Twitter
                </a>
            </div>
        </section>

        <section class="section">
            <h2 class="subtitle">Our Journey</h2>
            <p class="paragraph">
                At PropScholar, we are committed to making trading accessible to everyone. Pass our evaluation with your skill and earn a scholarship.
            </p>
        </section>
    </div>

    <!-- Background Effects -->
    <div class="glow"></div>
    <div class="glow2"></div>
    
    <!-- Floating Shorts Button -->
    <div class="floating-shorts-button" onclick="window.open('https://www.propscholar.space', '_blank')">
        <span>🎬</span>
    </div>

    <script>
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuButton.addEventListener('click', function() {
            this.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuButton.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });

        // Create floating particles
        function createParticles() {
            const particlesContainer = document.createElement('div');
            particlesContainer.style.position = 'fixed';
            particlesContainer.style.top = '0';
            particlesContainer.style.left = '0';
            particlesContainer.style.width = '100%';
            particlesContainer.style.height = '100%';
            particlesContainer.style.pointerEvents = 'none';
            particlesContainer.style.zIndex = '1';
            document.body.appendChild(particlesContainer);

            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 10 : 15;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 6 + 2;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.position = 'absolute';
                particle.style.borderRadius = '50%';
                particle.style.background = 'linear-gradient(45deg, #4aa3ff, #8a2be2)';
                particle.style.opacity = '0.3';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out ${Math.random() * 5}s infinite`;
                
                particlesContainer.appendChild(particle);
            }
        }

        // Initialize particles
        createParticles();
    </script>
</body>
</html>
