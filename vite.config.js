import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the built app works when opened from a file or served
  // from a subpath (e.g. GitHub Pages project sites), not just the domain root.
  base: './',
  plugins: [react()],
})
