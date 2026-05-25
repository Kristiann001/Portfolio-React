import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Raise warning threshold — pdfjs worker is large by design
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires manualChunks to be a function
        manualChunks(id: string) {
          if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
          if (id.includes('sweetalert2')) return 'vendor-swal';
          if (
            id.includes('@supabase/') ||
            id.includes('cross-fetch') ||
            id.includes('node-fetch')
          )
            return 'vendor-supabase';
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/') ||
            id.includes('node_modules/react/')
          )
            return 'vendor-react';
        },
      },
    },

    // Minify CSS
    cssMinify: true,

    // No source maps in production builds
    sourcemap: false,
  },

  // Pre-bundle heavy deps for faster dev-server startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'sweetalert2',
    ],
    // pdfjs-dist is pure ESM — skip CJS transform overhead
    exclude: ['pdfjs-dist'],
  },
});
