import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Adjust target if your backend runs elsewhere
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',            // change to '/quiz/' if served under subpath
  server: {
    port: 3000, // CRA default was 3000
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      // optional: allow absolute imports like "@/components/..."
      "@": "/src"
    }
  }
});