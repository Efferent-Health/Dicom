import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default defineConfig((ctx) => {
  // We expect the browser bundle to exist already
  const browserBundlePath = join(process.cwd(), "dist", "Efferent.Dicom.js");
  let bannerJs = "";
  try {
    bannerJs = readFileSync(browserBundlePath, "utf8");
  } catch {
    // Helpful message if user forgot to build browser first
    throw new Error(
      `Missing ${browserBundlePath}. Run "npm run build:browser" (or "npm run build").`
    );
  }

  return {
    entry: { index: "src/index.node.ts" },
    format: ["esm", "cjs"],
    outDir: "dist/node",
    dts: true,               // emits dist/node/esm/index.d.ts
    sourcemap: false,
    minify: false,
    clean: true,
    target: "es2020",
    splitting: false,        // single-file outputs
    treeshake: false,
    banner: { js: bannerJs } // <— prepend the browser build so Efferent is defined
  };
});