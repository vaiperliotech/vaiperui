import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import {
    GITHUB_URL,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/site";

import "./globals.css";

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

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: "Vaiperlio Tech", url: "https://vaiperliotech.com" }],
    creator: "Vaiperlio Tech",
    publisher: "Vaiperlio Tech",
    category: "technology",
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "pt_BR",
        url: "/",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
    twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            inLanguage: "pt-BR",
        },
        {
            "@type": "SoftwareSourceCode",
            "@id": `${SITE_URL}/#library`,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            codeRepository: GITHUB_URL,
            programmingLanguage: "TypeScript",
            runtimePlatform: "React",
            license: "https://opensource.org/licenses/MIT",
            keywords: SITE_KEYWORDS.join(", "),
        },
    ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="pt-BR"
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static, server-built JSON-LD
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
