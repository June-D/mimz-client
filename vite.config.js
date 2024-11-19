import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  // vite 配置
  define: {
    'process.env': {
      'BASE_API': "https://localhost:8443/api",
      'BASE_URL': "/",
      'VITE_APP_TITLE': 'Vite App',
      'VITE_APP_DESC': 'Vite App Description',
      'VITE_APP_VERSION': '1.0.0',
      'VITE_APP_AUTHOR': 'Vite App Author',
      'VITE_APP_COPYRIGHT': 'Vite App Copyright',
      'VITE_APP_REPO': 'https://github.com/vitejs/vite',
      'VITE_APP_GITHUB': 'https://github.com/vitejs/vite',
      'VITE_APP_WEBSITE': 'https://vitejs.dev',
    }
  }
})
