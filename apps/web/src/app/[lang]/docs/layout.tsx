import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DocsSidebar } from "@/components/DocsSidebar";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function DocsLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const { docs } = getDictionary(lang);

    return (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[200px_minmax(0,1fr)]">
            <div className="min-w-0 order-1 lg:order-2">{children}</div>
            <div className="order-2 lg:order-1">
                <DocsSidebar
                    locale={lang}
                    labels={{
                        aria: docs.sidebarAria,
                        components: docs.components,
                        guides: docs.guides,
                    }}
                />
            </div>
        </div>
    );
}
