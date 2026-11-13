import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout, Code, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";
import { AI } from "@/data/ai";
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
        path: "/docs/ai",
        title: dict.docs.guides.ai,
        description: dict.guides.ai.description,
    });
}

export default async function AiPage({ params }: Props) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = getDictionary(lang);
    const g = dict.guides.ai;
    const withUrl = (text: string) => text.replaceAll("{url}", AI.mcpUrl);

    return (
        <Guide crumb={g.crumb} title={dict.docs.guides.ai} description={g.description}>
            <Section title={g.what.title}>
                <P>{rich(g.what.body, lang)}</P>
            </Section>

            <Section title={g.plugin.title}>
                <P>{rich(g.plugin.body, lang)}</P>
                <CodePanel title="claude code" code={AI.plugin} />
                <P>{rich(g.plugin.after, lang)}</P>
            </Section>

            <Section title={g.mcp.title}>
                <P>{rich(g.mcp.body, lang)}</P>
                <CodePanel title="terminal" code={AI.claudeCode} />
                <P>{rich(withUrl(g.mcp.clients), lang)}</P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel title=".cursor/mcp.json" code={AI.cursor} />
                    <CodePanel title=".vscode/mcp.json" code={AI.vscode} />
                </div>
                <P>{rich(withUrl(g.mcp.browser), lang)}</P>
            </Section>

            <Section title={g.tools.title}>
                <P>{rich(g.tools.body, lang)}</P>
                <ul className="max-w-2xl space-y-3 text-[18px] leading-8 text-ink-dim">
                    {g.tools.items.map((tool) => (
                        <li key={tool.name}>
                            <Code>{tool.name}</Code>: {tool.text}
                        </li>
                    ))}
                </ul>
                <P>{rich(g.tools.resources, lang)}</P>
            </Section>

            <Section title={g.skill.title}>
                <P>{rich(g.skill.body, lang)}</P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel title="terminal" code={AI.skillProject} />
                    <CodePanel title="terminal" code={AI.skillGlobal} />
                </div>
                <P>{rich(g.skill.after, lang)}</P>
            </Section>

            <Section title={g.prompts.title}>
                <P>{g.prompts.body}</P>
                <ul className="max-w-2xl list-disc space-y-3 pl-5 text-[18px] leading-8 text-ink-dim marker:text-ink-faint">
                    {g.prompts.items.map((prompt) => (
                        <li key={prompt}>{prompt}</li>
                    ))}
                </ul>
            </Section>

            <Section title={g.trust.title}>
                <Callout>{g.trust.body}</Callout>
            </Section>

            <GuidePagination locale={lang} current="/docs/ai" />
        </Guide>
    );
}
