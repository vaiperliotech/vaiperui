"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MenuItem =
    | { kind: "item"; label: string; onSelect: () => void; checked?: boolean; disabled?: boolean }
    | { kind: "label"; label: string }
    | { kind: "separator" };

const WIDTH = 232;

// The menu of a right click: arrows move, Enter picks, Esc or a click elsewhere closes it.
export function ContextMenu({
    x,
    y,
    items,
    onClose,
}: {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const actionable = items.flatMap((item, index) =>
        item.kind === "item" && !item.disabled ? [index] : [],
    );
    const [active, setActive] = useState<number>(actionable[0] ?? -1);
    const [placed, setPlaced] = useState({ x, y });

    // keeps the whole menu on screen when the click was near an edge
    useEffect(() => {
        const height = ref.current?.offsetHeight ?? 0;
        setPlaced({
            x: Math.max(8, Math.min(x, window.innerWidth - WIDTH - 8)),
            y: Math.max(8, Math.min(y, window.innerHeight - height - 8)),
        });
        ref.current?.focus();
    }, [x, y]);

    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const at = actionable.indexOf(active);
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive(actionable[(at + step + actionable.length) % actionable.length] ?? -1);
        } else if (event.key === "Enter") {
            event.preventDefault();
            const item = items[active];
            if (item?.kind === "item") {
                onClose();
                item.onSelect();
            }
        }
    }

    return createPortal(
        <>
            {/* a click or another right click outside closes it */}
            <button
                type="button"
                tabIndex={-1}
                aria-label="Close menu"
                onClick={onClose}
                onContextMenu={(event) => {
                    event.preventDefault();
                    onClose();
                }}
                className="fixed inset-0 z-[5700] cursor-default"
            />
            <div
                ref={ref}
                role="menu"
                tabIndex={-1}
                onKeyDown={onKeyDown}
                style={{ left: placed.x, top: placed.y, width: WIDTH }}
                className="clock-panel fixed z-[5800] rounded-xl border border-white/10 bg-bg-1/85 p-1.5 font-mono text-xs shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] outline-none backdrop-blur-2xl"
            >
                {items.map((item, index) =>
                    item.kind === "separator" ? (
                        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed menu
                        // biome-ignore lint/a11y/useSemanticElements: an <hr> would carry its own margins and border
                        <div key={index} role="separator" className="my-1 h-px bg-white/10" />
                    ) : item.kind === "label" ? (
                        <p
                            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed menu
                            key={index}
                            className="px-2.5 pt-1.5 pb-1 text-[10px] text-ink-faint uppercase tracking-wider"
                        >
                            {item.label}
                        </p>
                    ) : (
                        <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed menu
                            key={index}
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            onMouseEnter={() => !item.disabled && setActive(index)}
                            onClick={() => {
                                onClose();
                                item.onSelect();
                            }}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-ink disabled:cursor-default disabled:text-ink-faint ${
                                active === index ? "bg-accent-blue text-[#05070d]" : ""
                            }`}
                        >
                            <span className="w-3 shrink-0 text-center">
                                {item.checked ? "✓" : ""}
                            </span>
                            {item.label}
                        </button>
                    ),
                )}
            </div>
        </>,
        document.body,
    );
}
