import React from 'react';

function AnimatedBackground() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Black base background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05]" />
      
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glow gradient for circles - MORE VISIBLE */}
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
          
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(150, 150, 255, 0.2)" />
            <stop offset="70%" stopColor="rgba(150, 150, 255, 0.04)" />
            <stop offset="100%" stopColor="rgba(150, 150, 255, 0)" />
          </radialGradient>
          
          <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 150, 150, 0.15)" />
            <stop offset="70%" stopColor="rgba(255, 150, 150, 0.03)" />
            <stop offset="100%" stopColor="rgba(255, 150, 150, 0)" />
          </radialGradient>
        </defs>
        
        {/* Large floating orbs */}
        <g>
          {/* Top left orb */}
          <circle cx="150" cy="150" r="180" fill="url(#glow1)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 80,120; 0,0"
              dur="20s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="180;220;180"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Top right orb */}
          <circle cx="1050" cy="100" r="150" fill="url(#glow2)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -100,80; 0,0"
              dur="18s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="150;190;150"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Bottom right orb */}
          <circle cx="1100" cy="700" r="200" fill="url(#glow1)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 50,-100; 0,0"
              dur="22s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="200;250;200"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Bottom left orb */}
          <circle cx="100" cy="700" r="140" fill="url(#glow3)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 100,50; 0,0"
              dur="16s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="140;180;140"
              dur="14s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Center orb */}
          <circle cx="600" cy="400" r="120" fill="url(#glow2)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 60,-60; -60,60; 0,0"
              dur="25s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="120;160;120"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Medium floating circles */}
        <g>
          <circle cx="300" cy="250" r="80" fill="url(#glow1)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 120,100; 0,0"
              dur="14s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="850" cy="200" r="70" fill="url(#glow3)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -80,120; 0,0"
              dur="16s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="950" cy="500" r="90" fill="url(#glow2)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 60,140; 0,0"
              dur="19s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="350" cy="600" r="60" fill="url(#glow1)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -90,60; 0,0"
              dur="17s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Animated bright dots */}
        <g>
          <circle cx="200" cy="500" r="3" fill="rgba(255, 255, 255, 0.8)">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 40,60; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="750" cy="350" r="2" fill="rgba(255, 255, 255, 0.9)">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -50,40; 0,0"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="500" cy="150" r="2.5" fill="rgba(255, 255, 255, 0.85)">
            <animate attributeName="opacity" values="0.25;0.85;0.25" dur="3.5s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 60,-30; 0,0"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="1000" cy="650" r="3" fill="rgba(255, 255, 255, 0.75)">
            <animate attributeName="opacity" values="0.2;0.75;0.2" dur="5s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -40,50; 0,0"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="120" cy="350" r="2" fill="rgba(255, 255, 255, 0.9)">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 50,30; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="650" cy="600" r="2.5" fill="rgba(255, 255, 255, 0.8)">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4.5s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 30,-40; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="400" cy="400" r="2" fill="rgba(255, 255, 255, 0.85)">
            <animate attributeName="opacity" values="0.25;0.85;0.25" dur="3s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -30,50; 0,0"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="850" cy="750" r="2.5" fill="rgba(255, 255, 255, 0.7)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 40,-30; 0,0"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Subtle grid pattern */}
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export default AnimatedBackground;
