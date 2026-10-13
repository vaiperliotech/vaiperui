"use client";

import { type ReactNode, useEffect, useRef } from "react";

export type WindowLabels = { close: string; minimize: string; zoom: string };

export type AppWindowProps = {
    title: string;
    labels: WindowLabels;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    focused: boolean;
    zoomed: boolean;
    minimized: boolean;
    onFocus: () => void;
    onMove: (x: number, y: number) => void;
    onClose: () => void;
    onMinimize: () => void;
    onZoom: () => void;
    children: ReactNode;
};

const MENU_BAR = 28;

// A draggable window with its own traffic lights: the same three buttons as the page's header.
export function AppWindow({
    title,
    labels,
    x,
    y,
    z,
    width,
    height,
    focused,
    zoomed,
    minimized,
    onFocus,
    onMove,
    onClose,
    onMinimize,
    onZoom,
    children,
}: AppWindowProps) {
    const drag = useRef<{ dx: number; dy: number } | null>(null);
    const root = useRef<HTMLElement>(null);

    // a window that comes to the front takes the keyboard, unless something inside it already has it
    // (the terminal focuses its own prompt)
    useEffect(() => {
        if (focused && !minimized && !root.current?.contains(document.activeElement)) {
            root.current?.focus({ preventScroll: true });
        }
    }, [focused, minimized]);

    function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
        onFocus();
        if ((event.target as HTMLElement).closest("button") || zoomed) return;
        drag.current = { dx: event.clientX - x, dy: event.clientY - y };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!drag.current) return;
        // the title bar always stays reachable
        const nextX = Math.min(
            window.innerWidth - 96,
            Math.max(96 - width, event.clientX - drag.current.dx),
        );
        const nextY = Math.min(
            window.innerHeight - 40,
            Math.max(MENU_BAR, event.clientY - drag.current.dy),
        );
        onMove(nextX, nextY);
    }

    function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    const buttons = [
        { label: labels.close, bg: "bg-mac-red", glyph: "×", onClick: onClose },
        { label: labels.minimize, bg: "bg-mac-yellow", glyph: "−", onClick: onMinimize },
        { label: labels.zoom, bg: "bg-mac-green", glyph: "+", onClick: onZoom },
    ];

    return (
        <section
            ref={root}
            tabIndex={-1}
            aria-label={title}
            onPointerDown={onFocus}
            hidden={minimized}
            style={
                zoomed
                    ? { zIndex: z, inset: `${MENU_BAR + 12}px 12px 96px 12px` }
                    : { zIndex: z, left: x, top: y, width, height }
            }
            className={`app-window absolute flex flex-col overflow-hidden rounded-xl border bg-bg-1 outline-none ${
                focused
                    ? "border-line-strong shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]"
                    : "border-line shadow-[0_14px_36px_-16px_rgba(0,0,0,0.7)]"
            }`}
        >
            {/* the title bar is a pointer-only drag handle; every action has a button */}
            <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className={`group flex h-9 shrink-0 touch-none select-none items-center gap-2 border-b border-line bg-bg-2 px-3 ${
                    zoomed ? "" : "cursor-grab active:cursor-grabbing"
                }`}
            >
                <div className="flex gap-0">
                    {buttons.map((button) => (
                        <button
                            key={button.label}
                            type="button"
                            aria-label={button.label}
                            onClick={button.onClick}
                            className="flex size-[18px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent-blue"
                        >
                            <span
                                className={`flex size-2.5 items-center justify-center rounded-full font-bold text-[9px] text-black/60 leading-none transition-opacity ${
                                    focused ? button.bg : "bg-ink-faint/40"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                                >
                                    {button.glyph}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
                <p
                    className={`flex-1 truncate pr-12 text-center font-mono text-xs ${
                        focused ? "text-ink-dim" : "text-ink-faint"
                    }`}
                >
                    {title}
                </p>
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </section>
    );
}
