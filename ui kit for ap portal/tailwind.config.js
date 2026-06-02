/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00d4ff',
          red: '#ff0033',
          cyan: '#00ffff',
          pink: '#ff00aa',
          green: '#00ff88',
        },
        cyber: {
          dark: '#020408',
          navy: '#050d1a',
          panel: '#0a1628',
          card: '#0d1f3c',
          border: '#1a3a5c',
          text: '#a0c4e0',
        },
      },
      fontFamily: {
        cyber: ['Rajdhani', 'Orbitron', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'glow-red': 'glowRed 2s ease-in-out infinite',
        'glow-blue': 'glowBlue 2s ease-in-out infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'border-flow': 'borderFlow 3s linear infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'flicker': 'flicker 4s infinite',
        'grid-move': 'gridMove 15s linear infinite',
        'particle': 'particle 6s ease-in-out infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff' },
          '50%': { opacity: '0.8', textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 80px #00d4ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowRed: {
          '0%, 100%': { boxShadow: '0 0 10px #ff0033, 0 0 20px #ff0033' },
          '50%': { boxShadow: '0 0 20px #ff0033, 0 0 40px #ff0033, 0 0 60px #ff0033' },
        },
        glowBlue: {
          '0%, 100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          '50%': { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' },
        },
        glowCyan: {
          '0%, 100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff' },
          '50%': { boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.4' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.3' },
          '99%': { opacity: '1' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        particle: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '50%': { transform: 'translateY(-100px) translateX(30px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
