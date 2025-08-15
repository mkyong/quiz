// vite.widget.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        lib: {
            entry: "src/lib/index.jsx",
            name: "QuizAppWidget", // exposes window.QuizAppWidget
            fileName: () => "quiz-app-widget.iife.js",
            formats: ["iife"],
        },
        // IMPORTANT: do NOT externalize React here (bundle it!)
        rollupOptions: { external: [] },
        sourcemap: false,
        outDir: "dist/widget",
        emptyOutDir: false,
    },
});