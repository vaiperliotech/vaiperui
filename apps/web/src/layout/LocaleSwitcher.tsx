"use client";

import { usePathname, useRouter } from "next/navigation";
import { Select } from "vaiperui";

import { FlagIcon } from "@/components/Flags";
import {
    isLocale,
    LOCALE_COOKIE,
    LOCALE_COOKIE_MAX_AGE,
    type Locale,
    localeNames,
    localePath,
    locales,
    stripLocale,
} from "@/i18n/config";

const options = locales.map((locale) => ({
    value: locale,
    label: localeNames[locale],
    leading: <FlagIcon locale={locale} className="h-3.5 w-5" />,
}));

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        // `dark` re-themes the (portaled) menu, which would otherwise render with the light tokens
        <div className="dark">
            <Select
                aria-label={label}
                size="sm"
                customColor="var(--accent-blue)"
                value={locale}
                options={options}
                className="min-w-40"
                onValueChange={(next) => {
                    if (!isLocale(next)) return;
                    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in every browser
                    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
                    router.push(localePath(next, stripLocale(pathname)));
                }}
            />
        </div>
    );
}
