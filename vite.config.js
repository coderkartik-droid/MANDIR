import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { injectCmsBranchPlugin } from './scripts/injectCmsBranch.js';
import { optimizeImagesPlugin }  from './scripts/optimizeImages.js';

export default defineConfig({
  plugins: [
    react(),

    // Replaces __CMS_BRANCH__ in public/admin/index.html with the actual
    // Git branch from env vars (GIT_BRANCH, RENDER_GIT_BRANCH, etc.)
    injectCmsBranchPlugin(),

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
          if (id.includes('node_modules/gray-matter'))    return 'vendor-gray-matter';
        },
      },
    },
  },

  server: {
    fs: {
      allow: ['..'],
    },
  },
});
