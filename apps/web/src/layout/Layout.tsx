import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ locale, children }: { locale: Locale; children: ReactNode }) {
    return (
        <>
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
        </>
    );
}
