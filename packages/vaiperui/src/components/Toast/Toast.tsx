import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { CloseButton, iconNode, roleOf, toneOf } from "../Alert/shared";
import type { ToasterProps, ToastOptions, ToastPosition } from "./types";

type Item = ToastOptions & { id: string };

// Module-level store so `toast()` works anywhere, with or without a hook.
let items: Item[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function commit(next: Item[]) {
    items = next;
    for (const listener of listeners) listener();
}
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
};

function dismiss(id?: string) {
    const gone = items.filter((item) => id === undefined || item.id === id);
    commit(items.filter((item) => !gone.includes(item)));
    for (const item of gone) item.onClose?.();
}

/** Shows a toast and returns its id. Needs a mounted `<Toaster />` to be visible. */
export function toast(options: ToastOptions | string): string {
    const opts = typeof options === "string" ? { description: options } : options;
    const id = opts.id ?? `vpd-toast-${++counter}`;
    commit([...items.filter((item) => item.id !== id), { ...opts, id }]);
    return id;
}
toast.dismiss = dismiss;

export function useToast() {
    return { toast, dismiss };
}

const positions: Record<ToastPosition, string> = {
    "top-left": "top-0 left-0 items-start",
    "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-0 right-0 items-end",
    "bottom-left": "bottom-0 left-0 items-start",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-0 right-0 items-end",
};

function ToastItem({
    item,
    duration,
    radius,
    dismissLabel,
}: {
    item: Item;
    duration: number;
    radius: NonNullable<ToasterProps["radius"]>;
    dismissLabel: string;
}) {
    const { id, variantColor = "primary", customColor } = item;
    const total = item.duration ?? duration;
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);
    const remaining = React.useRef(total);
    const paused = hovered || focused || hidden;

    React.useEffect(() => {
        const onVisibility = () => setHidden(document.visibilityState === "hidden");
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    // A replaced toast (same id) gets a fresh item object, so reset its clock.
    // biome-ignore lint/correctness/useExhaustiveDependencies: `item` is the trigger, not a value read
    React.useEffect(() => {
        remaining.current = total;
    }, [item, total]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: `item` restarts the timer when a toast is replaced
    React.useEffect(() => {
        if (paused || !Number.isFinite(remaining.current) || remaining.current <= 0) return;
        const startedAt = Date.now();
        const timer = setTimeout(() => dismiss(id), remaining.current);
        return () => {
            clearTimeout(timer);
            remaining.current -= Date.now() - startedAt;
        };
    }, [paused, id, item]);

    const tone = toneOf(variantColor, Boolean(customColor));
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: the live-region div only observes hover/focus/Escape; every control inside is a real button
        <div
            role={roleOf(variantColor)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape") dismiss(id);
            }}
            style={customColor ? customColorVars(customColor) : undefined}
            className={cn(
                "pointer-events-auto flex w-full items-start gap-3 border bg-[var(--vpd-surface)] p-4 text-sm text-[var(--vpd-text)] shadow-lg",
                controlRadius[radius],
                tone.box,
            )}
        >
            {iconNode(item.icon, variantColor, tone.icon)}
            <div className="min-w-0 flex-1">
                {item.title ? <div className="font-semibold">{item.title}</div> : null}
                {item.description ? (
                    <div className={cn(item.title && "text-[var(--vpd-text-secondary)]")}>
                        {item.description}
                    </div>
                ) : null}
                {item.action ? (
                    <button
                        type="button"
                        onClick={() => {
                            item.action?.onClick();
                            dismiss(id);
                        }}
                        className="mt-2 cursor-pointer rounded-md text-sm font-semibold underline outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
                    >
                        {item.action.label}
                    </button>
                ) : null}
            </div>
            {item.dismissible === false ? null : (
                <CloseButton label={dismissLabel} onClick={() => dismiss(id)} />
            )}
        </div>
    );
}

/** Renders the toasts in a portal. Mount it once near the app root. */
export function Toaster({
    position = "top-right",
    limit = 5,
    duration = 5000,
    radius = "lg",
    label = "Notifications",
    dismissLabel = "Dismiss",
}: ToasterProps) {
    const list = React.useSyncExternalStore(
        subscribe,
        () => items,
        () => [],
    );
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    // Newest sits next to the screen edge.
    const shown = list.slice(-limit);
    const ordered = position.startsWith("top") ? [...shown].reverse() : shown;
    return createPortal(
        <section
            aria-label={label}
            className={cn(
                "pointer-events-none fixed z-[60] flex w-full max-w-sm flex-col gap-2 p-4",
                positions[position],
            )}
        >
            {ordered.map((item) => (
                <ToastItem
                    key={item.id}
                    item={item}
                    duration={duration}
                    radius={radius}
                    dismissLabel={dismissLabel}
                />
            ))}
        </section>,
        document.body,
    );
}
