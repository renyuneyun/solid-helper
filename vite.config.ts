import { defineConfig } from 'vite'
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
      external: ["abort-controller"],
      output: {
        globals: {
          "abort-controller": "AbortController",
        },
      },
      plugins: [
        nodePolyfills( /* options */ )
      ]
    },
  },
});