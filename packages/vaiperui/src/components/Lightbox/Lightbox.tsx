import * as React from "react";

import { cn } from "../../lib/cn";
import { ChevronIcon, CloseIcon } from "../shared/mediaControls";
import { MediaPortal } from "../shared/mediaPortal";
import { useMediaControlled } from "../shared/useMediaControlled";
import { useMediaFocusTrap } from "../shared/useMediaFocusTrap";
import type { LightboxProps } from "./types";

const iconButton =
    "absolute z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50";

export function Lightbox({
    items,
    open,
    defaultOpen = false,
    onOpenChange,
    index,
    defaultIndex = 0,
    onIndexChange,
    label = "Image viewer",
    closeLabel = "Close",
    previousLabel = "Previous image",
    nextLabel = "Next image",
    counterLabel = (i, total) => `${i + 1} / ${total}`,
    onCloseAutoFocus,
    className,
}: LightboxProps) {
    const [isOpen, setOpen] = useMediaControlled(open, defaultOpen, onOpenChange);
    const [current, setIndex] = useMediaControlled(index, defaultIndex, onIndexChange);
    if (!isOpen || items.length === 0) return null;
    const safe = Math.min(Math.max(0, current), items.length - 1);
    return (
        <MediaPortal>
            <LightboxView
                items={items}
                index={safe}
                label={label}
                closeLabel={closeLabel}
                previousLabel={previousLabel}
                nextLabel={nextLabel}
                counterLabel={counterLabel}
                onCloseAutoFocus={onCloseAutoFocus}
                onClose={() => setOpen(false)}
                onIndexChange={setIndex}
                className={className}
            />
        </MediaPortal>
    );
}

// Mounted only while open, so the focus trap and the scroll lock live exactly as long as the viewer.
function LightboxView({
    items,
    index,
    label,
    closeLabel,
    previousLabel,
    nextLabel,
    counterLabel,
    onCloseAutoFocus,
    onClose,
    onIndexChange,
    className,
}: Required<
    Pick<
        LightboxProps,
        "items" | "label" | "closeLabel" | "previousLabel" | "nextLabel" | "counterLabel"
    >
> &
    Pick<LightboxProps, "onCloseAutoFocus" | "className"> & {
        index: number;
        onClose: () => void;
        onIndexChange: (index: number) => void;
    }) {
    const ref = React.useRef<HTMLDivElement>(null);
    useMediaFocusTrap(ref, onCloseAutoFocus);
    const total = items.length;
    const item = items[index];
    const go = (delta: number) => onIndexChange((index + delta + total) % total);

    return (
        <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 text-white",
                className,
            )}
            onKeyDown={(event) => {
                if (event.key === "Escape") onClose();
                else if (event.key === "ArrowLeft" && total > 1) go(-1);
                else if (event.key === "ArrowRight" && total > 1) go(1);
                else return;
                event.preventDefault();
                event.stopPropagation();
            }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className={cn(iconButton, "top-4 right-4")}
            >
                <CloseIcon />
            </button>
            {total > 1 ? (
                <>
                    <button
                        type="button"
                        aria-label={previousLabel}
                        onClick={() => go(-1)}
                        className={cn(iconButton, "top-1/2 left-4 -translate-y-1/2")}
                    >
                        <ChevronIcon dir="left" />
                    </button>
                    <button
                        type="button"
                        aria-label={nextLabel}
                        onClick={() => go(1)}
                        className={cn(iconButton, "top-1/2 right-4 -translate-y-1/2")}
                    >
                        <ChevronIcon dir="right" />
                    </button>
                </>
            ) : null}
            {item ? (
                <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
                    {/* biome-ignore lint/performance/noImgElement: framework-agnostic library, no next/image available */}
                    <img
                        src={item.src}
                        alt={item.alt}
                        className="max-h-[78vh] max-w-full rounded-md object-contain"
                    />
                    {item.caption ? (
                        <figcaption className="text-center text-sm">{item.caption}</figcaption>
                    ) : null}
                </figure>
            ) : null}
            {total > 1 ? (
                <p aria-live="polite" className="mt-3 text-sm text-white/80 tabular-nums">
                    {counterLabel(index, total)}
                </p>
            ) : null}
        </div>
    );
}
