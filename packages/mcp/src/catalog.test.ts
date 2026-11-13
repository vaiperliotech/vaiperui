import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { loadCatalog } from "./catalog";
import { DEFAULT_SECTIONS, formatComponent, formatList, SECTIONS } from "./format";
import { LOCALES } from "./schema";

const lib = join(import.meta.dirname, "../../vaiperui/src");

/** Every name the library exports from its root (index.ts and the group files it re-exports). */
function libraryExports(): Set<string> {
    const files = [
        join(lib, "index.ts"),
        ...readdirSync(join(lib, "groups")).map((f) => join(lib, "groups", f)),
    ];
    const names = new Set<string>();
    for (const file of files) {
        const source = readFileSync(file, "utf8");
        for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
            for (const part of (match[1] ?? "").split(",")) {
                const name = part
                    .trim()
                    .split(/\s+as\s+/)
                    .pop()
                    ?.replace(/^type\s+/, "")
                    .trim();
                if (name) names.add(name);
            }
        }
    }
    return names;
}

const exported = libraryExports();

describe.each(LOCALES)("catalog (%s)", (locale) => {
    it("is complete: every component has usage, an example, props, accessibility and variations", async () => {
        const catalog = await loadCatalog(locale);
        const problems: string[] = [];
        for (const c of catalog.components) {
            if (c.blurb.length < 20) problems.push(`${c.slug}: blurb`);
            if (c.usage.length < 40) problems.push(`${c.slug}: usage`);
            if (!c.code.includes("vaiperui")) problems.push(`${c.slug}: code has no import`);
            if (c.props.length < 3) problems.push(`${c.slug}: props`);
            if (!c.accessibility || c.accessibility.notes.length < 2)
                problems.push(`${c.slug}: accessibility`);
            if (c.variations.length < 1) problems.push(`${c.slug}: variations`);
            for (const p of c.props) {
                if (!p.prop || !p.description) problems.push(`${c.slug}: empty prop row ${p.prop}`);
            }
        }
        expect(problems).toEqual([]);
    });

    it("lists the exported types of every component, including its Props type", async () => {
        const catalog = await loadCatalog(locale);
        const without = catalog.components
            .filter((c) => !c.types.some((t) => t.endsWith("Props")))
            .map((c) => c.slug);
        expect(without).toEqual([]);
    });

    it("has no leftover markup or placeholders", async () => {
        const raw = JSON.stringify(await loadCatalog(locale));
        expect(raw).not.toMatch(/<c>|<\/c>|<link:|\[object|undefined|TODO|FIXME/);
    });

    it("lists every component in exactly one group", async () => {
        const catalog = await loadCatalog(locale);
        const grouped = catalog.groups.flatMap((g) => g.components);
        expect(new Set(grouped).size).toBe(grouped.length);
        expect([...grouped].sort()).toEqual(catalog.components.map((c) => c.slug).sort());
    });
});

describe("catalog (all languages)", () => {
    it("has the same components in every language", async () => {
        const [en, ...others] = await Promise.all(LOCALES.map((l) => loadCatalog(l)));
        const slugs = (c: typeof en) => c?.components.map((x) => x.slug).sort();
        for (const other of others) expect(slugs(other)).toEqual(slugs(en));
        expect(en?.components.length).toBeGreaterThanOrEqual(44);
    });

    it("documents the same props in every language (translations never add or drop a prop)", async () => {
        const [en, ...others] = await Promise.all(LOCALES.map((l) => loadCatalog(l)));
        for (const other of others) {
            for (const c of en?.components ?? []) {
                const twin = other.components.find((x) => x.slug === c.slug);
                // The "(native)" row is a label, translated.
                const names = (props: typeof c.props) =>
                    props.map((p) => p.prop).filter((n) => !n.startsWith("("));
                expect(names(twin?.props ?? []), c.slug).toEqual(names(c.props));
            }
        }
    });
});

describe("the docs match the library", () => {
    it("every documented component is exported from the package root", async () => {
        const catalog = await loadCatalog("en");
        // Toast is used through `toast()` and `<Toaster />`; the rest export their own name.
        const missing = catalog.components
            .filter((c) => !exported.has(c.name) && c.name !== "Toast")
            .map((c) => c.name);
        expect(missing).toEqual([]);
        expect(exported.has("Toaster") && exported.has("toast")).toBe(true);
    });

    it("every name imported in an example, and every JSX tag in it, exists in the library", async () => {
        const catalog = await loadCatalog("en");
        const problems: string[] = [];
        for (const c of catalog.components) {
            const samples = [c.code, ...c.variations.map((v) => v.code)];
            for (const code of samples) {
                for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']vaiperui["']/g)) {
                    for (const part of (m[1] ?? "").split(",")) {
                        const name = part.trim().replace(/^type\s+/, "");
                        if (name && !exported.has(name))
                            problems.push(`${c.slug}: imports ${name}`);
                    }
                }
                for (const m of code.matchAll(/(?<![A-Za-z0-9_])<([A-Z][A-Za-z0-9]*)[\s/>]/g)) {
                    const tag = m[1] as string;
                    // Link is the router link of the user's app (Breadcrumb's asChild example).
                    if (!exported.has(tag) && !["Fragment", "Link"].includes(tag))
                        problems.push(`${c.slug}: <${tag}>`);
                }
            }
        }
        expect([...new Set(problems)]).toEqual([]);
    });
});

describe("output size (tokens are the cost of an MCP tool)", () => {
    const tokens = (text: string) => Math.ceil(text.length / 4);

    it("list_components stays small", async () => {
        expect(tokens(formatList(await loadCatalog("en")))).toBeLessThan(3000);
    });

    it("the default get_component answer stays under 3k tokens for every component", async () => {
        const catalog = await loadCatalog("en");
        const big = catalog.components
            .map((c) => [c.slug, tokens(formatComponent(c, DEFAULT_SECTIONS))] as const)
            .filter(([, n]) => n > 3000);
        expect(big).toEqual([]);
    });

    it("even every section of the largest component stays under 8k tokens", async () => {
        const catalog = await loadCatalog("en");
        const max = Math.max(
            ...catalog.components.map((c) => tokens(formatComponent(c, [...SECTIONS]))),
        );
        expect(max).toBeLessThan(8000);
    });
});
