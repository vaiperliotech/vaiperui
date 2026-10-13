import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDoc } from "@/components/ComponentDoc";
import { COMPONENT_SLUGS, getComponent } from "@/data/components";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
    return locales.flatMap((lang) => COMPONENT_SLUGS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    if (!isLocale(lang)) return {};
    const component = getComponent(lang, slug);
    if (!component) return {};
    const meta = getDictionary(lang).meta;

    return pageMetadata({
        lang,
        path: `/docs/${slug}`,
        title: `${component.name} · ${meta.componentTitle}`,
        description: component.blurb,
        keywords: [`${component.name} React`, `${component.name} Tailwind CSS`, ...meta.keywords],
        type: "article",
    });
}

export default async function ComponentDocPage({ params }: Props) {
    const { lang, slug } = await params;
    if (!isLocale(lang)) notFound();
    const component = getComponent(lang, slug);
    if (!component) notFound();
    const { docs } = getDictionary(lang);

    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "vaiperui", item: `${SITE_URL}/${lang}` },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${SITE_URL}/${lang}/docs` },
            {
                "@type": "ListItem",
                position: 3,
                name: component.name,
                item: `${SITE_URL}/${lang}/docs/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: static, server-built JSON-LD
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
            />
            <ComponentDoc slug={slug} locale={lang} labels={docs} />
        </>
    );
}
