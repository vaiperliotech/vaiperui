export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

// Served for URLs without a locale prefix (`/`, `/docs`...), see proxy.ts.
export const defaultLocale: Locale = "en";

// Remembers the language picked in the switcher; read by proxy.ts for URLs without a prefix.
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeNames: Record<Locale, string> = {
    en: "English",
    pt: "Português",
    es: "Español",
};

export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-BR", es: "es" };
export const ogLocale: Record<Locale, string> = { en: "en_US", pt: "pt_BR", es: "es_ES" };

export function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}

/** `localePath("pt", "/docs")` -> `/pt/docs`; `localePath("pt", "/")` -> `/pt`. */
export function localePath(locale: Locale, href: string): string {
    return `/${locale}${href === "/" ? "" : href}`;
}

/** Removes a leading locale segment: `/pt/docs` -> `/docs`, `/pt` -> `/`. */
export function stripLocale(pathname: string): string {
    const [, first, ...rest] = pathname.split("/");
    if (first && isLocale(first)) return `/${rest.join("/")}`;
    return pathname;
}

/** `alternates` metadata for a page: canonical plus one hreflang per locale. */
export function alternatesFor(locale: Locale, href: string) {
    return {
        canonical: localePath(locale, href),
        languages: {
            ...Object.fromEntries(locales.map((l) => [htmlLang[l], localePath(l, href)])),
            "x-default": localePath(defaultLocale, href),
        },
    };
}
