import type { Metadata } from "next";

import { alternatesFor, type Locale, localePath, ogLocale } from "@/i18n/config";
import { SITE_NAME } from "./site";

/** Per-page metadata: canonical + hreflang, and Open Graph/Twitter with the page's own text. */
export function pageMetadata({
    lang,
    path,
    title,
    description,
    keywords,
    type = "website",
}: {
    lang: Locale;
    path: string;
    title: string;
    description: string;
    keywords?: string[];
    type?: "website" | "article";
}): Metadata {
    const fullTitle = `${title} · ${SITE_NAME}`;
    return {
        title,
        description,
        keywords,
        alternates: alternatesFor(lang, path),
        openGraph: {
            type,
            siteName: SITE_NAME,
            locale: ogLocale[lang],
            url: localePath(lang, path),
            title: fullTitle,
            description,
        },
        twitter: { card: "summary_large_image", title: fullTitle, description },
    };
}
