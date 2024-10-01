module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      screens: {
        'custom-1': '430px',
        'custom-2': '475px',
        'custom-3': '520px',
        'custom-4': '565px',
        'custom-5': '610px',
        'custom-6': '655px',
        'custom-7': '768px',
      },
    },
  },
};