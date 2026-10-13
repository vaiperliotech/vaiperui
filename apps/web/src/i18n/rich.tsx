import Link from "next/link";
import type { ReactNode } from "react";

import { Code } from "@/components/Guide";
import { type Locale, localePath } from "./config";

/**
 * Renders dictionary strings with inline markup: `<c>code</c>` becomes a <Code> and
 * `<link:slug>text</link>` becomes a locale-aware link to `/docs/slug`.
 */
export function rich(text: string, locale: Locale): ReactNode[] {
    return text.split(/(<c>.*?<\/c>|<link:[a-z]+>.*?<\/link>)/g).map((part, index) => {
        const key = `${index}-${part}`;
        const code = part.match(/^<c>(.*)<\/c>$/);
        if (code) return <Code key={key}>{code[1]}</Code>;
        const link = part.match(/^<link:([a-z]+)>(.*)<\/link>$/);
        if (link) {
            return (
                <Link
                    key={key}
                    href={localePath(locale, `/docs/${link[1]}`)}
                    className="text-accent-blue hover:text-ink"
                >
                    {link[2]}
                </Link>
            );
        }
        return part;
    });
}
