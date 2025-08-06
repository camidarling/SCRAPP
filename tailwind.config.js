/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro 8-bit color palette
        'retro': {
          'dark': '#2c2c2c',      // Dark background
          'darker': '#1a1a1a',    // Darker elements
          'light': '#f4f1e8',     // Light background
          'lighter': '#ffffff',    // Pure white
          'primary': '#ff6b6b',    // Primary red
          'primary-light': '#ff8e8e',
          'secondary': '#4ecdc4',  // Teal
          'accent': '#45b7d1',     // Blue
          'accent-light': '#6bc5d8',
          'warning': '#ffd93d',    // Yellow
          'success': '#6bcf7f',    // Green
          'danger': '#ff6b6b',     // Red
          'gray': '#8b7355',       // Vintage gray
          'gray-light': '#a89b7d',
          'gray-dark': '#6b5b3f',
        },
        // Legacy scrapbook colors for backward compatibility
        'scrapbook': {
          'cream': '#f4f1e8',
          'vintage': '#8b7355',
          'pastel': {
            'pink': '#ffb3ba',
            'blue': '#bae1ff',
            'yellow': '#ffffba',
            'green': '#baffc9',
            'purple': '#e8b3ff',
          }
        }
      },
      fontFamily: {
        'pixel': ['Press Start 2P', 'cursive'],
        'terminal': ['VT323', 'monospace'],
        'coolvetica': ['Coolvetica', 'sans-serif'],
        'coolvetica-italic': ['Coolvetica', 'sans-serif'],
        'coolvetica-condensed': ['Coolvetica', 'sans-serif'],
        'coolvetica-bold': ['Coolvetica', 'sans-serif'],
        'typewriter': ['Old Typewriter', 'monospace'],
        'handwriting': ['Sam Handwriting', 'cursive'],
        'serif': ['Coolvetica', 'sans-serif'], // Fallback for existing classes
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pixel-fade': 'pixel-fade 0.3s ease-in-out',
        'retro-pulse': 'retro-pulse 2s infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pixel-fade': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'retro-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderWidth: {
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'retro': '4px 4px 0px rgba(0, 0, 0, 0.5)',
        'retro-inset': 'inset 2px 2px 0px rgba(0, 0, 0, 0.3)',
        'retro-inset-light': 'inset -2px -2px 0px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [],
} 