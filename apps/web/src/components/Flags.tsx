import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";

// Drawn flags instead of emoji: regional-indicator emoji render as plain letters on Windows.
const flags: Record<Locale, ReactNode> = {
    // English -> United States (simplified: 7 stripes, canton without individual stars)
    en: (
        <>
            <rect width="20" height="14" fill="#fff" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <rect key={i} y={i * 2.154} width="20" height="1.077" fill="#b22234" />
            ))}
            <rect width="9" height="7.54" fill="#3c3b6e" />
            {[2, 4.5, 7].flatMap((x) =>
                [1.8, 3.8, 5.8].map((y) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="0.45" fill="#fff" />
                )),
            )}
        </>
    ),
    // Portuguese -> Brazil
    pt: (
        <>
            <rect width="20" height="14" fill="#009b3a" />
            <path d="M10 1.4 18.2 7 10 12.6 1.8 7Z" fill="#fedf00" />
            <circle cx="10" cy="7" r="3.2" fill="#002776" />
            <path d="M6.9 6.4c2.1-.5 4.3-.2 6.2 1" stroke="#fff" strokeWidth=".5" fill="none" />
        </>
    ),
    // Spanish -> Spain
    es: (
        <>
            <rect width="20" height="14" fill="#aa151b" />
            <rect y="3.5" width="20" height="7" fill="#f1bf00" />
        </>
    ),
};

export function FlagIcon({ locale, className = "" }: { locale: Locale; className?: string }) {
    return (
        <svg
            viewBox="0 0 20 14"
            aria-hidden="true"
            className={`overflow-hidden rounded-[2px] ${className}`}
        >
            {flags[locale]}
        </svg>
    );
}
