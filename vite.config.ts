import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development performance
      fastRefresh: true,
      // Exclude node_modules from transformation
      exclude: /node_modules/,
      jsxImportSource: 'react'
    })
  ],
  root: 'src/client',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'date-fns']
        }
      }
    },
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Optimize source maps for development
    sourcemap: false,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 3000,
    host: 'localhost',
    // Optimize proxy configuration
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    // Optimize file watching to prevent infinite loops
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/*.log',
        '**/*.tsbuildinfo',
        '**/src/server/**'
      ],
      usePolling: false,
      interval: 1000
    },
    // Prevent memory issues
    hmr: {
      overlay: true
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios'
    ],
    exclude: [
      // Exclude large dependencies that don't need pre-bundling
    ]
  },
  // Enable esbuild for faster builds
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})