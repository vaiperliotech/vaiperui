"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMPONENT_GROUPS, COMPONENT_NAMES, GUIDE_PATHS } from "@/data/guides";
import { type Locale, localePath, stripLocale } from "@/i18n/config";

export type SidebarLabels = {
    aria: string;
    components: string;
    groups: Record<(typeof COMPONENT_GROUPS)[number]["key"], string>;
    guides: Record<(typeof GUIDE_PATHS)[number]["key"], string>;
};

const linkClass = (isActive: boolean) =>
    `-ml-px block border-l px-3 py-1.5 font-mono text-sm transition-colors ${
        isActive
            ? "border-accent-blue text-ink"
            : "border-transparent text-ink-dim hover:border-line-strong hover:text-ink"
    }`;

export function DocsSidebar({ locale, labels }: { locale: Locale; labels: SidebarLabels }) {
    const pathname = stripLocale(usePathname());

    return (
        <nav aria-label={labels.aria} className="lg:sticky lg:top-24">
            <ul className="flex flex-col gap-0.5 border-l border-line">
                {GUIDE_PATHS.map((guide) => {
                    const isActive = pathname === guide.href;
                    return (
                        <li key={guide.href}>
                            <Link
                                href={localePath(locale, guide.href)}
                                aria-current={isActive ? "page" : undefined}
                                className={linkClass(isActive)}
                            >
                                {labels.guides[guide.key]}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-8 mb-3 font-mono text-xs text-ink-faint">{labels.components}</p>
            {COMPONENT_GROUPS.map((group) => (
                <details key={group.key} open className="group mt-5">
                    <summary className="mb-2 flex cursor-pointer list-none items-center gap-1.5 font-mono text-xs text-ink-faint/70 transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                            className="h-3 w-3 transition-transform group-open:rotate-90"
                        >
                            <path
                                d="M6 3.5 10.5 8 6 12.5"
                                stroke="currentColor"
                                strokeWidth={1.75}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {labels.groups[group.key]}
                    </summary>
                    <ul className="flex flex-col gap-0.5 border-l border-line">
                        {group.slugs.map((slug) => {
                            const isActive = pathname === `/docs/${slug}`;
                            return (
                                <li key={slug}>
                                    <Link
                                        href={localePath(locale, `/docs/${slug}`)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={linkClass(isActive)}
                                    >
                                        {COMPONENT_NAMES[slug]}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </details>
            ))}
        </nav>
    );
}
