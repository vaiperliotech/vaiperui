"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { MoonIcon, SunIcon } from "@/components/icons";
import { TerminalWindow } from "@/components/TerminalWindow";
import { getComponent } from "@/data/components";
import { getVariations } from "@/data/variations";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { slugify } from "@/lib/slug";

type DocsLabels = Dictionary["docs"];

function ThemeToggle({
    dark,
    onToggle,
    labels,
}: {
    dark: boolean;
    onToggle: () => void;
    labels: DocsLabels;
}) {
    const label = dark ? labels.themeToLight : labels.themeToDark;
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={label}
            aria-pressed={dark}
            title={label}
            className="flex size-7 items-center justify-center rounded-md border border-line-strong bg-bg-0 text-ink-faint transition-colors hover:border-accent-blue hover:text-ink"
        >
            {dark ? <SunIcon className="size-3.5" /> : <MoonIcon className="size-3.5" />}
        </button>
    );
}

function PreviewWindow({
    children,
    labels,
    contentClassName = "",
}: {
    children: ReactNode;
    labels: DocsLabels;
    contentClassName?: string;
}) {
    const [dark, setDark] = useState(false);

    return (
        <TerminalWindow
            title="preview"
            bodyClassName="p-0"
            actions={
                <ThemeToggle
                    dark={dark}
                    onToggle={() => setDark((value) => !value)}
                    labels={labels}
                />
            }
        >
            <div className={dark ? "dark" : ""}>
                <div
                    className={`flex flex-wrap items-center justify-center p-6 ${
                        dark ? "bg-neutral-950" : "bg-white"
                    } ${contentClassName}`}
                >
                    {children}
                </div>
            </div>
        </TerminalWindow>
    );
}

export function ComponentDoc({
    slug,
    locale,
    labels,
}: {
    slug: string;
    locale: Locale;
    labels: DocsLabels;
}) {
    const component = getComponent(locale, slug);
    if (!component) return null;

    const gallery = getVariations(locale)[slug] ?? [];

    return (
        <article>
            <p className="font-mono text-xs text-ink-faint">
                {labels.components} / {component.slug}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{component.name}</h1>
            <p className="mt-3 max-w-xl text-ink-dim">{component.blurb}</p>

            <section className="mt-10">
                <h2
                    id={slugify(labels.howToUse)}
                    className="scroll-mt-24 font-display text-lg font-semibold text-ink"
                >
                    {labels.howToUse}
                </h2>
                <p className="mt-3 max-w-2xl text-ink-dim">{component.usage}</p>
                <div className="mt-5 space-y-4">
                    <PreviewWindow labels={labels} contentClassName="min-h-40 gap-4">
                        {component.demo}
                    </PreviewWindow>
                    <TerminalWindow title={`${component.name}.tsx`} bodyClassName="p-4">
                        <CodeBlock code={component.code} />
                    </TerminalWindow>
                </div>
            </section>

            {gallery.map((group) => (
                <section key={group.title} className="mt-16">
                    <h2
                        id={slugify(group.title)}
                        className="scroll-mt-24 font-display text-lg font-semibold text-ink"
                    >
                        {group.title}
                    </h2>
                    {group.description ? (
                        <p className="mt-2 max-w-2xl text-ink-dim">{group.description}</p>
                    ) : null}
                    <div className="mt-5 space-y-4">
                        <PreviewWindow labels={labels} contentClassName="gap-x-8 gap-y-6">
                            {group.items.map((item) => (
                                <figure
                                    key={item.label}
                                    className="flex flex-col items-center gap-2.5"
                                >
                                    <div className="flex min-h-12 items-center justify-center">
                                        {item.node}
                                    </div>
                                    <figcaption className="font-mono text-xs text-ink-faint">
                                        {item.label}
                                    </figcaption>
                                </figure>
                            ))}
                        </PreviewWindow>
                        <TerminalWindow title={group.file} bodyClassName="p-4">
                            <CodeBlock code={group.code} />
                        </TerminalWindow>
                    </div>
                </section>
            ))}

            <h2
                id={slugify(labels.props)}
                className="mt-16 scroll-mt-24 font-display text-lg font-semibold text-ink"
            >
                {labels.props}
            </h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-160 border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-line bg-bg-2 text-left font-mono text-xs text-ink-faint">
                            <th className="px-4 py-2.5 font-medium">{labels.propsCols.prop}</th>
                            <th className="px-4 py-2.5 font-medium">{labels.propsCols.values}</th>
                            <th className="px-4 py-2.5 font-medium">{labels.propsCols.default}</th>
                            <th className="px-4 py-2.5 font-medium">
                                {labels.propsCols.description}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {component.props.map((row) => (
                            <tr
                                id={`prop-${slugify(row.prop)}`}
                                key={row.prop}
                                className="scroll-mt-24 border-b border-line last:border-0"
                            >
                                <td className="px-4 py-3 align-top font-mono text-xs text-accent-blue">
                                    {row.prop}
                                </td>
                                <td className="px-4 py-3 align-top font-mono text-xs text-ink-dim">
                                    {row.values}
                                </td>
                                <td className="px-4 py-3 align-top font-mono text-xs text-ink-dim">
                                    {row.defaultValue}
                                </td>
                                <td className="px-4 py-3 align-top text-ink-dim">
                                    {row.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
