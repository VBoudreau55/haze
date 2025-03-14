import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // Exclude 'lambdas' folder from being bundled
      external: ['src/lambdas/*']
    },
  },
  plugins: [react()],
})
