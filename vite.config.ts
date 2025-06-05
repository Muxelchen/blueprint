import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // Bundle analyzer - generates bundle analysis report
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
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
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts', 'chart.js'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'layout-vendor': ['react-grid-layout', 'react-window'],
          // Blueprint core chunks
          'blueprint-core': [
            './src/utils/ComponentRegistry',
            './src/utils/ComponentGenerator',
            './src/utils/TemplateGenerator'
          ],
          'blueprint-components': [
            './src/components/common',
            './src/components/widgets'
          ]
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
  }
})