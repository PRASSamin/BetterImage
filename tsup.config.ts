import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    components: "src/components/index.ts",
    lib: "src/lib/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "esnext",
  esbuildOptions(options) {
    options.keepNames = true;
  },
  outDir: "dist",
});
