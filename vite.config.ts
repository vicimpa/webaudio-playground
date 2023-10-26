import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    react({ plugins: [] }),
    paths({ projects: ['../tsconfig.json'] }),
    viteSingleFile(),
  ],
});
