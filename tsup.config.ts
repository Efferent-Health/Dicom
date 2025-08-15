import { defineConfig } from "tsup";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default defineConfig(() => {
    const browserBundlePath = join(process.cwd(), "dist", "Efferent.Dicom.js");
    let bannerJs = "";
    try {
        bannerJs = readFileSync(browserBundlePath, "utf8");
    } catch {
        throw new Error(
            `Missing ${browserBundlePath}. Run "npm run build:browser" (or "npm run build").`
        );
    }

    return {
        entry: { index: "src/index.node.ts" },
        format: ["esm", "cjs"],
        outDir: "dist/node",
        dts: false,              // use hand-authored types instead of tsup dts        
        sourcemap: false,
        minify: false,
        clean: false,
        target: "es2020",
        splitting: false,
        treeshake: false,
        banner: { js: bannerJs }
    };
});