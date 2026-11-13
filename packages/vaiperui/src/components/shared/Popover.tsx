import * as React from "react";
import { createPortal } from "react-dom";

/** Panel under (or above, when there is no room) an anchor. Rendered in a portal so no parent clips it. */
export function Popover({
    open,
    onClose,
    anchorRef,
    label,
    children,
}: {
    open: boolean;
    /** `restoreFocus` is true when closed with Escape. */
    onClose: (restoreFocus: boolean) => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    label: string;
    children: React.ReactNode;
}) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

    React.useLayoutEffect(() => {
        if (!open) return setPosition(null);
        function place() {
            const anchor = anchorRef.current?.getBoundingClientRect();
            const panel = panelRef.current;
            if (!anchor || !panel) return;
            const { offsetHeight: height, offsetWidth: width } = panel;
            let top = anchor.bottom + 4;
            if (top + height > window.innerHeight && anchor.top - height - 4 > 0) {
                top = anchor.top - height - 4;
            }
            const left = Math.max(8, Math.min(anchor.left, window.innerWidth - width - 8));
            setPosition({ top, left });
        }
        place();
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true);
        return () => {
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
    }, [open, anchorRef]);

    React.useEffect(() => {
        if (!open) return;
        function onPointerDown(event: PointerEvent) {
            const target = event.target as Node;
            if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
            onClose(false);
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose(true);
        }
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;
    return createPortal(
        <div
            ref={panelRef}
            role="dialog"
            aria-label={label}
            className="fixed z-50 rounded-lg border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-[var(--vpd-text)] shadow-lg"
            style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? "visible" : "hidden",
            }}
        >
            {children}
        </div>,
        document.body,
    );
}
