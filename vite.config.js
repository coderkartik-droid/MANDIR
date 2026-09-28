import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { optimizeImagesPlugin }  from './scripts/optimizeImages.js';

export default defineConfig({
  plugins: [
    react(),

    // Post-build: resizes, recompresses, and generates .webp for all images
    // in dist/media/images/** and dist/images/**
    optimizeImagesPlugin(),
  ],

  build: {
    chunkSizeWarningLimit: 1200,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three'))          return 'vendor-three';
          if (id.includes('node_modules/@react-three'))   return 'vendor-r3f';
          if (id.includes('node_modules/framer-motion'))  return 'vendor-framer';
          if (id.includes('node_modules/gsap'))           return 'vendor-gsap';
          if (id.includes('node_modules/lenis'))          return 'vendor-lenis';
        },
      },
    },
  },

  server: {
    // Dev: forward API and uploaded-media requests to the local FastAPI backend
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8001',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['..'],
    },
  },
});
