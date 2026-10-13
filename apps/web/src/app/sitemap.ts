import type { MetadataRoute } from "next";

import { components } from "@/data/components";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return [
        { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/docs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        {
            url: `${SITE_URL}/docs/instalacao`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/docs/comecando`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...components.map((component) => ({
            url: `${SITE_URL}/docs/${component.slug}`,
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        })),
    ];
}
