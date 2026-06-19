import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { cmsApiPlugin } from "./scripts/vite-plugin-cms-api.mjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/My-portfolio/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), cmsApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
