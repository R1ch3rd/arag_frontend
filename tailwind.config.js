// tailwind.config.js — aRAG themed with the folio design system
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Folio design system: cream / Claude orange / ink / pastels
        cream: {
          DEFAULT: '#F7F2E9',
          deep: '#F0E8D9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FDFBF6',
          border: '#E7DECD',
        },
        ink: {
          DEFAULT: '#1F1E1B',
          body: '#2A2825',
          muted: '#6B6759',
          faint: '#A39B88',
        },
        accent: {
          DEFAULT: '#D97757',   // Claude orange
          deep: '#B0512F',      // readable small-text orange
          btn: '#C4603D',       // button bg, white text passes contrast
          dim: 'rgba(217, 119, 87, 0.14)',
        },
        sage: { DEFAULT: '#3E6B52', dim: '#DEEBE2' },
        butter: { DEFAULT: '#7A601A', dim: '#F2E7C8' },
        blush: { DEFAULT: '#A84E2F', dim: '#F4DCD0' },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'typing-dot': 'typingDot 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        typingDot: {
          '0%, 60%, 100%': { opacity: '0.25', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-3px)' },
        },
      },
    },
  },
  plugins: [],
}
