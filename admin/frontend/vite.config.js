import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/cracked': 'http://localhost:3000',
      '/breached': 'http://localhost:3000',
      '/doxbin': 'http://localhost:3000',
      '/nulled': 'http://localhost:3000',
      '/onni': 'http://localhost:3000'
    }
  }
})