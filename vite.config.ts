import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { getSeoHeadHtml } from "./src/lib/seo";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "inject-seo-head",
      transformIndexHtml(html) {
        return html.replace("<!--seo-head-->", getSeoHeadHtml());
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("@tsparticles")) return "vendor-particles";
          if (id.includes("/three/") || id.includes("three@")) return "vendor-three";
          if (id.includes("gsap")) return "vendor-gsap";
          if (id.includes("motion") || id.includes("framer-motion"))
            return "vendor-motion";
          if (
            id.includes("react-dom") ||
            id.includes("react/") ||
            id.includes("react@")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
  assetsInclude: ["**/*.glb"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});