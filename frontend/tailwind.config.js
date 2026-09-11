/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dehat: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c5e5ce',
          300: '#98d2a8',
          400: '#65b77c',
          500: '#3f9a59',
          600: '#2f7c45',
          700: '#276238',
          800: '#234e2f',
          900: '#1e4028',
          950: '#0c2314',
        },
        saffron: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'tag': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
