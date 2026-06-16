/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#26215C',
        royal: '#534AB7',
        lilac: '#EEEDFE',
        lilacEdge: '#AFA9EC',
        coral: '#993C1D',
        coralFill: '#FAECE7',
        coralEdge: '#F0997B',
      },
    },
  },
  plugins: [],
}
