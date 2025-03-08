import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_LOCAL_IP || 'localhost',
    port: process.env.VITE_SERVER_PORT || 5174,
  }
})