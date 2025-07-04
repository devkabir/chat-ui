import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Expose to network
    port: 3000,
    strictPort: true, // Exit if port is in use
    open: true // Don't auto-open browser
  },
  build: {
    assetsDir: '.',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      }
    }
  },
  base: './'
})