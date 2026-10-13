import type { MetadataRoute } from "next";

import { COMPONENT_SLUGS } from "@/data/components";
import { alternatesFor, localePath, locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

const PAGES = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/docs/installation", changeFrequency: "monthly", priority: 0.8 },
    { path: "/docs/getting-started", changeFrequency: "monthly", priority: 0.8 },
    ...COMPONENT_SLUGS.map((slug) => ({
        path: `/docs/${slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    })),
] as const;

// One entry per page and locale, each listing all its language alternates (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return PAGES.flatMap(({ path, changeFrequency, priority }) =>
        locales.map((locale) => ({
            url: `${SITE_URL}${localePath(locale, path)}`,
            lastModified,
            changeFrequency,
            priority,
            alternates: {
                languages: Object.fromEntries(
                    Object.entries(alternatesFor(locale, path).languages).map(([key, href]) => [
                        key,
                        `${SITE_URL}${href}`,
                    ]),
                ),
            },
        })),
    );
}
