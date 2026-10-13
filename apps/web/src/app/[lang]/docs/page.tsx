import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { rich } from "@/i18n/rich";
import { pageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    if (!isLocale(lang)) return {};
    const dict = getDictionary(lang);
    return pageMetadata({
        lang,
        path: "/docs",
        title: dict.docs.guides.intro,
        description: dict.guides.intro.description,
    });
}

export default async function DocsIndexPage({ params }: Props) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = getDictionary(lang);
    const g = dict.guides.intro;

    return (
        <Guide crumb={g.crumb} title={dict.docs.guides.intro} description={g.description}>
            <Section title={g.whatIs.title}>
                <P>{rich(g.whatIs.body, lang)}</P>
            </Section>

            <Section title={g.startHere.title}>
                <P>{g.startHere.body}</P>
                <CodePanel title="terminal" code={`npm install vaiperui`} />
            </Section>

            <Section title={g.components.title}>
                <P>{rich(g.components.body, lang)}</P>
            </Section>

            <GuidePagination locale={lang} current="/docs" />
        </Guide>
    );
}
