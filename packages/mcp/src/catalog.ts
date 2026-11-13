import { type Catalog, CatalogSchema, LOCALES, type Locale } from "./schema";

// Dynamic imports keep each language in its own chunk: only the one in use is loaded.
const loaders: Record<Locale, () => Promise<{ default: unknown }>> = {
    en: () => import("../catalog/en.json"),
    pt: () => import("../catalog/pt.json"),
    es: () => import("../catalog/es.json"),
};

const cache = new Map<Locale, Catalog>();

/** "pt-BR" -> "pt", "es_MX" -> "es", anything unknown -> "en". */
export function resolveLocale(input?: string): Locale {
    const base = input?.toLowerCase().split(/[-_]/)[0];
    return (LOCALES as readonly string[]).includes(base ?? "") ? (base as Locale) : "en";
}

export async function loadCatalog(locale: Locale = "en"): Promise<Catalog> {
    const hit = cache.get(locale);
    if (hit) return hit;
    const catalog = CatalogSchema.parse((await loaders[locale]()).default);
    cache.set(locale, catalog);
    return catalog;
}
