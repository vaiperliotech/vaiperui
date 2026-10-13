import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";

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
    title: "vaiperui · componentes React prontos pra produção",
    description:
        "Button, Input e Select tipados e acessíveis para Tailwind CSS, com máscara de documento nativa e uma única prop de cor para toda a interface.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="pt-BR"
            className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
