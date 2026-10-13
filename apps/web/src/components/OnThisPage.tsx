"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { id: string; text: string };

// Headings are read from the rendered page (`article h2[id]`), so every docs page gets its
// outline without describing it twice. The active one follows the scroll position.
export function OnThisPage({ title }: { title: string }) {
    const pathname = usePathname();
    const [items, setItems] = useState<Item[]>([]);
    const [active, setActive] = useState("");

    // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the re-scan trigger, the headings come from the DOM
    useEffect(() => {
        const headings = Array.from(
            document.querySelectorAll<HTMLHeadingElement>("article h2[id]"),
        );
        setItems(headings.map((heading) => ({ id: heading.id, text: heading.textContent ?? "" })));
        setActive(headings[0]?.id ?? "");

        const visible = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                }
                // the first heading (in page order) inside the viewport band wins; between two
                // headings the previous one stays active
                const first = headings.find((heading) => visible.has(heading.id));
                if (first) setActive(first.id);
            },
            { rootMargin: "-80px 0px -65% 0px" },
        );
        for (const heading of headings) observer.observe(heading);
        return () => observer.disconnect();
    }, [pathname]);

    if (items.length === 0) return null;

    return (
        <nav aria-label={title} className="lg:sticky lg:top-24">
            <p className="mb-3 font-mono text-xs text-ink-faint">{title}</p>
            <ul className="flex flex-col gap-0.5 border-l border-line">
                {items.map((item) => {
                    const isActive = item.id === active;
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                aria-current={isActive ? "location" : undefined}
                                onClick={() => setActive(item.id)}
                                className={`-ml-px block border-l px-3 py-1.5 text-sm transition-colors ${
                                    isActive
                                        ? "border-accent-blue text-ink"
                                        : "border-transparent text-ink-dim hover:border-line-strong hover:text-ink"
                                }`}
                            >
                                {item.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
