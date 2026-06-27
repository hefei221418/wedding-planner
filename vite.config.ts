import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  optimizeDeps: { include: ['xlsx'] },
  build: { outDir: 'dist' },
  server: {
    proxy: {
      '/api/dav': {
        target: 'https://dav.jianguoyun.com/dav',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dav/, ''),
      },
    },
  },
})
