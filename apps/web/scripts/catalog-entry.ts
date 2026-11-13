// Bundled and run by scripts/catalog.mjs: turns the docs-site data into plain JSON catalogs for the
// MCP server and the agent skill, so both always say what the docs say.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Catalog, CatalogSchema, LOCALES } from "../../../packages/mcp/src/schema";
import { getComponents } from "../src/data/components";
import { COMPONENT_GROUPS } from "../src/data/guides";
import { SETUP } from "../src/data/setup";
import { getVariations } from "../src/data/variations";
import { getDictionary } from "../src/i18n/dictionaries";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const outDir = resolve(root, "packages/mcp/catalog");
const check = process.argv.includes("--check");

/** "<c>x</c>" -> "`x`", "<link:slug>text</link>" -> "text (see the slug component)". */
function plain(text: string): string {
    return text
        .replace(/<c>(.*?)<\/c>/g, "`$1`")
        .replace(/<link:([a-z-]+)>(.*?)<\/link>/g, "$2")
        .replace(/\s+/g, " ")
        .trim();
}

/** Types each component exports from the package root, found through `export type {..} from ".../components/<Folder>/types"`. */
function exportedTypes(): Map<string, string[]> {
    const src = resolve(root, "packages/vaiperui/src");
    const files = [
        resolve(src, "index.ts"),
        ...readdirSync(resolve(src, "groups")).map((f) => resolve(src, "groups", f)),
    ];
    const byFolder = new Map<string, string[]>();
    for (const file of files) {
        const source = readFileSync(file, "utf8");
        for (const match of source.matchAll(
            /export\s+type\s*\{([^}]*)\}\s*from\s*["'][^"']*components\/([A-Za-z]+)\/types["']/g,
        )) {
            const names = (match[1] ?? "")
                .split(",")
                .map(
                    (n) =>
                        n
                            .trim()
                            .split(/\s+as\s+/)
                            .pop() ?? "",
                )
                .filter(Boolean);
            const key = (match[2] as string).toLowerCase();
            byFolder.set(key, [...(byFolder.get(key) ?? []), ...names]);
        }
    }
    return byFolder;
}

const typesByFolder = exportedTypes();
const version = JSON.parse(readFileSync(resolve(root, "packages/vaiperui/package.json"), "utf8"))
    .version as string;

function build(locale: (typeof LOCALES)[number]): Catalog {
    const dict = getDictionary(locale);
    const variations = getVariations(locale);
    const groupOf = new Map<string, string>();
    for (const group of COMPONENT_GROUPS)
        for (const slug of group.slugs) groupOf.set(slug, group.key);

    const guides = (["intro", "installation", "gettingStarted"] as const).map((key) => {
        const guide = dict.guides[key] as Record<string, unknown>;
        const sections = Object.values(guide)
            .filter(
                (value): value is Record<string, string> =>
                    typeof value === "object" && value !== null && "title" in value,
            )
            .map((section) => ({
                title: plain(section.title as string),
                body: plain(
                    [section.body, section.intro, section.variables].filter(Boolean).join(" "),
                ),
                ...(section.code ? { code: section.code as string } : {}),
            }));
        return {
            key,
            title: dict.docs.guides[key],
            description: plain(String(guide.description)),
            sections,
        };
    });

    return CatalogSchema.parse({
        library: "vaiperui",
        version,
        locale,
        setup: SETUP,
        groups: COMPONENT_GROUPS.map((group) => ({
            key: group.key,
            label: (dict.docs.groups as Record<string, string>)[group.key],
            components: [...group.slugs],
        })),
        components: getComponents(locale).map((component) => ({
            slug: component.slug,
            name: component.name,
            group: groupOf.get(component.slug) ?? "other",
            blurb: plain(component.blurb),
            usage: plain(component.usage),
            code: component.code,
            props: component.props,
            types: [...new Set(typesByFolder.get(component.name.toLowerCase()) ?? [])].sort(),
            variations: (variations[component.slug] ?? []).map((v) => ({
                title: v.title,
                ...(v.description ? { description: plain(v.description) } : {}),
                code: v.code,
            })),
            ...(component.accessibility ? { accessibility: component.accessibility } : {}),
        })),
        guides,
    });
}

mkdirSync(outDir, { recursive: true });
let stale = false;
for (const locale of LOCALES) {
    const json = `${JSON.stringify(build(locale), null, 2)}\n`;
    const file = resolve(outDir, `${locale}.json`);
    if (check) {
        let current = "";
        try {
            current = readFileSync(file, "utf8");
        } catch {}
        if (current !== json) {
            stale = true;
            console.error(`stale: ${file}`);
        }
    } else {
        writeFileSync(file, json);
        console.log(`wrote ${file} (${(json.length / 1024).toFixed(0)} KB)`);
    }
}
if (stale) {
    console.error("The catalog is out of date: run `pnpm --filter @vaiperui/web catalog`.");
    process.exit(1);
}
