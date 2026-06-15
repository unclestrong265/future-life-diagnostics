/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#243C6C', deep: '#1A2C50', soft: '#E9EDF6' },
        leaf:  { DEFAULT: '#60B43C', ink: '#3E7A1E', soft: '#EBF5E3' },
        ink:   '#1F2933',
        muted: '#5B6B7B',
        line:  '#D9E2EC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        head: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
