import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDoc } from "@/components/ComponentDoc";
import { components, getComponent } from "@/data/components";

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
        title: `${component.name} · vaiperui`,
        description: component.blurb,
    };
}

export default async function ComponentDocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!getComponent(slug)) notFound();

    return <ComponentDoc slug={slug} />;
}
