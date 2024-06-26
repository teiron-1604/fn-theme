import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2816,
  },
  plugins: [react(), unocss()],
})
