module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#213C73',
        pagebg: '#F6F8FB',
        card: '#FFFFFF',
        border: '#E4E8EF',
        text: '#1B2A41',
        subdued: '#6B7280',
        muted: '#94A3B8',
        hover: '#F3F5F8'
      },
      maxWidth: {
        'page': '1600px'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto']
      }
    }
  },
  plugins: []
}
