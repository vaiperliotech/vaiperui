import Link from "next/link";

import { GithubIcon } from "@/components/GithubIcon";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { GITHUB_URL } from "@/lib/site";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SearchDialog } from "./SearchDialog";

export function Header({ locale }: { locale: Locale }) {
    const dict = getDictionary(locale).header;

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-bg-1/90 backdrop-blur-md">
            <div className="relative flex items-center justify-between px-4 py-2.5 sm:px-6">
                <span className="hidden gap-1.5 sm:flex">
                    <span className="size-2.5 rounded-full bg-mac-red" />
                    <span className="size-2.5 rounded-full bg-mac-yellow" />
                    <span className="size-2.5 rounded-full bg-mac-green" />
                </span>
                <Link
                    href={localePath(locale, "/")}
                    className="font-display text-base font-semibold tracking-tight text-ink sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                >
                    vaiper<span className="text-accent-blue">ui</span>
                </Link>
                <div className="flex items-center gap-4">
                    <SearchDialog locale={locale} labels={getDictionary(locale).search} />
                    <LocaleSwitcher locale={locale} label={dict.languageLabel} />
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-dim transition-colors hover:text-ink"
                        aria-label={dict.githubLabel}
                    >
                        <GithubIcon className="size-5" />
                    </a>
                </div>
            </div>
        </header>
    );
}
