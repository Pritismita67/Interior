import { defineConfig } from 'vite';

// Update 'base' with your GitHub repository name
export default defineConfig({
  base: '/Interior/', // Change this to match your GitHub repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Ensures assets like .glb are properly served
  },
  server: {
    port: 3000,
    open: true,
  },
});