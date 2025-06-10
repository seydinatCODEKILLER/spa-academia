import { defineConfig } from "vite";
import tsconfigPath from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPath()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  base: "/",
});
