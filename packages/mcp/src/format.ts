import type { Catalog, ComponentDocType, PropRowType } from "./schema";
import type { Hit } from "./search";

export const SECTIONS = ["overview", "props", "accessibility", "examples"] as const;
export type Section = (typeof SECTIONS)[number];
export const DEFAULT_SECTIONS: Section[] = ["overview", "props", "accessibility"];

const isEmpty = (value: string) =>
    value === "" || value === "none" || value === "—" || value === "-";

function propLine(row: PropRowType): string {
    const def = isEmpty(row.defaultValue) ? "" : `, default ${row.defaultValue}`;
    return `- \`${row.prop}\` (${row.values}${def}): ${row.description}`;
}

/** One short line per component, grouped: what to read before choosing one. */
export function formatList(catalog: Catalog, group?: string): string {
    const groups = catalog.groups.filter((g) => !group || g.key === group);
    const lines = [
        `# vaiperui ${catalog.version}: ${groups.reduce((n, g) => n + g.components.length, 0)} components`,
    ];
    for (const g of groups) {
        lines.push("", `## ${g.label.charAt(0).toUpperCase()}${g.label.slice(1)} (${g.key})`);
        for (const slug of g.components) {
            const c = catalog.components.find((x) => x.slug === slug);
            if (c) lines.push(`- ${c.name} (\`${c.slug}\`): ${c.blurb}`);
        }
    }
    lines.push(
        "",
        'Import from the package root: `import { Name } from "vaiperui"`. Call get_component for props and examples.',
        "Not in the library (compose them): icons, charts, data grid, empty state, spinner (use Skeleton), form/field wrapper (fields carry their own label and error text).",
    );
    return lines.join("\n");
}

export function formatComponent(
    c: ComponentDocType,
    sections: Section[] = DEFAULT_SECTIONS,
): string {
    const want = new Set(sections);
    const out: string[] = [`# ${c.name}`, c.blurb];

    if (want.has("overview")) {
        out.push("", `Import: \`import { ${exportsOf(c)} } from "vaiperui"\``);
        if (c.types.length > 0) {
            out.push(`Types (same import): ${c.types.map((t) => `\`${t}\``).join(", ")}`);
        }
        out.push("", "## Usage", c.usage, "", fence(c.code));
    }
    if (want.has("props")) {
        out.push("", "## Props", ...c.props.map(propLine));
    }
    if (want.has("accessibility") && c.accessibility) {
        const a = c.accessibility;
        out.push("", "## Accessibility", ...a.notes.map((note) => `- ${note}`));
        if (a.keys?.length)
            out.push("", "Keyboard:", ...a.keys.map((k) => `- \`${k.keys}\`: ${k.action}`));
        if (a.caveats?.length)
            out.push("", "Keep in mind:", ...a.caveats.map((note) => `- ${note}`));
    }
    if (want.has("examples")) {
        out.push("", "## Examples");
        for (const v of c.variations) {
            out.push("", `### ${v.title}`);
            if (v.description) out.push(v.description);
            out.push(fence(v.code));
        }
    } else if (c.variations.length > 0) {
        out.push(
            "",
            `More examples (section "examples"): ${c.variations.map((v) => v.title).join(", ")}.`,
        );
    }
    return out.join("\n");
}

/** Names to import: the component and its parts (`Card` also needs `CardHeader`...), read from the example code. */
function exportsOf(c: ComponentDocType): string {
    const fromCode = /import\s*\{([^}]*)\}\s*from\s*["']vaiperui["']/.exec(c.code);
    if (fromCode?.[1])
        return fromCode[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .join(", ");
    return c.name;
}

function fence(code: string): string {
    return `\`\`\`tsx\n${code.trim()}\n\`\`\``;
}

export function formatHits(query: string, hits: Hit[]): string {
    if (hits.length === 0)
        return `No results for "${query}". Try other words, or call list_components.`;
    const lines = [`${hits.length} results for "${query}":`];
    for (const hit of hits) {
        const where =
            hit.kind === "guide"
                ? `guide ${hit.name} > ${hit.title}`
                : hit.kind === "component"
                  ? `${hit.name}`
                  : `${hit.name} ${hit.kind}: ${hit.title}`;
        lines.push(`- ${where}${hit.snippet ? ` — ${hit.snippet}` : ""}`);
    }
    return lines.join("\n");
}

export const SETUP_TOPICS = ["install", "css", "dark-mode", "theming", "all"] as const;
export type SetupTopic = (typeof SETUP_TOPICS)[number];

export function formatSetup(catalog: Catalog, topic: SetupTopic = "all"): string {
    const { setup } = catalog;
    const sections: Record<Exclude<SetupTopic, "all">, string> = {
        install: [
            "## Install",
            fence2("bash", setup.install),
            "`react` and `react-dom` (>=19) are peer dependencies. The library is styled with Tailwind CSS v4: the project must have it configured. Everything is exported from the package root.",
        ].join("\n"),
        css: [
            "## CSS (once, in the root stylesheet, next to Tailwind)",
            fence2("css", setup.css),
            "`theme.css` defines the `--vpd-*` tokens, the `primary|success|warning|danger` palettes and the `dark` variant. `@source` makes Tailwind scan the built components for their classes.",
        ].join("\n"),
        "dark-mode": [
            "## Dark mode (opt-in)",
            "Add the `dark` class to an ancestor, usually `<html>`. Without it everything renders in light mode.",
            fence2("tsx", setup.darkHtml),
            "Override the tokens to change the dark palette:",
            fence2("css", setup.darkVariables),
        ].join("\n"),
        theming: [
            "## Theming",
            'Every component takes `variantColor` (`primary` | `success` | `warning` | `danger`) and, when it has color, `customColor`: any CSS color (`"#ff6600"`) or `{ light, dark }` for per-theme colors. `customColor` overrides `variantColor`. Surfaces, text and borders come from CSS variables (`--vpd-surface`, `--vpd-surface-muted`, `--vpd-surface-hover`, `--vpd-text`, `--vpd-text-secondary`, `--vpd-text-muted`, `--vpd-text-placeholder`, `--vpd-border`, `--vpd-border-strong`, `--vpd-border-soft`): override them in your CSS. The palettes `primary-*`, `success-*`, `warning-*`, `danger-*` are Tailwind theme colors that alias blue, green, amber and red: redefine them in `@theme` to rebrand. Classes can be added with `className` (merged with `tailwind-merge`, yours win).',
        ].join("\n"),
    };
    const order: Array<Exclude<SetupTopic, "all">> = ["install", "css", "dark-mode", "theming"];
    const picked = topic === "all" ? order : [topic];
    return ["# vaiperui setup", ...picked.map((key) => sections[key])].join("\n\n");
}

function fence2(lang: string, code: string): string {
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
}
