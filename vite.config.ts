import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tickers': {
        target: 'http://fastapi-app:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tickers/, '/tickers'),
      },
      '/news': {
        target: 'http://fastapi-app:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/news/, '/news'),
      },
      '/auth': {
        target: 'http://fastapi-app:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      },
    },
  },
});
