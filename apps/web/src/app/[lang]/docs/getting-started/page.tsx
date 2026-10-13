import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Callout, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";
import { ButtonDemo, ButtonVariants, InputDemo } from "@/components/GuideDemos";
import { TerminalWindow } from "@/components/TerminalWindow";
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
        path: "/docs/getting-started",
        title: dict.docs.guides.gettingStarted,
        description: dict.guides.gettingStarted.description,
    });
}

const previewClass = "flex min-h-40 items-center justify-center bg-bg-1 p-6";

export default async function GettingStartedPage({ params }: Props) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = getDictionary(lang);
    const g = dict.guides.gettingStarted;

    return (
        <Guide crumb={g.crumb} title={dict.docs.guides.gettingStarted} description={g.description}>
            <Section title={g.first.title}>
                <P>{rich(g.first.body, lang)}</P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel title="Button.tsx" code={g.first.code} />
                    <TerminalWindow title="preview" bodyClassName={previewClass}>
                        <ButtonDemo label={g.first.demoLabel} />
                    </TerminalWindow>
                </div>
            </Section>

            <Section title={g.variants.title}>
                <P>{rich(g.variants.body, lang)}</P>
                <CodePanel
                    title="variants.tsx"
                    code={`<Button variantColor="success" radius="full">
  ${g.variants.confirm}
</Button>
<Button variant="outlined" variantColor="warning">
  ${g.variants.review}
</Button>
<Button variantColor="danger" hover="lift">
  ${g.variants.remove}
</Button>`}
                />
                <ButtonVariants
                    confirm={g.variants.confirm}
                    review={g.variants.review}
                    remove={g.variants.remove}
                />
            </Section>

            <Section title={g.masks.title}>
                <P>{rich(g.masks.body, lang)}</P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel
                        title="Input.tsx"
                        code={`import { Input } from "vaiperui";

export function ${g.masks.component}() {
  return <Input label="${g.masks.label}" mask="${g.masks.mask}" />;
}`}
                    />
                    <TerminalWindow title="preview" bodyClassName={previewClass}>
                        <InputDemo label={g.masks.label} mask={g.masks.mask as "cpf" | "phone"} />
                    </TerminalWindow>
                </div>
            </Section>

            <Section title={g.next.title}>
                <Callout title={g.next.callout}>{rich(g.next.body, lang)}</Callout>
            </Section>

            <GuidePagination locale={lang} current="/docs/getting-started" />
        </Guide>
    );
}
