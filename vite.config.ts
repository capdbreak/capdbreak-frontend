import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tickers': 'http://fastapi-app:8080',
      '/news': 'http://fastapi-app:8080',
      '/auth': 'http://fastapi-app:8080',
    }
  }
});
