import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static, CSP-friendly build. base:'./' so the bundle works inside the BGU
// sandbox iframe regardless of the mount path. Fonts are bundled locally in
// public/fonts (no CDN) so a strict font-src 'self' is enough. No backend,
// no AI, no payment SDK — the only fetches are the three same-origin JSON
// reference files at init, after which the app is fully offline.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2018',
    outDir: 'dist',
    assetsInlineLimit: 0, // keep fonts as real files so font-src 'self' is enough
  },
})
