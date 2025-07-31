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
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            const url = req.url || ''
            console.log(`🔄 Proxying: ${req.method} ${url} → ${_options.target}${url.replace('/api', '')}`)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`✅ Response: ${proxyRes.statusCode} for ${req.url || ''}`)
          })
          proxy.on('error', (err, req, _res) => {
            console.error(`❌ Proxy error for ${req.url || ''}:`, err.message)
          })
        }
      }
    }
  }
})