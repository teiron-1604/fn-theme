import { theme } from '@fn/theme/tailwind'

// https://tailwindcss.com/docs/theme

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: { ...theme },
  },
  plugins: [],
}
