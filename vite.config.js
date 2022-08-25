import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    target: 'ESNext',
    outDir: 'dist/renderer',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: { format: 'cjs' },
      external: ['electron'],
    },
  },
  optimizeDeps: {
    exclude: ['electron'],
  },
})
