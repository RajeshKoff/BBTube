import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { brand: '#ff0033' } } },
  plugins: [],
} satisfies Config
