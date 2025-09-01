import React, { useEffect } from "react";

export default function Community() {
  useEffect(() => {
    // Animate elements on mount
    const animatedElements = document.querySelectorAll(".animated");
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = "translateY(0)";
      }, index * 200);
    });

    // Hover effect for cards
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.03)";
        card.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px rgba(120, 115, 245, 0.5)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 50px rgba(120, 115, 245, 0.3)";
      });
    });

    // Hover effect for button
    const joinBtn = document.querySelector(".join-btn");
    joinBtn.addEventListener("mouseenter", () => {
      joinBtn.style.transform = "translateY(-5px) scale(1.05)";
      joinBtn.style.boxShadow = "0 15px 35px rgba(93, 38, 193, 0.6), 0 0 40px rgba(138, 43, 226, 0.8)";
    });
    joinBtn.addEventListener("mouseleave", () => {
      joinBtn.style.transform = "translateY(0) scale(1)";
      joinBtn.style.boxShadow = "0 10px 30px rgba(93, 38, 193, 0.4)";
    });

    // Add floating icons dynamically
    const floatingContainers = document.querySelectorAll(".floating-icons");
    floatingContainers.forEach((container) => {
      for (let i = 0; i < 5; i++) {
        const icon = document.createElement("i");
        const icons = [
          "fa-comment",
          "fa-heart",
          "fa-star",
          "fa-bolt",
          "fa-gem",
          "fa-rocket",
          "fa-crown",
          "fa-lightbulb"
        ];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        icon.className = `fas ${randomIcon}`;

        icon.style.position = "absolute";
        icon.style.color = "rgba(255, 255, 255, 0.2)";
        icon.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        icon.style.animation = `float ${6 + Math.random() * 4}s ease-in-out infinite`;
        icon.style.top = `${Math.random() * 80 + 10}%`;
        icon.style.left = `${Math.random() * 80 + 10}%`;
        icon.style.animationDelay = `${Math.random() * 5}s`;
        icon.style.filter = "drop-shadow(0 5px 5px rgba(0,0,0,0.3))";

        container.appendChild(icon);
      }
    });

    // Add floating particles in background
    const background = document.querySelector(".background-particles");
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      const size = Math.random() * 10 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = "rgba(255, 255, 255, 0.1)";
      particle.style.borderRadius = "50%";
      particle.style.position = "absolute";
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animation = `float-particle ${15 + Math.random() * 10}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      background.appendChild(particle);
    }
  }, []);

  return (
    <>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
          }
          body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            color: #fff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-x: hidden;
          }
          .background-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
          }
          .container {
            max-width: 1200px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            position: relative;
            z-index: 1;
          }
          .header {
            text-align: center;
            width: 100%;
            margin-bottom: 30px;
            animation: fadeIn 1s ease-out;
          }
          .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(45deg, #ff6ec4, #7873f5, #4aa3ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            position: relative;
            display: inline-block;
          }
          .header h1::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(45deg, #ff6ec4, #7873f5, #4aa3ff);
            border-radius: 3px;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.5s ease;
          }
          .header h1:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          .card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            padding: 30px;
            width: 280px;
            height: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 50px rgba(120, 115, 245, 0.3);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.5s ease;
          }
          .card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px rgba(120, 115, 245, 0.5);
          }
          .card:hover::before {
            animation: shine 1.5s ease;
          }
          .card-icon {
            font-size: 3.5rem;
            margin-bottom: 20px;
            color: #fff;
            transition: all 0.3s ease;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          }
          .card:hover .card-icon {
            transform: scale(1.2);
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
          }
          .card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6ec4, #7873f5);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          .card p {
            font-size: 0.95rem;
            line-height: 1.5;
            opacity: 0.8;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
          }
          .stats {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ff6ec4, #7873f5, #4aa3ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          .join-btn {
            margin-top: 50px;
            padding: 18px 40px;
            font-size: 1.2rem;
            font-weight: 700;
            background: linear-gradient(45deg, #8a2be2, #5d26c1);
            border: none;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(93, 38, 193, 0.4);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1;
          }
          .join-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: all 0.6s ease;
            z-index: -1;
          }
          .join-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 35px rgba(93, 38, 193, 0.6), 0 0 40px rgba(138, 43, 226, 0.8);
          }
          .join-btn:hover::before {
            left: 100%;
          }
          .discord-logo {
            font-size: 1.5rem;
            animation: pulse 2s infinite;
          }
          .floating-icons {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
          }
          .floating-icons i {
            position: absolute;
            color: rgba(255, 255, 255, 0.2);
            font-size: 1.5rem;
            animation: float 6s ease-in-out infinite;
            filter: drop-shadow(0 5px 5px rgba(0,0,0,0.3));
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }
            50% {
              transform: scale(1.2);
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            }
            100% {
              transform: scale(1);
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }
          }
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-20px) rotate(10deg) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translateY(0) rotate(0deg) scale(1);
              opacity: 0.7;
            }
          }
          @keyframes float-particle {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translateY(-100px) translateX(50px) scale(1.2);
              opacity: 0;
            }
          }
          .card:nth-child(1) {
            animation-delay: 0.2s;
          }
          .card:nth-child(2) {
            animation-delay: 0.4s;
          }
          .card:nth-child(3) {
            animation-delay: 0.6s;
          }
          .card:nth-child(4) {
            animation-delay: 0.8s;
          }
          .animated {
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
          }
          @media (max-width: 768px) {
            .container {
              flex-direction: column;
              align-items: center;
            }
            .card {
              width: 100%;
              max-width: 350px;
            }
            .header h1 {
              font-size: 2.5rem;
            }
          }
      `}</style>

      <div className="background-particles"></div>
      
      <div className="container">
        <div className="header animated">
          <h1>Join the Official PropScholar Discord</h1>
          <p>
            Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.
            <br />
            Join our vibrant Discord community to access it all!
          </p>
        </div>

        <div className="card animated">
          <div className="floating-icons"></div>
          <div className="stats">1,200+</div>
          <div className="card-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Active Members</h3>
          <p>Join our growing community of passionate learners and experts</p>
        </div>

        <div className="card animated">
          <div className="floating-icons"></div>
          <div className="card-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <h3>1 on 1</h3>
          <h3>Ticket Service</h3>
          <p>Get personalized help with dedicated support tickets</p>
        </div>

        <div className="card animated">
          <div className="floating-icons"></div>
          <div className="card-icon">
            <i className="fas fa-gift"></i>
          </div>
          <h3>Giveaways</h3>
          <h3>For Community</h3>
          <p>Exclusive rewards and giveaways for our active members</p>
        </div>

        <div className="card animated">
          <div className="floating-icons"></div>
          <div className="card-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h3>Real-Time</h3>
          <h3>Live Support</h3>
          <p>Instant help and real-time conversations with our team</p>
        </div>

        <button className="join-btn animated">
          <i className="fab fa-discord discord-logo"></i> Join Discord Community
        </button>
      </div>
    </>
  );
}
