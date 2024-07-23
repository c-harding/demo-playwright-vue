import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    watch: {
      usePolling: true
    },
    port: Number(process.env.CLIENT_PORT || process.env.PORT || 3001),
    proxy: {
      '/api': {
        target: process.env.BACKEND || `http://localhost:${process.env.SERVER_PORT || 3000}`,
        changeOrigin: true
      }
    }
  }
})
