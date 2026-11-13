import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { loadCatalog } from "./catalog";
import type { Catalog } from "./schema";

const pkg = join(import.meta.dirname, "..");
const lib = join(pkg, "../vaiperui");
const skill = join(lib, "skills/vaiperui");
const read = (path: string) => readFileSync(join(skill, path), "utf8");

let en: Catalog;
beforeAll(async () => {
    en = await loadCatalog("en");
});

describe("SKILL.md", () => {
    const md = () => read("SKILL.md");

    it("has valid frontmatter: name matches the folder, description says what and when", () => {
        const match = /^---\n([\s\S]*?)\n---\n/.exec(md());
        expect(match, "frontmatter").not.toBeNull();
        const front = match?.[1] ?? "";
        const name = /^name:\s*(.+)$/m.exec(front)?.[1]?.trim();
        const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim() ?? "";
        expect(name).toBe("vaiperui");
        expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(description.length).toBeGreaterThan(200);
        expect(description.length).toBeLessThanOrEqual(1024);
        expect(description).not.toMatch(/[<>]/);
        expect(description).toMatch(/^Use when/);
        expect(description).toContain("vaiperui");
    });

    it("stays lean: it is loaded whole into the context", () => {
        const text = md();
        expect(text.split("\n").length).toBeLessThan(200);
        expect(Buffer.byteLength(text)).toBeLessThan(13_000);
    });

    it("links only to files that exist", () => {
        const links = [...md().matchAll(/`(references\/[a-z0-9-]+\.md)`/g)].map(
            (m) => m[1] as string,
        );
        expect(links.length).toBeGreaterThan(2);
        for (const link of links.filter((l) => !l.includes("<")))
            expect(existsSync(join(skill, link)), link).toBe(true);
    });

    it("mentions every component in the picker", () => {
        const text = md();
        const missing = en.components
            .filter((c) => !text.includes(`\`${c.name}`) && !text.includes(c.name))
            .map((c) => c.name);
        expect(missing).toEqual([]);
    });
});

describe("references", () => {
    it("has one file per component with all its props, and an index linking to them", () => {
        const index = read("references/components.md");
        for (const c of en.components) {
            const file = read(`references/${c.slug}.md`);
            expect(file.startsWith(`# ${c.name}\n`), c.slug).toBe(true);
            for (const p of c.props.filter((row) => !row.prop.startsWith("("))) {
                expect(file, `${c.slug}.${p.prop}`).toContain(`\`${p.prop}\``);
            }
            expect(file).toContain("## Accessibility");
            expect(file).toContain("## Examples");
            expect(index).toContain(`(${c.slug}.md)`);
        }
    });

    it("is generated from the catalog (run `pnpm --filter vaiperui-mcp skill` when this fails)", () => {
        expect(() =>
            execFileSync("node", [join(pkg, "scripts/build-skill.mjs"), "--check"], {
                stdio: "pipe",
            }),
        ).not.toThrow();
    });
});

describe("claims in SKILL.md match the library", () => {
    const row = (slug: string, prop: string) =>
        en.components
            .find((c) => c.slug === slug)
            ?.props.find((p) =>
                p.prop
                    .split("/")
                    .map((s) => s.trim())
                    .includes(prop),
            );

    it.each([
        ["select", "onValueChange", "(value: string)"],
        ["radio", "onValueChange", "(value: string)"],
        ["tabs", "onValueChange", "(value: string)"],
        ["segmented-control", "onValueChange", "(value: string)"],
        ["slider", "value", "number[]"],
        ["slider", "onValueCommit", "number[]"],
        ["date-picker", "onValueChange", "Date"],
        ["date-range-picker", "onValueChange", "DateRange"],
        ["time-picker", "onValueChange", "string"],
        ["date-time-picker", "onValueChange", "Date"],
        ["accordion", "value", "string[]"],
        ["pagination", "onPageChange", "page: number"],
        ["pagination", "pageCount", "number"],
        ["stepper", "current", "number"],
        ["upload", "onFilesChange", "File[]"],
        ["modal", "onOpenChange", "open"],
        ["lightbox", "onIndexChange", "index"],
        ["carousel", "onIndexChange", "index"],
        ["select", "loading", "boolean"],
        ["select", "hasMore", "boolean"],
        ["select", "onReachEnd", "() => void"],
        ["select", "onSearchChange", "query: string"],
        ["input", "mask", "custom"],
    ])("%s.%s documents %s", (slug, prop, expected) => {
        expect(row(slug, prop), `${slug}.${prop}`).toBeDefined();
        const r = row(slug, prop);
        expect(`${r?.values} ${r?.description}`).toContain(expected);
    });

    const typesOf = (dir: string) =>
        readFileSync(join(lib, "src/components", dir, "types.ts"), "utf8");

    it("the accessible names it calls required really are required in the types", () => {
        expect(typesOf("Slider")).toMatch(/"aria-label": string;/);
        expect(typesOf("SegmentedControl")).toMatch(/"aria-label": string;/);
        expect(typesOf("Carousel")).toMatch(/"aria-label": string;/);
        expect(typesOf("Avatar")).toMatch(/^\s+name: string;/m);
        expect(typesOf("Modal")).toMatch(/^\s+title: ReactNode;/m);
        expect(typesOf("Gallery")).toMatch(/^\s+alt: string;/m);
    });

    it("Select really has no helperText / errorMessage (the skill says so)", () => {
        expect(typesOf("Select")).not.toMatch(/errorMessage|helperText/);
    });

    it("the components the skill says forward a ref do forward it", () => {
        for (const dir of [
            "Input",
            "Textarea",
            "Checkbox",
            "Switch",
            "Radio",
            "Upload",
            "Button",
            "Container",
            "Grid",
            "Stack",
            "Divider",
        ]) {
            expect(
                readFileSync(join(lib, "src/components", dir, `${dir}.tsx`), "utf8"),
                dir,
            ).toContain("forwardRef");
        }
        for (const dir of ["Select", "Slider", "DatePicker", "Modal"]) {
            expect(
                readFileSync(join(lib, "src/components", dir, `${dir}.tsx`), "utf8"),
                dir,
            ).not.toContain("forwardRef");
        }
    });

    it("the setup in SKILL.md is the one of the docs", () => {
        const text = read("SKILL.md");
        expect(text).toContain(en.setup.install);
        expect(text).toContain(en.setup.css);
        expect(en.setup.darkHtml).toContain('className="dark"');
        expect(text).toContain('className="dark"');
        expect(readFileSync(join(lib, "src/styles/theme.css"), "utf8")).toContain(
            "@custom-variant dark",
        );
    });
});

describe("recipes compile against the real library", () => {
    const dir = join(lib, ".skill-check");

    it("every tsx block of patterns.md type-checks (strict)", () => {
        const blocks = [...read("references/patterns.md").matchAll(/```tsx\n([\s\S]*?)```/g)].map(
            (m) => m[1] as string,
        );
        expect(blocks.length).toBeGreaterThanOrEqual(7);
        rmSync(dir, { recursive: true, force: true });
        mkdirSync(dir, { recursive: true });
        for (const [i, code] of blocks.entries())
            writeFileSync(join(dir, `recipe-${i + 1}.tsx`), code);
        writeFileSync(
            join(dir, "tsconfig.json"),
            JSON.stringify({
                compilerOptions: {
                    target: "ES2022",
                    lib: ["ES2022", "DOM", "DOM.Iterable"],
                    module: "ESNext",
                    moduleResolution: "bundler",
                    jsx: "react-jsx",
                    strict: true,
                    noUncheckedIndexedAccess: true,
                    noEmit: true,
                    skipLibCheck: true,
                    types: [],
                    paths: { vaiperui: ["../src/index.ts"] },
                },
                include: ["*.tsx"],
            }),
        );
        try {
            execFileSync(join(lib, "node_modules/.bin/tsc"), ["-p", join(dir, "tsconfig.json")], {
                encoding: "utf8",
                stdio: "pipe",
            });
        } catch (error) {
            const output = (error as { stdout?: string }).stdout ?? String(error);
            throw new Error(`recipes do not compile:\n${output}`);
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });
});

describe("the Claude Code plugin and marketplace", () => {
    const root = join(pkg, "../..");
    const json = (path: string) =>
        JSON.parse(readFileSync(join(root, path), "utf8")) as Record<string, unknown> & {
            name: string;
            version: string;
            description: string;
            homepage: string;
            owner: { name: string };
            plugins: Array<Record<string, string>>;
            mcpServers: Record<string, { command: string; args: string[] }>;
            bin: Record<string, string>;
        };
    const libVersion = json("packages/vaiperui/package.json").version as string;

    it("plugin.json is valid and in sync with the library version", () => {
        const plugin = json("plugin/.claude-plugin/plugin.json");
        expect(plugin.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(plugin.name).not.toMatch(/^(claude|anthropic|cc-plugin)/);
        expect(plugin.version).toBe(libVersion);
        expect(plugin.description.length).toBeGreaterThan(40);
        expect(() => new URL(plugin.homepage)).not.toThrow();
    });

    it("marketplace.json points at the plugin folder and uses a non-reserved name", () => {
        const market = json(".claude-plugin/marketplace.json");
        expect(market.owner.name).toBeTruthy();
        expect(["claude-plugins-official", "anthropic-marketplace", "agent-skills"]).not.toContain(
            market.name,
        );
        const [entry] = market.plugins;
        expect(entry?.name).toBe(json("plugin/.claude-plugin/plugin.json").name);
        expect(entry?.source?.startsWith("./")).toBe(true);
        expect(existsSync(join(root, entry?.source ?? "x", ".claude-plugin/plugin.json"))).toBe(
            true,
        );
        expect(entry?.version).toBe(libVersion);
    });

    it("the bundled MCP server is the remote endpoint of the website (Streamable HTTP, route /mcp)", () => {
        const server = json("plugin/.mcp.json").mcpServers.vaiperui as {
            type?: string;
            url?: string;
        };
        expect(server.type).toBe("http");
        const homepage = (json("packages/vaiperui/package.json") as unknown as { homepage: string })
            .homepage;
        expect(server.url).toBe(`${homepage}/mcp`);
        expect(existsSync(join(root, "apps/web/src/app/mcp/route.ts"))).toBe(true);
    });

    it("ships the same skill as the npm package", () => {
        for (const file of ["SKILL.md", "references/select.md", "references/patterns.md"]) {
            expect(readFileSync(join(root, "plugin/skills/vaiperui", file), "utf8")).toBe(
                read(file),
            );
        }
    });
});
