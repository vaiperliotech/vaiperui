import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}
