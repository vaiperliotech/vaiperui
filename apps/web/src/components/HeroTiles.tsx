"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do hero: campo de tiles 3D que "levantam" sob o cursor (Canvas 2D,
 * projeção pseudo-3D). A tela é preenchida por quadrados lado a lado; a face
 * frontal é a mesma cor do fundo (invisível). Quando o mouse passa, os tiles
 * próximos sobem e revelam as laterais nas duas cores de marca do vaiperui
 * (azul + violeta), lendo como um relevo 3D tátil.
 *
 * - ~centenas de tiles, desenhados como cubos extrudados (face frontal + topo
 *   implícito) com offset top-direito; ordenados para sobrepor corretamente.
 * - Suave: easing exponencial no "levantamento", pausa fora da viewport / aba
 *   oculta, DPR capado, prefers-reduced-motion → tudo invisível/estático.
 * - Sem cursor de precisão (touch/coarse) → efeito todo desligado: um toque
 *   não tem "leave" para resetar o estado, então ficaria com tiles grudados.
 * - Defesa extra: sem pointermove por IDLE_MS, o cursor é tratado como
 *   ausente mesmo sem um "leave" explícito (mouse parado, foco perdido para
 *   devtools, notebook híbrido com tela touch) — nunca fica raised para sempre.
 * - Também alimenta `--mx`/`--my` no [data-hero] mais próximo (sheen do título).
 * - Decorativo → aria-hidden; nada essencial vive aqui.
 */

const CELL = 54; // tamanho do tile (juntos uns aos outros)
const RAISE = 30; // altura máxima do levantamento
const RADIUS = 180; // raio de influência do cursor
const IDLE_MS = 300; // sem pointermove por esse tempo → considera o cursor parado/ausente

// O canvas não enxerga as custom properties do CSS — cores literais da marca.
const BLUE = [77, 163, 255]; // --accent-blue
const VIOLET = [139, 115, 240]; // --accent-purple (profundo p/ dar luz/sombra)

interface Tile {
    bx: number;
    by: number;
    l: number;
}

export function HeroTiles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const root = canvas.closest<HTMLElement>("[data-hero]");

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Hover-driven parallax has no touch equivalent — worse, a touch device fires
        // "pointermove" on tap/scroll but never "mouseleave", so mouse.active gets
        // stuck true and the raised tiles freeze wherever the finger last was.
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const interactive = !reduced && canHover;

        let width = 0;
        let height = 0;
        let dpr = 1;
        let running = false;
        let raf = 0;
        const mouse = { x: -9999, y: -9999, active: false };
        let lastMoveAt = 0;
        let tiles: Tile[] = [];

        const rebuild = () => {
            const rect = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.floor(rect.width);
            height = Math.floor(rect.height);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cols = Math.ceil(width / CELL);
            const rows = Math.ceil(height / CELL);
            tiles = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    tiles.push({
                        bx: c * CELL + CELL / 2,
                        by: r * CELL + CELL / 2,
                        l: 0,
                    });
                }
            }
            // ordem de desenho: tiles "mais perto da câmera" (direita/baixo) depois
            tiles.sort((a, b) => a.by + a.bx - (b.by + b.bx));
        };

        const ease = (a: number, b: number, k: number) => a + (b - a) * k;

        const step = () => {
            if (mouse.active && performance.now() - lastMoveAt > IDLE_MS) {
                mouse.active = false;
            }
            const r2 = RADIUS * RADIUS;
            for (const t of tiles) {
                const dx = t.bx - mouse.x;
                const dy = t.by - mouse.y;
                const d2 = dx * dx + dy * dy;
                let target = 0;
                if (mouse.active && d2 < r2) {
                    const d = Math.sqrt(d2) || 1;
                    const f = 1 - d / RADIUS;
                    target = f * f; // atenua com o quadrado da distância
                }
                t.l = ease(t.l, target, 0.16);
            }
        };

        const drawPoly = (pts: number[][], fill: string) => {
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.moveTo(pts[0]?.[0] ?? 0, pts[0]?.[1] ?? 0);
            for (let i = 1; i < pts.length; i++) {
                const p = pts[i];
                if (p) ctx.lineTo(p[0] ?? 0, p[1] ?? 0);
            }
            ctx.closePath();
            ctx.fill();
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            const half = CELL / 2;
            for (const t of tiles) {
                const raise = t.l * RAISE;
                if (raise < 0.6) continue; // face plana = cor do fundo, invisível

                const x = t.bx;
                const y = t.by;
                const x0 = x - half;
                const y0 = y - half;
                const x1 = x + half;
                const y1 = y + half;
                const dep = raise * 0.5; // profundidade das laterais

                // TOPO fica transparente (mesma cor do fundo) — só as laterais aparecem
                // lateral frontal (baixo) — azul de marca
                drawPoly(
                    [
                        [x0, y1],
                        [x1, y1],
                        [x1, y1 + dep],
                        [x0, y1 + dep],
                    ],
                    `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},0.9)`,
                );
                // lateral direita (violeta, um pouco mais profunda — luz/sombra)
                drawPoly(
                    [
                        [x1, y0],
                        [x1, y1],
                        [x1 + dep, y1],
                        [x1 + dep, y0],
                    ],
                    `rgba(${VIOLET[0]},${VIOLET[1]},${VIOLET[2]},0.95)`,
                );
            }
        };

        const loop = () => {
            if (!running) return;
            step();
            draw();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (running) return;
            running = true;
            loop();
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
            mouse.active = false;
        };

        rebuild();
        if (interactive) start();

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) start();
                else stop();
            },
            { rootMargin: "120px" },
        );
        io.observe(canvas);

        const onVisibility = () => {
            if (document.hidden) stop();
            else if (interactive) start();
        };
        document.addEventListener("visibilitychange", onVisibility);

        let resizeTimer: number;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                rebuild();
                if (reduced) draw();
            }, 200);
        };
        window.addEventListener("resize", onResize);

        let rafMove = 0;
        const onMove = (e: PointerEvent) => {
            if (rafMove) return;
            rafMove = requestAnimationFrame(() => {
                rafMove = 0;
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
                mouse.active = true;
                lastMoveAt = performance.now();
                root?.style.setProperty("--mx", String(mouse.x / width));
                root?.style.setProperty("--my", String(mouse.y / height));
            });
        };
        const onLeave = () => {
            mouse.active = false;
        };
        if (interactive) {
            window.addEventListener("pointermove", onMove, { passive: true });
            document.addEventListener("mouseleave", onLeave);
        }

        return () => {
            stop();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("resize", onResize);
            if (interactive) {
                window.removeEventListener("pointermove", onMove);
                document.removeEventListener("mouseleave", onLeave);
            }
            clearTimeout(resizeTimer);
            if (rafMove) cancelAnimationFrame(rafMove);
        };
    }, []);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <canvas ref={canvasRef} className="h-full w-full" />
        </div>
    );
}
