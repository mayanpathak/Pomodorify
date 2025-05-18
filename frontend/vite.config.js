import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The URL of the backend API
const backendUrl = 'https://pomodorify-rsld.onrender.com/api';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(backendUrl),
  },
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
})
