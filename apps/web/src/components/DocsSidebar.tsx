"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { components } from "@/data/components";

const GUIDES = [
    { href: "/docs", label: "Introdução" },
    { href: "/docs/instalacao", label: "Instalação" },
    { href: "/docs/comecando", label: "Começando" },
];

export function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav aria-label="Documentação" className="lg:sticky lg:top-24">
            <ul className="flex flex-col gap-0.5 border-l border-line">
                {GUIDES.map((guide) => {
                    const isActive = pathname === guide.href;
                    return (
                        <li key={guide.href}>
                            <Link
                                href={guide.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`-ml-px block border-l px-3 py-1.5 font-mono text-sm transition-colors ${
                                    isActive
                                        ? "border-accent-blue text-ink"
                                        : "border-transparent text-ink-dim hover:border-line-strong hover:text-ink"
                                }`}
                            >
                                {guide.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-8 mb-3 font-mono text-xs text-ink-faint">componentes</p>
            <ul className="flex flex-col gap-0.5 border-l border-line">
                {components.map((component) => {
                    const isActive = pathname === `/docs/${component.slug}`;
                    return (
                        <li key={component.slug}>
                            <Link
                                href={`/docs/${component.slug}`}
                                aria-current={isActive ? "page" : undefined}
                                className={`-ml-px block border-l px-3 py-1.5 font-mono text-sm transition-colors ${
                                    isActive
                                        ? "border-accent-blue text-ink"
                                        : "border-transparent text-ink-dim hover:border-line-strong hover:text-ink"
                                }`}
                            >
                                {component.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
