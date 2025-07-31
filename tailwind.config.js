// tailwind.config.js - UPDATED with custom animations
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✨ ADD these custom animations
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideIn: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          },
        },
      },
      // ✨ ADD custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}