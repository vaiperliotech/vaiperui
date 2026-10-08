import Link from "next/link";
import { GithubIcon } from "./GithubIcon";

export function Nav() {
    return (
        <header className="sticky top-0 z-40 border-b border-line bg-bg-1/90 backdrop-blur-md">
            <div className="relative flex items-center justify-between px-4 py-2.5 sm:px-6">
                <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-mac-red" />
                    <span className="size-2.5 rounded-full bg-mac-yellow" />
                    <span className="size-2.5 rounded-full bg-mac-green" />
                </span>
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 font-display text-base font-semibold tracking-tight text-ink"
                >
                    vaiper<span className="text-accent-blue">ui</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/docs"
                        className="font-mono text-sm text-ink-dim transition-colors hover:text-ink"
                    >
                        docs
                    </Link>
                    <a
                        href="https://github.com/vaiperliotech/vaiperui"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-dim transition-colors hover:text-ink"
                        aria-label="Repositório no GitHub"
                    >
                        <GithubIcon className="size-5" />
                    </a>
                </div>
            </div>
        </header>
    );
}
