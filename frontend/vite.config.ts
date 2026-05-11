import path from "path"
import react from "@vitejs/plugin-react"
<<<<<<< HEAD
import { defineConfig } from "vitest/config"
=======
import { defineConfig } from "vite"
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
<<<<<<< HEAD
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    globals: true,
  },
=======
>>>>>>> c5c5017 (feat(frontend): migrate react fragrance experienceAdds the Vite React application, Tailwind styling, Zustand state, API services, report capture flow, reusable UI components, and static imagery for the Olfit fragrance matching experience.)
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
