import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tickers': 'https://api.capdbreak-finance-flow.uk',
      '/news': 'https://api.capdbreak-finance-flow.uk',
      '/auth': 'https://api.capdbreak-finance-flow.uk',
    }
  }
});
