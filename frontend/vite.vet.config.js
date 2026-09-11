import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the dedicated Veterinary Doctor Dashboard (Port 5174)
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Accessible across LAN
    port: 5174,      // Dedicated Doctor Portal Port
    strictPort: true,
  },
})
