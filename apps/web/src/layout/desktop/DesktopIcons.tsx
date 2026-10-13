"use client";

import { useEffect, useRef, useState } from "react";

import { AppIcon } from "./icons";
import { hiddenFilesStore, iconsStore, trashStore, useStore } from "./stores";

export type DesktopIconId = "docs" | "arcade" | "apps" | "trash" | "readme";

type Entry = { id: DesktopIconId; label: string };

const CELL_W = 92;
const CELL_H = 100;
const TOP = 44;

// the files you can throw away; the rest are folders and the Trash itself
const REMOVABLE: DesktopIconId[] = ["readme"];

/** The default place of each icon: one column down the left edge. */
const home = (index: number) => ({ x: 16, y: TOP + index * CELL_H });

// The icons on the desktop: double-click (or Enter) opens, drag moves, drop a file on the Trash.
export function DesktopIcons({
    entries,
    onOpen,
    onContext,
    onTrash,
}: {
    entries: Entry[];
    onOpen: (id: DesktopIconId) => void;
    onContext: (event: React.MouseEvent, id: DesktopIconId) => void;
    onTrash: (id: DesktopIconId) => void;
}) {
    const positions = useStore(iconsStore);
    const hidden = useStore(hiddenFilesStore);
    const trash = useStore(trashStore);
    const [selected, setSelected] = useState<DesktopIconId | null>(null);
    const [drag, setDrag] = useState<{ id: DesktopIconId; x: number; y: number } | null>(null);
    const grab = useRef({ dx: 0, dy: 0, moved: false });

    // a press anywhere that is not an icon clears the selection
    useEffect(() => {
        const clear = (event: PointerEvent) => {
            if (!(event.target as HTMLElement).closest("[data-icon]")) setSelected(null);
        };
        document.addEventListener("pointerdown", clear);
        return () => document.removeEventListener("pointerdown", clear);
    }, []);

    // an icon keeps its slot when another one is thrown away
    const slotOf = (id: DesktopIconId) => entries.findIndex((entry) => entry.id === id);
    const visible = entries.filter(
        (entry) => !(REMOVABLE.includes(entry.id) && hidden.includes(entry.id)),
    );

    function startDrag(
        event: React.PointerEvent<HTMLButtonElement>,
        id: DesktopIconId,
        at: { x: number; y: number },
    ) {
        if (event.button !== 0) return;
        setSelected(id);
        grab.current = { dx: event.clientX - at.x, dy: event.clientY - at.y, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveDrag(event: React.PointerEvent<HTMLButtonElement>, id: DesktopIconId) {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const x = Math.max(
            0,
            Math.min(window.innerWidth - CELL_W, event.clientX - grab.current.dx),
        );
        const y = Math.max(
            TOP - 12,
            Math.min(window.innerHeight - CELL_H - 90, event.clientY - grab.current.dy),
        );
        if (
            Math.abs(x - (drag?.x ?? x)) + Math.abs(y - (drag?.y ?? y)) > 0 ||
            !grab.current.moved
        ) {
            grab.current.moved = true;
        }
        setDrag({ id, x, y });
    }

    function endDrag(event: React.PointerEvent<HTMLButtonElement>, id: DesktopIconId) {
        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        const current = drag;
        setDrag(null);
        if (!current || !grab.current.moved) return;
        // dropped on the Trash: files go in, folders stay where they were
        const bin = document
            .querySelector<HTMLElement>('[data-icon="trash"]')
            ?.getBoundingClientRect();
        const overBin =
            bin &&
            id !== "trash" &&
            event.clientX >= bin.left &&
            event.clientX <= bin.right &&
            event.clientY >= bin.top &&
            event.clientY <= bin.bottom;
        if (overBin && REMOVABLE.includes(id)) onTrash(id);
        else iconsStore.set((all) => ({ ...all, [id]: { x: current.x, y: current.y } }));
    }

    return (
        <>
            {visible.map((entry) => {
                const at =
                    drag?.id === entry.id ? drag : (positions[entry.id] ?? home(slotOf(entry.id)));
                const isSelected = selected === entry.id;
                return (
                    <button
                        key={entry.id}
                        type="button"
                        data-icon={entry.id}
                        onPointerDown={(event) => startDrag(event, entry.id, at)}
                        onPointerMove={(event) => moveDrag(event, entry.id)}
                        onPointerUp={(event) => endDrag(event, entry.id)}
                        onDoubleClick={() => onOpen(entry.id)}
                        onContextMenu={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setSelected(entry.id);
                            onContext(event, entry.id);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") onOpen(entry.id);
                            else if (event.key === "Delete" && REMOVABLE.includes(entry.id))
                                onTrash(entry.id);
                        }}
                        style={{ left: at.x, top: at.y, width: CELL_W }}
                        className={`absolute z-[1] flex touch-none select-none flex-col items-center gap-1.5 rounded-lg p-1.5 text-center focus-visible:outline-2 focus-visible:outline-accent-blue ${
                            drag?.id === entry.id ? "cursor-grabbing opacity-80" : "cursor-default"
                        } ${isSelected ? "bg-accent-blue/20" : "hover:bg-white/5"}`}
                    >
                        <span className="pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]">
                            <AppIcon
                                id={
                                    entry.id === "trash" && trash.length > 0
                                        ? "trash-full"
                                        : entry.id
                                }
                            />
                        </span>
                        <span
                            className={`pointer-events-none line-clamp-2 max-w-full break-all rounded px-1.5 font-mono text-[11px] text-ink leading-4 ${
                                isSelected
                                    ? "bg-accent-blue text-[#05070d]"
                                    : "[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
                            }`}
                        >
                            {entry.label}
                        </span>
                    </button>
                );
            })}
        </>
    );
}
