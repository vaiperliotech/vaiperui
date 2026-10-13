import { getComponents } from "@/data/components";
import { getVariations } from "@/data/variations";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { slugify } from "./slug";

export type SearchKind = "page" | "component" | "section" | "prop" | "example";

export type SearchEntry = {
    kind: SearchKind;
    title: string;
    /** Where it lives, e.g. the component a prop belongs to. */
    parent?: string;
    /** Extra text matched by the search but not shown as the title. */
    text: string;
    /** One short line shown under the title in the results. */
    summary?: string;
    href: string;
};

const GUIDES = [
    { key: "intro", path: "/docs", sections: ["whatIs", "startHere", "components"] },
    {
        key: "installation",
        path: "/docs/installation",
        sections: ["install", "requirements", "css", "components", "dark"],
    },
    {
        key: "gettingStarted",
        path: "/docs/getting-started",
        sections: ["first", "variants", "masks", "next"],
    },
] as const;

// "<c>Input</c> formats…" -> "Input formats…"
const stripMarkup = (text: string) => text.replace(/<\/?(?:c|link(?::[a-z]+)?)>/g, "");

/** A one-line preview: markup and backticks removed, cut at 140 characters. */
function summarize(text: string): string {
    const plain = stripMarkup(text).replace(/`/g, "").replace(/\s+/g, " ").trim();
    return plain.length > 140 ? `${plain.slice(0, 139).trimEnd()}…` : plain;
}

/** Everything the docs can be searched for, in one locale. Built at build time, served as JSON. */
export function buildSearchIndex(locale: Locale): SearchEntry[] {
    const dict = getDictionary(locale);
    const entries: SearchEntry[] = [];

    for (const guide of GUIDES) {
        const g = dict.guides[guide.key] as Record<string, unknown>;
        const guideTitle = dict.docs.guides[guide.key];
        const href = localePath(locale, guide.path);
        entries.push({
            kind: "page",
            title: guideTitle,
            text: String(g.description),
            summary: summarize(String(g.description)),
            href,
        });

        for (const key of guide.sections) {
            const section = g[key] as Record<string, string>;
            const body = [section.body, section.intro, section.variables].filter(Boolean).join(" ");
            entries.push({
                kind: "section",
                title: section.title as string,
                parent: guideTitle,
                text: stripMarkup(body),
                summary: summarize(body),
                href: `${href}#${slugify(section.title as string)}`,
            });
        }
    }

    const variations = getVariations(locale);
    for (const component of getComponents(locale)) {
        const href = localePath(locale, `/docs/${component.slug}`);
        entries.push({
            kind: "component",
            title: component.name,
            text: `${component.blurb} ${component.usage}`,
            summary: summarize(component.blurb),
            href,
        });

        for (const group of variations[component.slug] ?? []) {
            entries.push({
                kind: "example",
                title: group.title,
                parent: component.name,
                text: group.description ?? "",
                summary: summarize(group.description ?? ""),
                href: `${href}#${slugify(group.title)}`,
            });
        }

        for (const row of component.props) {
            entries.push({
                kind: "prop",
                title: row.prop,
                parent: component.name,
                text: `${row.values} ${row.description}`,
                summary: summarize(row.description),
                href: `${href}#prop-${slugify(row.prop)}`,
            });
        }
    }

    return entries;
}
