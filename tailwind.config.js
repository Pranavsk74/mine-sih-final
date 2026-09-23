/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        walnut: {
          DEFAULT: '#2f2116',
          dark: '#1c130c',
          deep: '#23180f',
          light: '#4f3622',
        },
        parchment: {
          DEFAULT: '#ffebd0',
          elevated: '#fff8e9',
          paper: '#F5F1E8',
        },
        bronze: {
          DEFAULT: '#4f3622',
          light: '#987f61',
        },
        amber: {
          DEFAULT: '#fee197',
          gold: '#c9a86a',
        },
        datavis: {
          sand: '#f5dfc4',
          tan: '#d8c09a',
          gold: '#c9a86a',
          blue: '#8fa7a8',
          sage: '#9da991',
          rust: '#b8755b',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'Garamond', 'serif'],
        sans: ['Inter', 'ModernEra', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        btn: '8px',
      },
      boxShadow: {
        'none': 'none',
        'report': '0 10px 30px rgba(0,0,0,0.35)',
      }
    },
  },
  plugins: [],
}
