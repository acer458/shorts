import React, { useState, useEffect } from "react";
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PropScholar Discord Community</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
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
        
        .container {
            max-width: 1200px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
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
            background: linear-gradient(45deg, #ff6ec4, #7873f5);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            width: 280px;
            height: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
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
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        
        .card:hover::before {
            animation: shine 1.5s ease;
        }
        
        .card-icon {
            font-size: 3.5rem;
            margin-bottom: 20px;
            color: #fff;
            transition: all 0.3s ease;
        }
        
        .card:hover .card-icon {
            transform: scale(1.2);
        }
        
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6ec4, #7873f5);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .card p {
            font-size: 0.95rem;
            line-height: 1.5;
            opacity: 0.8;
        }
        
        .stats {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ff6ec4, #7873f5);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
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
        }
        
        .join-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 35px rgba(93, 38, 193, 0.6);
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
            color: rgba(255, 255, 255, 0.15);
            font-size: 1.5rem;
            animation: float 6s ease-in-out infinite;
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
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(10deg);
            }
            100% {
                transform: translateY(0) rotate(0deg);
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header animated">
            <h1>Join the Official PropScholar Discord</h1>
            <p>Dedicated Support. Personalized Assistance. Quick Resolutions. Real-Time Updates.<br>Join our vibrant Discord community to access it all!</p>
        </div>
        
        <div class="card animated">
            <div class="floating-icons">
                <i class="fas fa-users" style="top: 20%; left: 20%; animation-delay: 0s;"></i>
                <i class="fas fa-heart" style="top: 70%; left: 80%; animation-delay: 1s;"></i>
                <i class="fas fa-star" style="top: 40%; left: 10%; animation-delay: 2s;"></i>
            </div>
            <div class="stats">1,200+</div>
            <div class="card-icon"><i class="fas fa-users"></i></div>
            <h3>Active Members</h3>
            <p>Join our growing community of passionate learners and experts</p>
        </div>
        
        <div class="card animated">
            <div class="floating-icons">
                <i class="fas fa-ticket-alt" style="top: 10%; left: 80%; animation-delay: 0.5s;"></i>
                <i class="fas fa-headset" style="top: 60%; left: 10%; animation-delay: 1.5s;"></i>
                <i class="fas fa-comments" style="top: 80%; left: 70%; animation-delay: 2.5s;"></i>
            </div>
            <div class="card-icon"><i class="fas fa-ticket-alt"></i></div>
            <h3>1 on 1</h3>
            <h3>Ticket Service</h3>
            <p>Get personalized help with dedicated support tickets</p>
        </div>
        
        <div class="card animated">
            <div class="floating-icons">
                <i class="fas fa-gift" style="top: 30%; left: 80%; animation-delay: 0.8s;"></i>
                <i class="fas fa-trophy" style="top: 70%; left: 20%; animation-delay: 1.8s;"></i>
                <i class="fas fa-award" style="top: 20%; left: 30%; animation-delay: 2.8s;"></i>
            </div>
            <div class="card-icon"><i class="fas fa-gift"></i></div>
            <h3>Giveaways</h3>
            <h3>For Community</h3>
            <p>Exclusive rewards and giveaways for our active members</p>
        </div>
        
        <div class="card animated">
            <div class="floating-icons">
                <i class="fas fa-bolt" style="top: 15%; left: 25%; animation-delay: 0.3s;"></i>
                <i class="fas fa-clock" style="top: 65%; left: 75%; animation-delay: 1.3s;"></i>
                <i class="fas fa-sync-alt" style="top: 40%; left: 85%; animation-delay: 2.3s;"></i>
            </div>
            <div class="card-icon"><i class="fas fa-comments"></i></div>
            <h3>Real-Time</h3>
            <h3>Live Support</h3>
            <p>Instant help and real-time conversations with our team</p>
        </div>
        
        <button class="join-btn animated">
            <i class="fab fa-discord discord-logo"></i> Join Discord Community
        </button>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Animate elements on page load
            const animatedElements = document.querySelectorAll('.animated');
            
            animatedElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = 1;
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            });
            
            // Add hover effect to cards
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.03)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
            
            // Button hover effect
            const joinBtn = document.querySelector('.join-btn');
            
            joinBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            joinBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add floating icons dynamically
            const floatingContainers = document.querySelectorAll('.floating-icons');
            
            floatingContainers.forEach(container => {
                for (let i = 0; i < 3; i++) {
                    const icon = document.createElement('i');
                    const icons = ['fa-comment', 'fa-heart', 'fa-star', 'fa-bolt', 'fa-gem'];
                    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                    icon.className = `fas ${randomIcon}`;
                    
                    icon.style.top = `${Math.random() * 80 + 10}%`;
                    icon.style.left = `${Math.random() * 80 + 10}%`;
                    icon.style.animationDelay = `${Math.random() * 3}s`;
                    
                    container.appendChild(icon);
                }
            });
        });
    </script>
</body>
</html>
