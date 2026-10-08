import Link from "next/link";

import { getVaiperUiVersion } from "@/lib/vaiper-version";

import { GithubIcon } from "./GithubIcon";

export function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                <p className="font-mono text-xs text-ink-faint">
                    vaiperui · v{getVaiperUiVersion()} · MIT ·{" "}
                    <a
                        href="https://vaiperliotech.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-dim hover:text-ink"
                    >
                        Vaiperlio Tech
                    </a>
                </p>
                <div className="flex items-center gap-5 font-mono text-xs text-ink-dim">
                    <Link href="/docs" className="hover:text-ink">
                        docs
                    </Link>
                    <a
                        href="https://www.npmjs.com/package/vaiperui"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink"
                    >
                        npm
                    </a>
                    <a
                        href="https://github.com/vaiperliotech/vaiperui"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-ink"
                    >
                        <GithubIcon className="size-3.5" />
                        github
                    </a>
                </div>
            </div>
        </footer>
    );
}
