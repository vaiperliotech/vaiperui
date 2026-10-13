"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#4da3ff", "#a78bfa", "#28c840", "#febc2e", "#ff5f57", "#eef2fb"];

type Piece = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    spin: number;
    angle: number;
    color: string;
};

// A short burst of confetti over its (relatively positioned) parent. Skipped under reduced motion.
export function Confetti({ run }: { run: boolean }) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const element = canvas.current;
        const ctx = element?.getContext("2d");
        if (!run || !element || !ctx) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ratio = window.devicePixelRatio || 1;
        const width = element.clientWidth;
        const height = element.clientHeight;
        element.width = width * ratio;
        element.height = height * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        // two cannons at the bottom corners, aimed at the middle
        const pieces: Piece[] = Array.from({ length: 150 }, (_, index) => {
            const left = index % 2 === 0;
            const power = 9 + Math.random() * 9;
            const aim = (Math.PI / 180) * (50 + Math.random() * 25);
            return {
                x: left ? 0 : width,
                y: height * 0.92,
                vx: Math.cos(aim) * power * (left ? 1 : -1),
                vy: -Math.sin(aim) * power,
                size: 5 + Math.random() * 6,
                spin: (Math.random() - 0.5) * 0.4,
                angle: Math.random() * Math.PI,
                color: COLORS[index % COLORS.length] ?? "#fff",
            };
        });

        let raf = 0;
        const start = performance.now();
        const frame = (now: number) => {
            const elapsed = now - start;
            ctx.clearRect(0, 0, width, height);
            for (const piece of pieces) {
                piece.vy += 0.32;
                piece.vx *= 0.992;
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.angle += piece.spin;
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - Math.max(0, elapsed - 2200) / 1000);
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.angle);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
                ctx.restore();
            }
            if (elapsed < 3200) raf = requestAnimationFrame(frame);
            else ctx.clearRect(0, 0, width, height);
        };
        raf = requestAnimationFrame(frame);
        return () => {
            cancelAnimationFrame(raf);
            ctx.clearRect(0, 0, width, height);
        };
    }, [run]);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <canvas ref={canvas} className="size-full" />
        </div>
    );
}
