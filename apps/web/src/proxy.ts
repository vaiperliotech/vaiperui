import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

// URLs without a locale prefix open in the language saved by the switcher, or in the default one
// (English). Prefixed URLs (/pt, /es, /en) are never touched, so shared links keep their language.
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const first = pathname.split("/")[1] ?? "";
    if (isLocale(first)) return NextResponse.next();

    const url = request.nextUrl.clone();
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const rest = pathname === "/" ? "" : pathname;

    if (saved && isLocale(saved) && saved !== defaultLocale) {
        url.pathname = `/${saved}${rest}`;
        return NextResponse.redirect(url);
    }

    url.pathname = `/${defaultLocale}${rest}`;
    return NextResponse.rewrite(url);
}

export const config = {
    // Skips Next internals, API routes and anything with a file extension (favicon.ico, sitemap.xml...)
    matcher: ["/((?!_next|api|.*\\..*).*)"],
};
