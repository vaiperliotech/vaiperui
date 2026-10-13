import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ locale, children }: { locale: Locale; children: ReactNode }) {
    return (
        // `data-window` is the "window" the header's traffic lights close, minimize and restore
        <div data-window className="flex flex-1 flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
        </div>
    );
}
