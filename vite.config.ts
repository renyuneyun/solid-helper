import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [{ ...nodeExternals(), enforce: "pre" }, dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SolidHelper",
      fileName: "solid-helper",
    },
    rollupOptions: {
      plugins: [
        nodePolyfills(/* options */)
      ],
    },
  },
});