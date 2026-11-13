import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { build } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const outfile = resolve(here, "../.build/build-skill.mjs");
mkdirSync(dirname(outfile), { recursive: true });

await build({
    entryPoints: [resolve(here, "build-skill-entry.ts")],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "warning",
    banner: {
        js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
    },
});
await import(pathToFileURL(outfile).href);
