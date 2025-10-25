/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // LicitMind Brand Colors - Landing Page Inspired (Royal Blue + Cyan)
        'brand': {
          'blue-dark': '#1E3A8A',   // Azul royal escuro - base sólida
          'blue': '#2B4C9F',        // Azul royal médio - principal (da landing)
          'cyan': '#00D9FF',        // Cyan vibrante - destaque tech (da landing)
          'cyan-light': '#5EECFF',  // Cyan claro - suave
          'white': '#FFFFFF',       // Branco puro
          'tech-green': '#00E676',  // Verde neon tech - alta visibilidade
          'tech-purple': '#7C3AED', // Roxo tech - inovação
          'tech-orange': '#FF6B35', // Laranja tech - energia
          'graphite': '#1A1D23',    // Grafite profundo escuro
          'silver': '#E5E7EB',      // Prata claro
        },
        // Semantic colors based on brand logo
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2B4C9F', // brand blue royal (principal)
          600: '#1E3A8A', // brand blue-dark
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e293b',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0', 
          300: '#86efac',
          400: '#4ade80',
          500: '#2AA876', // brand tech-green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#C7D2D6', // brand silver
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#2B2F36', // brand graphite
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(15, 76, 92, 0.1)',
        'brand-lg': '0 10px 25px -3px rgba(15, 76, 92, 0.1), 0 4px 6px -2px rgba(15, 76, 92, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};