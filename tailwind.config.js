/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040711',
          900: '#070D1E',
          850: '#0B142B',
          800: '#101B3A',
          700: '#1A2B56',
          600: '#263D77',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFF9E5',
          200: '#FFF0C2',
          300: '#FFE294',
          400: '#F5CC5D',
          500: '#D4AF37',
          600: '#B89225',
          700: '#947217',
          800: '#6E520D',
        },
        sacred: {
          saffron: '#FF7A00',
          amber: '#FF9E2C',
          marigold: '#F59E0B',
          flame: '#FF4800',
          sandalwood: '#C19A6B',
          ivory: '#FAF7F0',
          marble: '#EAE6DF',
          stone: '#2C3038',
          leaf: '#18382B',
        }
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        cinzelDeco: ['"Cinzel Decorative"', 'serif'],
        marcellus: ['"Marcellus"', 'serif'],
        sanskrit: ['"Yatra One"', 'cursive', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFF0C2 0%, #D4AF37 50%, #947217 100%)',
        'navy-radial': 'radial-gradient(ellipse at center, #101B3A 0%, #070D1E 60%, #040711 100%)',
        'divine-glow': 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(255,122,0,0.08) 50%, transparent 80%)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'bell-sway': 'bellSway 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        bellSway: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(6deg)' },
          '75%': { transform: 'rotate(-6deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
