// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://7kzr33rlv2.execute-api.us-east-1.amazonaws.com/prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`🔄 Proxying: ${req.method} ${req.url} → ${options.target}${req.url.replace('/api', '')}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`✅ Response: ${proxyRes.statusCode} for ${req.url}`)
          })
          proxy.on('error', (err, req, res) => {
            console.error(`❌ Proxy error for ${req.url}:`, err.message)
          })
        }
      }
    }
  }
})