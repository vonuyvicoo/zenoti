import { defineConfig } from "tsup";
import tsPaths from "esbuild-ts-paths";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node18",
  splitting: false,
  tsconfig: "tsconfig.json",
  esbuildPlugins: [tsPaths()],
});
