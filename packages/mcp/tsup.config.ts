import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";

import { defineConfig } from "tsup";

const { version } = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };

export default defineConfig({
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    target: "node20",
    platform: "node",
    clean: true,
    define: { __VERSION__: JSON.stringify(version) },
    // The catalogs are JSON modules: they are bundled, so the package needs no data files at runtime.
    // The agent skill is the one directory shipped next to the code: `install-skill` copies it.
    async onSuccess() {
        const skill = "../vaiperui/skills/vaiperui";
        rmSync("dist/skill", { recursive: true, force: true });
        if (existsSync(skill)) cpSync(skill, "dist/skill", { recursive: true });
        else console.warn(`No skill at ${skill}: \`install-skill\` will have nothing to copy.`);
    },
});
