"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMPONENT_NAMES, GUIDE_PATHS } from "@/data/guides";
import { type Locale, localePath, stripLocale } from "@/i18n/config";

export type SidebarLabels = {
    aria: string;
    components: string;
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
            <ul className="flex flex-col gap-0.5 border-l border-line">
                {Object.entries(COMPONENT_NAMES).map(([slug, name]) => {
                    const isActive = pathname === `/docs/${slug}`;
                    return (
                        <li key={slug}>
                            <Link
                                href={localePath(locale, `/docs/${slug}`)}
                                aria-current={isActive ? "page" : undefined}
                                className={linkClass(isActive)}
                            >
                                {name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
