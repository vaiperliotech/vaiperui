import { isLocale, locales } from "@/i18n/config";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

// Fetched by the search dialog the first time it opens.
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    if (!isLocale(lang)) return new Response("Not found", { status: 404 });
    return Response.json(buildSearchIndex(lang));
}
