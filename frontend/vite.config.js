import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Check if local config exists and import it
const localConfigPath = path.resolve(__dirname, 'vite.config.local.js')
const useLocalConfig = fs.existsSync(localConfigPath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.VITE_CLIENT_PORT || 5175,
    hmr: {
      host: 'localhost'
    },
    watch: {
      usePolling: true
    }
  }
})
