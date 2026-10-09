/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': {
          light: '#FFF1F2',
          DEFAULT: '#FBCFE8',
          medium: '#F472B6',
          dark: '#DB2777',
        },
        'brand-gold': {
          light: '#FEF3C7',
          DEFAULT: '#C9A96E',
          dark: '#92400E',
        },
        'brand-cream': '#FDF6F0',
        'brand-rose': {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        'brand-blush': '#FDE8F0',
        'brand-mauve': '#E9A8C7',
        // Neutral enhancements
        'brand-charcoal': '#2D2A32',
        'brand-warm-gray': '#6B6573',
      },
      fontFamily: {
        'sans': ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'section': '5rem',
        'section-lg': '6.5rem',
      },
      maxWidth: {
        'content': '72rem',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 4px 24px -4px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 8px 40px -8px rgba(0, 0, 0, 0.08)',
        'glow-pink': '0 0 20px rgba(219, 39, 119, 0.18)',
        'glow-pink-lg': '0 0 40px rgba(219, 39, 119, 0.25)',
        'glow-pink-xl': '0 0 60px rgba(219, 39, 119, 0.3)',
        'card-hover': '0 20px 48px -12px rgba(219, 39, 119, 0.18)',
        'card-rest': '0 2px 12px -2px rgba(0, 0, 0, 0.06)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'floating': '0 8px 32px rgba(219, 39, 119, 0.25)',
        'inner-pink': 'inset 0 0 0 2px rgba(219, 39, 119, 0.2)',
        'soft': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'dreamy': '0 25px 60px -15px rgba(219, 39, 119, 0.15), 0 10px 20px -8px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FFF1F2 0%, #FBCFE8 50%, #FFF1F2 100%)',
        'gradient-hero': 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
        'gradient-brand': 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, #F472B6 0%, #FB7185 50%, #E11D48 100%)',
        'gradient-rose': 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,224,244,0.6) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #FFF1F2 0px, transparent 50%), radial-gradient(at 80% 0%, #FECDD3 0px, transparent 50%), radial-gradient(at 0% 50%, #FDF6F0 0px, transparent 50%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.2) rotate(180deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        floatSlow: 'floatSlow 5s ease-in-out infinite',
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
        pulseRing: 'pulseRing 1.5s ease-out infinite',
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        fadeInScale: 'fadeInScale 0.4s ease-out',
        blurIn: 'blurIn 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        ripple: 'ripple 1.5s ease-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        bounceIn: 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        gradientShift: 'gradientShift 4s ease infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}