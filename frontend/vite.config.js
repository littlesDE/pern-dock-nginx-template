import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    exclude: ['crypto']
  }
})
