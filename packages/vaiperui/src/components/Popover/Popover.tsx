import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { OverlayClose, OverlayCloseContext } from "../shared/OverlayClose";
import {
    FOCUSABLE,
    fadeScale,
    isDark,
    useAnchored,
    useControllableOpen,
    useDismiss,
    useEntered,
    useTrigger,
} from "../shared/overlayHooks";
import type { PopoverProps } from "./types";

/** Wrap a button in it (inside a Popover) to close the panel on click. */
export const PopoverClose = OverlayClose;

export function Popover({
    trigger,
    label,
    children,
    side = "bottom",
    align = "center",
    open,
    defaultOpen,
    onOpenChange,
    radius = "lg",
    animation = "fast",
    className,
}: PopoverProps) {
    const [isOpen, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
    const { refs, floatingStyles } = useAnchored(side, align);
    const panelId = React.useId();
    const entered = useEntered(isOpen, animation);

    const triggerEl = useTrigger(trigger, refs.setReference, {
        onClick: () => setOpen(!isOpen),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? panelId : undefined,
    });

    useDismiss(
        isOpen,
        (byEscape) => {
            setOpen(false);
            if (byEscape) (refs.reference.current as HTMLElement | null)?.focus();
        },
        () => [refs.floating.current, refs.reference.current as Element | null],
    );

    React.useEffect(() => {
        if (!isOpen) return;
        const panel = refs.floating.current;
        (panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel)?.focus();
    }, [isOpen, refs]);

    return (
        <OverlayCloseContext.Provider value={() => setOpen(false)}>
            {triggerEl}
            {isOpen &&
                createPortal(
                    <div
                        ref={refs.setFloating}
                        id={panelId}
                        role="dialog"
                        aria-label={label}
                        tabIndex={-1}
                        style={floatingStyles}
                        className={cn(
                            "z-50 outline-none",
                            isDark(refs.reference.current as Element | null) && "dark",
                        )}
                    >
                        <div
                            className={cn(
                                "border border-[var(--vpd-border)] bg-[var(--vpd-surface)] p-3 text-sm text-[var(--vpd-text)] shadow-lg",
                                controlRadius[radius],
                                fadeScale(entered, animation),
                                className,
                            )}
                        >
                            {children}
                        </div>
                    </div>,
                    document.body,
                )}
        </OverlayCloseContext.Provider>
    );
}
