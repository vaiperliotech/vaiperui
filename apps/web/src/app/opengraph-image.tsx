import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = "vaiperui · Biblioteca de componentes React com Tailwind CSS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 80,
                background: "linear-gradient(135deg, #05070d 0%, #111726 60%, #2a1f4d 100%)",
                color: "#eef2fb",
            }}
        >
            <div style={{ fontSize: 108, fontWeight: 700, color: "#a78bfa" }}>{SITE_NAME}</div>
            <div style={{ fontSize: 48, marginTop: 24, lineHeight: 1.25 }}>
                Componentes React prontos pra produção
            </div>
            <div style={{ fontSize: 30, marginTop: 36, color: "#9aa6c2" }}>
                Tailwind CSS · Máscaras · customColor · Acessível · TypeScript
            </div>
        </div>,
        size,
    );
}
