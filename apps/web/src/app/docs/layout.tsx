import type { ReactNode } from "react";

import { DocsSidebar } from "@/components/DocsSidebar";
import { Nav } from "@/components/Nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Nav />
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[200px_minmax(0,1fr)]">
                <div className="min-w-0 order-1 lg:order-2">{children}</div>
                <div className="order-2 lg:order-1">
                    <DocsSidebar />
                </div>
            </div>
        </>
    );
}
