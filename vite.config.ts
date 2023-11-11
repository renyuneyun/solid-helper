import { defineConfig } from 'vite'
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SolidHelper",
      fileName: "solid-helper",
    },
    rollupOptions: {
      external: ["@inrupt/solid-client-authn-browser"],
      output: {
        globals: {
          "@inrupt/solid-client-authn-browser": "solidClientAuthnBrowser",
        },
      },
    },
  },
});