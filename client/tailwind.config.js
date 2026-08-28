/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F7F5',
        surface: '#FFFFFF',
        ink: '#151A18',
        muted: '#6B7280',
        line: '#E5E7E0',
        accent: {
          DEFAULT: '#0E9F6E',
          dark: '#0B7D57',
          soft: '#E4F5EE',
        },
        sidebar: {
          DEFAULT: '#101826',
          hover: '#182233',
          line: '#232D3F',
          text: '#94A3B8',
          active: '#152A20',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 32, 0.04), 0 1px 8px 0 rgba(16, 24, 32, 0.03)',
        pop: '0 8px 24px -8px rgba(16, 24, 32, 0.16)',
      },
    },
  },
  plugins: [],
};
