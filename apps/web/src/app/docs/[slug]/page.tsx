import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDoc } from "@/components/ComponentDoc";
import { components, getComponent } from "@/data/components";
import { SITE_KEYWORDS, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
    return components.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const component = getComponent(slug);
    if (!component) return {};
    return {
        title: `${component.name} · componente React`,
        description: component.blurb,
        keywords: [`${component.name} React`, `${component.name} Tailwind CSS`, ...SITE_KEYWORDS],
        alternates: { canonical: `/docs/${slug}` },
        openGraph: {
            type: "article",
            url: `/docs/${slug}`,
            title: `${component.name} · componente React · vaiperui`,
            description: component.blurb,
        },
    };
}

export default async function ComponentDocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!getComponent(slug)) notFound();

    const component = getComponent(slug);
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "vaiperui", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Docs", item: `${SITE_URL}/docs` },
            {
                "@type": "ListItem",
                position: 3,
                name: component?.name,
                item: `${SITE_URL}/docs/${slug}`,
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
            <ComponentDoc slug={slug} />
        </>
    );
}
