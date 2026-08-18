import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  // Pinned port, whitelisted in Sanity CORS — strictPort stops Vite from
  // silently drifting to a port the Sanity API will reject.
  server: {
    port: 5180,
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
