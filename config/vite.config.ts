import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates bundle analysis report
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    // Optimize bundle splitting
    rollupOptions: {
      external: [
        // Exclude Node.js-specific modules from browser build
        'fs',
        'path',
        'child_process',
        'os'
      ],
      output: {
        manualChunks: (id) => {
          // Exclude Node.js utilities from browser build
          if (id.includes('ComponentGenerator') || id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('recharts') || id.includes('chart.js')) {
              return 'chart-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('react-grid-layout') || id.includes('react-window')) {
              return 'layout-vendor';
            }
          }
          // Blueprint components
          if (id.includes('src/components')) {
            return 'blueprint-components';
          }
          // Blueprint utilities (browser-safe only)
          if (id.includes('src/utils') && !id.includes('ComponentGenerator')) {
            return 'blueprint-utils';
          }
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
  },
  // CSS optimization
  css: {
    devSourcemap: true,
    postcss: './config/postcss.config.js',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'recharts'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Define browser-safe environment
  define: {
    __IS_BROWSER__: true
  }
})