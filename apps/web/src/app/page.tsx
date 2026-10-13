import Link from "next/link";

import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { CopyInstallButton } from "@/components/CopyInstallButton";
import { GithubIcon } from "@/components/GithubIcon";
import { HeroBuildTerminal } from "@/components/HeroBuildTerminal";
import { HeroTiles } from "@/components/HeroTiles";
import { DownloadIcon, ForkIcon, StarIcon, TagIcon } from "@/components/icons";
import { Nav } from "@/components/Nav";
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
            <Nav />

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
                            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-accent-blue px-4 py-2.5 font-mono text-sm font-medium text-bg-0 transition-colors duration-150 hover:bg-accent-blue/90 sm:w-auto"
                        >
                            Ver documentação
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
