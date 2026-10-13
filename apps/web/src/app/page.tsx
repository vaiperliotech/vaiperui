import Link from "next/link";

import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { CopyInstallButton } from "@/components/CopyInstallButton";
import { GithubIcon } from "@/components/GithubIcon";
import { HeroBuildTerminal } from "@/components/HeroBuildTerminal";
import { HeroTiles } from "@/components/HeroTiles";
import {
    ArrowRightIcon,
    BookIcon,
    DownloadIcon,
    ForkIcon,
    StarIcon,
    TagIcon,
} from "@/components/icons";
import { getGithubStats, getNpmTotalDownloads } from "@/lib/repo-stats";
import { getVaiperUiVersion } from "@/lib/vaiper-version";

const pt = (n: number, one: string, many: string) => (n === 1 ? one : many);

type Stat = {
    value: string;
    label: string;
    icon: typeof DownloadIcon;
};

export default async function Home() {
    const [github, downloads] = await Promise.all([getGithubStats(), getNpmTotalDownloads()]);

    const STATS = [
        downloads !== null && {
            value: downloads.toLocaleString("pt-BR"),
            label: pt(downloads, "download total no npm", "downloads totais no npm"),
            icon: DownloadIcon,
        },
        github && {
            value: github.stars.toLocaleString("pt-BR"),
            label: pt(github.stars, "estrela no GitHub", "estrelas no GitHub"),
            icon: StarIcon,
        },
        github && {
            value: github.forks.toLocaleString("pt-BR"),
            label: pt(github.forks, "fork no GitHub", "forks no GitHub"),
            icon: ForkIcon,
        },
        {
            value: `v${getVaiperUiVersion()}`,
            label: "versão atual no npm",
            icon: TagIcon,
        },
    ].filter((item): item is Stat => Boolean(item));

    return (
        <div data-hero className="relative isolate overflow-hidden border-b border-line bg-bg-1">
            <AmbientBackdrop />
            <HeroTiles />

            <div className="relative mx-auto flex min-h-[84vh] max-w-6xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-12">
                <div className="grid items-center gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-16">
                    <div className="flex min-w-0 flex-col items-center text-center animate-fade-up motion-reduce:animate-none md:items-start md:text-left">
                        <h1
                            data-text="vaiperui"
                            className="hero-title text-balance font-display text-6xl font-semibold tracking-tight text-ink sm:text-7xl lg:text-8xl"
                        >
                            vaiperui
                        </h1>

                        <p className="mt-7 max-w-xl text-pretty text-base text-ink-dim sm:text-lg">
                            Componentes prontos para você, com uma gramática visual que cresce junto
                            com o seu produto.
                        </p>

                        <div className="mt-9 w-full sm:max-w-108">
                            <CopyInstallButton />
                        </div>

                        <Link
                            href="/docs"
                            className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue px-5 py-3 font-mono text-sm font-semibold text-bg-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_1px_2px_rgb(0_0_0/0.4),0_10px_24px_-10px_var(--accent-blue-ring)] transition-[box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#6bb4ff] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_1px_2px_rgb(0_0_0/0.4),0_14px_28px_-10px_var(--accent-blue-ring)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue active:bg-accent-blue active:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(0_0_0/0.4)] motion-safe:animate-float motion-reduce:transition-none sm:w-auto"
                        >
                            <BookIcon className="size-4" />
                            Ver documentação
                            <ArrowRightIcon className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                        </Link>

                        <a
                            href="https://github.com/vaiperliotech/vaiperui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-7 flex items-center gap-1.5 font-mono text-xs text-ink-faint transition-colors hover:text-ink"
                        >
                            <GithubIcon className="size-3.5" />
                            github ↗
                        </a>
                    </div>

                    <div className="flex min-w-0 justify-center animate-fade-up motion-reduce:animate-none [animation-delay:240ms] md:justify-end">
                        <HeroBuildTerminal />
                    </div>
                </div>

                <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line-strong pt-8 sm:mt-20 md:grid-cols-4">
                    {STATS.map((item) => (
                        <div key={item.label} className="flex flex-col-reverse gap-2">
                            <dt className="text-[13px] leading-snug text-ink-faint">
                                {item.label}
                            </dt>
                            <dd className="flex items-center gap-2 tabular-nums text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                                <item.icon className="size-6 shrink-0 text-accent-blue sm:size-7" />
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
