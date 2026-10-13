import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { alternatesFor, htmlLang, isLocale, localePath, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Layout } from "@/layout/Layout";
import { GITHUB_URL, SITE_NAME, SITE_URL } from "@/lib/site";

import "../globals.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

// Any other first segment is a 404 instead of being treated as a locale.
export const dynamicParams = false;

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    if (!isLocale(lang)) return {};
    const { title, description, keywords } = getDictionary(lang).meta;

    return {
        metadataBase: new URL(SITE_URL),
        title: { default: title, template: `%s · ${SITE_NAME}` },
        description,
        keywords,
        applicationName: SITE_NAME,
        authors: [{ name: "Vaiperlio Tech", url: "https://vaiperliotech.com" }],
        creator: "Vaiperlio Tech",
        publisher: "Vaiperlio Tech",
        category: "technology",
        alternates: alternatesFor(lang, "/"),
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: ogLocale[lang],
            alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
            url: localePath(lang, "/"),
            title,
            description,
        },
        twitter: { card: "summary_large_image", title, description },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const { title, description, keywords } = getDictionary(lang).meta;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: SITE_NAME,
                description,
                inLanguage: locales.map((l) => htmlLang[l]),
            },
            {
                "@type": "SoftwareSourceCode",
                "@id": `${SITE_URL}/#library`,
                name: SITE_NAME,
                headline: title,
                description,
                inLanguage: htmlLang[lang],
                codeRepository: GITHUB_URL,
                programmingLanguage: "TypeScript",
                runtimePlatform: "React",
                license: "https://opensource.org/licenses/MIT",
                keywords: keywords.join(", "),
            },
        ],
    };

    return (
        <html
            lang={htmlLang[lang]}
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static, server-built JSON-LD
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <Layout locale={lang}>{children}</Layout>
            </body>
        </html>
    );
}
