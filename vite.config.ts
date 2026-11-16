import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc'; // Change this line

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two pages: the CoreLink AI home page and the logistics sub-page at /logistics/
      input: {
        main: 'index.html',
        logistics: 'logistics/index.html',
      },
    },
  },
});
