import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use a cache directory outside node_modules to avoid EPERM on Windows/OneDrive
  cacheDir: path.resolve(__dirname, ".vite"),
  server: {
    host: "::",
    port: 8080,
    // Polling reduces file lock issues with network/OneDrive folders on Windows
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    force: false,
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
}));
