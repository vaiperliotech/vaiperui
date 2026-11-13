import * as React from "react";

import { FOCUSABLE } from "./overlayHooks";

/**
 * While mounted: locks body scroll, moves focus into the panel, traps Tab,
 * closes on Escape and restores focus to the previously focused element.
 */
export function useDialog(
    panelRef: React.RefObject<HTMLElement | null>,
    onClose: () => void,
    closeOnEscape: boolean,
) {
    const onCloseRef = React.useRef(onClose);
    onCloseRef.current = onClose;
    const escapeRef = React.useRef(closeOnEscape);
    escapeRef.current = closeOnEscape;

    React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        (panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();

        function onKeyDown(event: KeyboardEvent) {
            if (!panel) return;
            if (event.key === "Escape" && escapeRef.current) return onCloseRef.current();
            if (event.key !== "Tab") return;
            const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
            if (!items.length) {
                event.preventDefault();
                return panel.focus();
            }
            const first = items[0] as HTMLElement;
            const last = items[items.length - 1] as HTMLElement;
            const active = document.activeElement;
            const outside = !panel.contains(active);
            if (
                event.shiftKey
                    ? active === first || active === panel || outside
                    : active === last || outside
            ) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            if (previous?.isConnected) previous.focus();
        };
    }, [panelRef]);
}
