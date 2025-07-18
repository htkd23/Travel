import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    global: {},
  },
  plugins: [react()],
  assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.png"]
});
