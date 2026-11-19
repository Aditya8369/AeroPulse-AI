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
        aqi: {
          good: "#10B981", // 0-50
          moderate: "#FBBF24", // 51-100
          sensitive: "#F97316", // 101-150
          unhealthy: "#EF4444", // 151-200
          veryUnhealthy: "#8B5CF6", // 201-300
          hazardous: "#7F1D1D" // 301+
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
