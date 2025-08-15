// vite.lib.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const isExternal = (id) =>
  /^(react|react-dom|scheduler)(\/.*)?$/.test(id); 
// covers: react, react/jsx-dev-runtime, react-dom, react-dom/client, etc.

export default defineConfig({
  plugins: [
    // Avoid needing 'react/jsx-runtime' as a global in UMD
    react({ jsxRuntime: "classic" }),
    tailwindcss(),
  ],
  build: {
    lib: { entry: "src/lib/index.jsx", name: "QuizApp" },
    rollupOptions: {
      external: isExternal,
      output: [
        {
          format: "es",
          entryFileNames: "quiz-app.es.js",
          plugins: [visualizer({ filename: "dist/stats.es.html", gzipSize: true, brotliSize: true })],
        },
        {
          format: "umd",
          name: "QuizApp",
          // map every external id we reference to a browser global
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react-dom/client": "ReactDOM",
            scheduler: "Scheduler",
          },
          entryFileNames: "quiz-app.umd.js",
          plugins: [visualizer({ filename: "dist/stats.umd.html", gzipSize: true, brotliSize: true })],
        },
      ],
    },
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    sourcemap: true,
    emptyOutDir: true, // wipe old bundles so the report isn’t mixing past outputs
    outDir: "dist",
  },
  resolve: { alias: { "@": "/src" } },
});