/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          background: '#E0E7FF',
          backgroundEnd: '#FCE7F3',
          card: 'rgba(255, 255, 255, 0.6)',
          primary: '#007AFF',
          primaryDark: '#0056CC',
          secondary: '#8E8E93',
          separator: 'rgba(229, 229, 234, 0.5)',
          label: '#1C1C1E',
          systemBlue: '#007AFF',
          systemGray: '#8E8E93',
          systemGreen: '#34C759',
          systemRed: '#FF3B30',
          systemOrange: '#FF9500',
        },
      },
      borderRadius: {
        'ios': '16px',
        'ios-lg': '20px',
        'ios-xl': '24px',
      },
      boxShadow: {
        'ios': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'ios-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-ios': 'linear-gradient(135deg, #E0E7FF 0%, #FCE7F3 50%, #E0E7FF 100%)',
      },
    },
  },
  plugins: [],
}
