import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://freshco-0dlm.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['dotenv']
    }
  }

});

