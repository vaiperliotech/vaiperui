// Bundled and run by scripts/build-skill.mjs. Writes the agent skill that ships inside the `vaiperui`
// package (packages/vaiperui/skills/vaiperui): the hand-written SKILL.md, theming and recipes from
// `skill-src/`, plus one generated reference per component from the same catalog the docs site and
// the MCP server use, so the three never disagree.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { formatComponent, SECTIONS } from "../src/format";
import { CatalogSchema } from "../src/schema";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../skill-src");
// Two copies of the same skill: shipped inside the npm package, and inside the Claude Code plugin.
const targets = [
    resolve(here, "../../vaiperui/skills/vaiperui"),
    resolve(here, "../../../plugin/skills/vaiperui"),
];
const check = process.argv.includes("--check");

const catalog = CatalogSchema.parse(
    JSON.parse(readFileSync(resolve(here, "../catalog/en.json"), "utf8")),
);

const files = new Map<string, string>();
const read = (path: string) => readFileSync(join(src, path), "utf8");

files.set("SKILL.md", read("SKILL.md"));
files.set("references/theming.md", read("references/theming.md"));
files.set("references/patterns.md", read("references/patterns.md"));

for (const component of catalog.components) {
    files.set(`references/${component.slug}.md`, `${formatComponent(component, [...SECTIONS])}\n`);
}

const index = [
    `# vaiperui components (${catalog.components.length})`,
    "",
    `Version ${catalog.version}. One file per component with props, examples and accessibility.`,
];
for (const group of catalog.groups) {
    index.push("", `## ${group.label.charAt(0).toUpperCase()}${group.label.slice(1)}`);
    for (const slug of group.components) {
        const component = catalog.components.find((c) => c.slug === slug);
        if (component) index.push(`- [${component.name}](${slug}.md): ${component.blurb}`);
    }
}
files.set("references/components.md", `${index.join("\n")}\n`);

function listFiles(dir: string, base = dir): string[] {
    try {
        return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
            entry.isDirectory()
                ? listFiles(join(dir, entry.name), base)
                : [join(dir, entry.name).slice(base.length + 1)],
        );
    } catch {
        return [];
    }
}

if (check) {
    const problems: string[] = [];
    for (const out of targets) {
        const existing = new Set(listFiles(out));
        for (const [name, content] of files) {
            if (!existing.has(name)) problems.push(`missing: ${out}/${name}`);
            else if (readFileSync(join(out, name), "utf8") !== content)
                problems.push(`stale: ${out}/${name}`);
        }
        for (const name of existing)
            if (!files.has(name)) problems.push(`unexpected: ${out}/${name}`);
    }
    if (problems.length) {
        console.error(
            `${problems.join("\n")}\nThe skill is out of date: run \`pnpm --filter vaiperui-mcp skill\`.`,
        );
        process.exit(1);
    }
    console.log(`skill up to date (${files.size} files, ${targets.length} copies)`);
} else {
    for (const out of targets) {
        rmSync(out, { recursive: true, force: true });
        for (const [name, content] of files) {
            mkdirSync(dirname(join(out, name)), { recursive: true });
            writeFileSync(join(out, name), content);
        }
        console.log(`wrote ${files.size} files to ${out}`);
    }
}
