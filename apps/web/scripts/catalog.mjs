// Bundles scripts/catalog-entry.ts (JSX, the "@/" alias and the library sources included) and runs it.
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const web = resolve(here, "..");
const outfile = resolve(web, ".catalog/entry.mjs");
mkdirSync(dirname(outfile), { recursive: true });

await build({
    entryPoints: [resolve(here, "catalog-entry.ts")],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    jsx: "automatic",
    logLevel: "warning",
    alias: {
        "@": resolve(web, "src"),
        vaiperui: resolve(web, "../../packages/vaiperui/src/index.ts"),
    },
    // React stays external so the bundle and the demo elements share one copy.
    external: ["react", "react-dom", "react/jsx-runtime", "react-dom/*", "next", "next/*"],
    banner: {
        js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
    },
});

await import(pathToFileURL(outfile).href);
