import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/sqlite-viewer/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#e6e6e6",
        background_color: "#e6e6e6",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "icon512_maskable.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "icon512_rounded.png",
            type: "image/png",
          },
        ],
        orientation: "any",
        display: "standalone",
        dir: "ltr",
        lang: "en-US",
        name: "SQLite Viewer",
        short_name: "SQLite",
        start_url: "/sqlite-viewer/",
        scope: "/sqlite-viewer/",
        description: "View and query SQLite databases",
        id: "sqlite-viewer-pwa",
        categories: ["utilities"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
