import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";
import type { ControlAnimation } from "../../lib/controlStyles";
import { controlAnimations } from "../../lib/controlStyles";
import { OverlayCloseContext } from "./OverlayClose";
import { isDark, useEntered } from "./overlayHooks";
import { useDialog } from "./useDialog";

export interface DialogShellProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    showClose: boolean;
    closeLabel: string;
    closeOnEscape: boolean;
    closeOnBackdrop: boolean;
    showHeaderDivider: boolean;
    showFooterDivider: boolean;
    animation: ControlAnimation;
    /** Positions the panel inside the full-screen layer. */
    containerClassName: string;
    panelClassName: string;
    /** Panel classes before / after the enter transition. */
    hiddenClassName: string;
    shownClassName: string;
}

/** Portal + backdrop + `role="dialog"` panel shared by Modal and Drawer. */
export function DialogShell(props: DialogShellProps) {
    return props.open ? createPortal(<DialogContent {...props} />, document.body) : null;
}

function DialogContent({
    onOpenChange,
    title,
    children,
    footer,
    showClose,
    closeLabel,
    closeOnEscape,
    closeOnBackdrop,
    showHeaderDivider,
    showFooterDivider,
    animation,
    containerClassName,
    panelClassName,
    hiddenClassName,
    shownClassName,
}: DialogShellProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const bodyId = React.useId();
    const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
    const [dark] = React.useState(() => isDark(document.activeElement));
    const entered = useEntered(true, animation);
    useDialog(panelRef, close, closeOnEscape);
    const transition = controlAnimations[animation];

    return (
        <OverlayCloseContext.Provider value={close}>
            <div className={cn("fixed inset-0 z-50 flex", dark && "dark", containerClassName)}>
                <div
                    aria-hidden="true"
                    data-testid="vpd-backdrop"
                    className={cn(
                        "absolute inset-0 bg-black/50",
                        transition,
                        entered ? "opacity-100" : "opacity-0",
                    )}
                    onClick={closeOnBackdrop ? close : undefined}
                />
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={bodyId}
                    tabIndex={-1}
                    className={cn(
                        "relative flex flex-col bg-[var(--vpd-surface)] text-[var(--vpd-text)] shadow-xl outline-none",
                        transition,
                        panelClassName,
                        entered ? shownClassName : hiddenClassName,
                    )}
                >
                    <div
                        className={cn(
                            "flex items-start justify-between gap-4 px-5 py-4",
                            showHeaderDivider && "border-b border-[var(--vpd-border)]",
                        )}
                    >
                        <h2 id={titleId} className="text-lg font-semibold">
                            {title}
                        </h2>
                        {showClose && (
                            <button
                                type="button"
                                aria-label={closeLabel}
                                onClick={close}
                                className="-m-1 rounded-md p-1 text-[var(--vpd-text-muted)] transition-colors hover:bg-[var(--vpd-surface-hover)] hover:text-[var(--vpd-text)] focus-visible:ring-4 focus-visible:ring-primary-500/30 focus-visible:outline-none"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div id={bodyId} className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm">
                        {children}
                    </div>
                    {footer && (
                        <div
                            className={cn(
                                "flex justify-end gap-2 px-5 py-3",
                                showFooterDivider && "border-t border-[var(--vpd-border)]",
                            )}
                        >
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </OverlayCloseContext.Provider>
    );
}
