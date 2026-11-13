import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";
import { SETUP } from "@/data/setup";
import { htmlLang, isLocale } from "@/i18n/config";
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
        path: "/docs/installation",
        title: dict.docs.guides.installation,
        description: dict.guides.installation.description,
    });
}

export default async function InstallationPage({ params }: Props) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = getDictionary(lang);
    const g = dict.guides.installation;

    return (
        <Guide crumb={g.crumb} title={dict.docs.guides.installation} description={g.description}>
            <Section title={g.install.title}>
                <P>{rich(g.install.body, lang)}</P>
                <CodePanel title="terminal" code={SETUP.install} />
            </Section>

            <Section title={g.requirements.title}>
                <P>{rich(g.requirements.body, lang)}</P>
            </Section>

            <Section title={g.css.title}>
                <P>{g.css.body}</P>
                <CodePanel title="globals.css" code={SETUP.css} />
            </Section>

            <Section title={g.components.title}>
                <P>{g.components.body}</P>
                <CodePanel title="Button.tsx" code={g.components.code} />
            </Section>

            <Section title={g.dark.title}>
                <P>{rich(g.dark.intro, lang)}</P>
                <CodePanel
                    title="app/layout.tsx"
                    code={SETUP.darkHtml.replace('lang="en"', `lang="${htmlLang[lang]}"`)}
                />
                <P>{rich(g.dark.variables, lang)}</P>
                <CodePanel title="globals.css" code={SETUP.darkVariables} />
            </Section>

            <GuidePagination locale={lang} current="/docs/installation" />
        </Guide>
    );
}
