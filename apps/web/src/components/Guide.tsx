import Link from "next/link";
import type { ReactNode } from "react";
import { GUIDE_PATHS } from "@/data/guides";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { slugify } from "@/lib/slug";
import { CodeBlock } from "./CodeBlock";
import { TerminalWindow } from "./TerminalWindow";

export function Guide({
    crumb,
    title,
    description,
    children,
}: {
    crumb: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <article>
            <p className="font-mono text-xs text-ink-faint">{crumb}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h1>
            <p className="mt-3 max-w-xl text-ink-dim">{description}</p>
            <div className="mt-10 space-y-14">{children}</div>
        </article>
    );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2
                id={slugify(title)}
                className="scroll-mt-24 font-display text-lg font-semibold text-ink"
            >
                {title}
            </h2>
            <div className="mt-4 space-y-4">{children}</div>
        </section>
    );
}

export function P({ children }: { children: ReactNode }) {
    return <p className="max-w-2xl text-base leading-7 text-ink-dim">{children}</p>;
}

export function Code({ children }: { children: ReactNode }) {
    return (
        <code className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
            {children}
        </code>
    );
}

export function CodePanel({ title, code }: { title: string; code: string }) {
    return (
        <TerminalWindow title={title} bodyClassName="p-4">
            <CodeBlock code={code} />
        </TerminalWindow>
    );
}

export function GuidePagination({ locale, current }: { locale: Locale; current: string }) {
    const dict = getDictionary(locale).docs;
    const guides = GUIDE_PATHS.map((guide) => ({
        href: localePath(locale, guide.href),
        path: guide.href,
        title: dict.guides[guide.key],
    }));
    const index = guides.findIndex((guide) => guide.path === current);
    const prev = index > 0 ? guides[index - 1] : null;
    const next = index !== -1 && index < guides.length - 1 ? guides[index + 1] : null;

    if (!prev && !next) return null;

    return (
        <nav
            aria-label={dict.paginationAria}
            className="flex items-stretch justify-between gap-4 border-t border-line pt-8"
        >
            {prev ? (
                <Link href={prev.href} className="group flex flex-col items-start gap-1">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-ink-faint transition-colors group-hover:text-accent-blue">
                        <span aria-hidden="true">←</span> {dict.previous}
                    </span>
                    <span className="font-display text-sm font-semibold text-ink-dim transition-colors group-hover:text-ink">
                        {prev.title}
                    </span>
                </Link>
            ) : (
                <span />
            )}
            {next ? (
                <Link href={next.href} className="group flex flex-col items-end gap-1 text-right">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-ink-faint transition-colors group-hover:text-accent-blue">
                        {dict.next} <span aria-hidden="true">→</span>
                    </span>
                    <span className="font-display text-sm font-semibold text-ink-dim transition-colors group-hover:text-ink">
                        {next.title}
                    </span>
                </Link>
            ) : (
                <span />
            )}
        </nav>
    );
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <div className="max-w-2xl rounded-lg border border-line bg-bg-2 p-4">
            {title ? <p className="font-mono text-xs text-ink-faint">{title}</p> : null}
            <div className="mt-1.5 text-sm leading-6 text-ink-dim">{children}</div>
        </div>
    );
}
