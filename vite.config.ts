import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // 代理配置
      '/ouzx': {
        target: 'http://127.0.0.1:9955',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ouzx/, '')
      },
    }
  },
  plugins: [react()]
})
