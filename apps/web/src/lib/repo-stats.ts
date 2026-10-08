const GITHUB_REPO = "vaiperliotech/vaiperui";
const NPM_PACKAGE = "vaiperui";
const REVALIDATE_SECONDS = 3600;

interface GithubStats {
    stars: number;
    forks: number;
}

export async function getGithubStats(): Promise<GithubStats | null> {
    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
            headers: { Accept: "application/vnd.github+json" },
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return { stars: data.stargazers_count, forks: data.forks_count };
    } catch {
        return null;
    }
}

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

// A janela do endpoint /downloads/range é limitada a ~18 meses por chamada,
// então soma em blocos quando o pacote for mais velho que isso.
const MAX_RANGE_DAYS = 540;

async function getNpmFirstPublishDate(): Promise<Date | null> {
    try {
        const res = await fetch(`https://registry.npmjs.org/${NPM_PACKAGE}`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const created = data.time?.created;
        return created ? new Date(created) : null;
    } catch {
        return null;
    }
}

export async function getNpmTotalDownloads(): Promise<number | null> {
    const start = await getNpmFirstPublishDate();
    if (!start) return null;

    const end = new Date();
    let total = 0;
    let chunkStart = start;

    while (chunkStart <= end) {
        const chunkEnd = new Date(
            Math.min(end.getTime(), chunkStart.getTime() + MAX_RANGE_DAYS * 86_400_000),
        );
        try {
            const res = await fetch(
                `https://api.npmjs.org/downloads/range/${fmtDate(chunkStart)}:${fmtDate(chunkEnd)}/${NPM_PACKAGE}`,
                { next: { revalidate: REVALIDATE_SECONDS } },
            );
            if (!res.ok) return null;
            const data = await res.json();
            for (const day of data.downloads ?? []) total += day.downloads;
        } catch {
            return null;
        }
        chunkStart = new Date(chunkEnd.getTime() + 86_400_000);
    }

    return total;
}
