import type { Catalog } from "./schema";

export type HitKind = "component" | "prop" | "example" | "accessibility" | "guide";

export interface Hit {
    kind: HitKind;
    /** Component slug, or the guide key for `guide` hits. */
    ref: string;
    /** Display name of the component (or the guide title). */
    name: string;
    title: string;
    snippet: string;
    score: number;
}

interface Doc extends Omit<Hit, "score" | "snippet"> {
    text: string;
    titleTokens: string[];
    textTokens: string[];
}

/** Words people use for things the docs call something else (folded, lowercase). */
const SYNONYMS: Record<string, string[]> = {
    dropdown: ["select", "menu"],
    combobox: ["select"],
    picklist: ["select"],
    toggle: ["switch"],
    checkbox: ["checkbox", "switch"],
    dialog: ["modal", "drawer"],
    popup: ["modal", "popover"],
    sidebar: ["drawer"],
    sheet: ["drawer"],
    tooltip: ["tooltip", "popover"],
    notification: ["toast", "alert"],
    snackbar: ["toast"],
    spinner: ["skeleton"],
    loading: ["skeleton", "loading"],
    placeholder: ["skeleton"],
    slider: ["slider"],
    range: ["slider", "daterangepicker"],
    datepicker: ["datepicker", "calendar"],
    date: ["datepicker", "calendar"],
    time: ["timepicker"],
    datetime: ["datetimepicker"],
    file: ["upload"],
    dropzone: ["upload"],
    pagination: ["pagination"],
    pager: ["pagination"],
    breadcrumbs: ["breadcrumb"],
    wizard: ["stepper"],
    steps: ["stepper"],
    carousel: ["carousel", "gallery"],
    slideshow: ["carousel"],
    lightbox: ["lightbox", "gallery"],
    video: ["videoplayer"],
    audio: ["audioplayer"],
    chip: ["tag", "badge"],
    label: ["tag", "badge"],
    avatar: ["avatar"],
    profile: ["avatar"],
    accordion: ["accordion"],
    collapse: ["accordion"],
    textfield: ["input", "textarea"],
    textbox: ["input", "textarea"],
    mask: ["input"],
    segmented: ["segmentedcontrol"],
    tabs: ["tabs", "segmentedcontrol"],
    grid: ["grid", "stack"],
    flex: ["stack"],
    separator: ["divider"],
    hr: ["divider"],
    wrapper: ["container"],
    card: ["card"],
    table: ["table"],
    list: ["list"],
    banner: ["banner", "alert"],
    alert: ["alert", "banner"],
    // Portuguese and Spanish words for the same things, so the other catalogs are searchable too.
    calendario: ["calendar"],
    notificacao: ["toast", "alert"],
    notificacion: ["toast", "alert"],
    carregando: ["skeleton"],
    carregamento: ["skeleton"],
    cargando: ["skeleton"],
    arquivo: ["upload"],
    archivo: ["upload"],
    enviar: ["upload"],
    suspenso: ["menu"],
    desplegable: ["select", "menu"],
    abas: ["tabs"],
    pestanas: ["tabs"],
    dica: ["tooltip"],
    menu: ["menu"],
    modal: ["modal"],
    botao: ["button"],
    boton: ["button"],
};

/** Lowercase, no accents. */
export function fold(text: string): string {
    return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Words of a text: splits camelCase and punctuation, folds accents. "onValueChange" -> on value change. */
export function tokenize(text: string): string[] {
    return fold(text.replace(/([a-z0-9])([A-Z])/g, "$1 $2"))
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 1);
}

/** "carregando" -> "carrega", so it also matches "carregamento": a crude stem, enough for prefix matching. */
const stem = (term: string) => (term.length >= 7 ? term.slice(0, -3) : term);

const joined = (text: string) => fold(text).replace(/[^a-z0-9]/g, "");

function buildDocs(catalog: Catalog): Doc[] {
    const docs: Doc[] = [];
    const add = (doc: Omit<Doc, "titleTokens" | "textTokens">) =>
        docs.push({ ...doc, titleTokens: tokenize(doc.title), textTokens: tokenize(doc.text) });

    for (const component of catalog.components) {
        const base = { ref: component.slug, name: component.name };
        add({
            ...base,
            kind: "component",
            title: component.name,
            text: `${component.blurb} ${component.usage}`,
        });
        for (const row of component.props) {
            add({
                ...base,
                kind: "prop",
                title: row.prop,
                text: `${row.values} ${row.description}`,
            });
        }
        for (const variation of component.variations) {
            add({
                ...base,
                kind: "example",
                title: variation.title,
                text: variation.description ?? "",
            });
        }
        const a11y = component.accessibility;
        if (a11y) {
            const text = [
                ...a11y.notes,
                ...(a11y.keys ?? []).map((key) => `${key.keys} ${key.action}`),
                ...(a11y.caveats ?? []),
            ].join(" ");
            add({ ...base, kind: "accessibility", title: `${component.name} accessibility`, text });
        }
    }
    for (const guide of catalog.guides) {
        for (const section of guide.sections) {
            add({
                kind: "guide",
                ref: guide.key,
                name: guide.title,
                title: section.title,
                text: section.body,
            });
        }
    }
    return docs;
}

const indexes = new WeakMap<Catalog, { docs: Doc[]; df: Map<string, number> }>();

function indexOf(catalog: Catalog) {
    let index = indexes.get(catalog);
    if (!index) {
        const docs = buildDocs(catalog);
        const df = new Map<string, number>();
        for (const doc of docs) {
            for (const token of new Set([...doc.titleTokens, ...doc.textTokens])) {
                df.set(token, (df.get(token) ?? 0) + 1);
            }
        }
        index = { docs, df };
        indexes.set(catalog, index);
    }
    return index;
}

function snippetOf(doc: Doc, query: string[]): string {
    const text = doc.text.replace(/\s+/g, " ").trim();
    if (text.length <= 150) return text;
    const at = query.map((token) => fold(text).indexOf(token)).find((i) => i >= 0) ?? 0;
    const start = Math.max(0, at - 40);
    return `${start > 0 ? "…" : ""}${text.slice(start, start + 150).trim()}…`;
}

const KIND_BOOST: Record<HitKind, number> = {
    component: 1.5,
    prop: 1,
    example: 0.9,
    accessibility: 0.8,
    guide: 0.9,
};

export function search(catalog: Catalog, query: string, limit = 8): Hit[] {
    const { docs, df } = indexOf(catalog);
    const terms = tokenize(query);
    if (terms.length === 0) return [];

    // Each term, plus what it stands for, with a lower weight for the stand-ins.
    const weighted = new Map<string, number>();
    for (const term of terms) {
        weighted.set(term, Math.max(weighted.get(term) ?? 0, 1));
        for (const alias of SYNONYMS[term] ?? [])
            weighted.set(alias, Math.max(weighted.get(alias) ?? 0, 0.7));
    }

    const scored: Hit[] = [];
    for (const doc of docs) {
        let score = 0;
        let matched = 0;
        const nameJoined = joined(doc.name);
        const titleJoined = joined(doc.title);
        for (const [term, weight] of weighted) {
            const idf = Math.log(1 + docs.length / (df.get(term) ?? docs.length));
            let termScore = 0;
            // The component name itself ("datepicker", "DatePicker", "date picker") is the strongest signal.
            if (doc.kind === "component" && nameJoined === term) termScore += 12;
            else if (doc.kind === "prop" && titleJoined === term) termScore += 5;
            if (doc.titleTokens.includes(term)) termScore += 4 * idf;
            else if (term.length >= 3 && doc.titleTokens.some((t) => t.startsWith(term)))
                termScore += 2 * idf;
            if (doc.textTokens.includes(term)) termScore += 1 * idf;
            else if (term.length >= 4 && doc.textTokens.some((t) => t.startsWith(stem(term))))
                termScore += 0.4 * idf;
            if (termScore > 0) matched += terms.includes(term) ? 1 : 0;
            score += termScore * weight;
        }
        if (score === 0) continue;
        // Matching every word of the query beats matching one of them many times.
        if (matched === terms.length) score *= 1.5;
        scored.push({
            kind: doc.kind,
            ref: doc.ref,
            name: doc.name,
            title: doc.title,
            snippet: snippetOf(doc, [...weighted.keys()]),
            score: score * KIND_BOOST[doc.kind],
        });
    }

    scored.sort((a, b) => b.score - a.score);
    // At most 3 hits per component, so one component can't fill the whole answer.
    const perComponent = new Map<string, number>();
    const hits: Hit[] = [];
    for (const hit of scored) {
        const key = `${hit.kind === "guide" ? "guide:" : ""}${hit.ref}`;
        const count = perComponent.get(key) ?? 0;
        if (count >= 3) continue;
        perComponent.set(key, count + 1);
        hits.push(hit);
        if (hits.length >= limit) break;
    }
    return hits;
}

/** Finds a component by slug or name ("DatePicker", "date-picker", "date picker", "datepicker"). */
export function findComponent(catalog: Catalog, name: string) {
    const wanted = joined(name);
    return catalog.components.find((c) => joined(c.slug) === wanted || joined(c.name) === wanted);
}

/** Closest component names for a miss: search hits first, then by edit distance. */
export function suggest(catalog: Catalog, name: string, limit = 5): string[] {
    const seen = new Set<string>();
    for (const hit of search(catalog, name, 12)) if (hit.kind !== "guide") seen.add(hit.name);
    const wanted = joined(name);
    const byDistance = catalog.components
        .map((c) => ({ name: c.name, distance: editDistance(joined(c.name), wanted) }))
        .sort((a, b) => a.distance - b.distance);
    for (const candidate of byDistance) if (candidate.distance <= 3) seen.add(candidate.name);
    return [...seen].slice(0, limit);
}

function editDistance(a: string, b: string): number {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let diagonal = row[0] ?? 0;
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const above = row[j] ?? 0;
            row[j] = Math.min(
                above + 1,
                (row[j - 1] ?? 0) + 1,
                diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
            diagonal = above;
        }
    }
    return row[b.length] ?? 0;
}
