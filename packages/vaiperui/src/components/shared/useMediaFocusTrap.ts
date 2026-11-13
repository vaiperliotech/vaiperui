import * as React from "react";

const FOCUSABLE =
    "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * While the host is mounted: moves focus inside, keeps Tab cycling inside, locks the body scroll and,
 * on unmount, gives focus back to the previously focused element unless `onCloseAutoFocus` prevents it.
 */
export function useMediaFocusTrap(
    ref: React.RefObject<HTMLElement | null>,
    onCloseAutoFocus?: (event: Event) => void,
) {
    const closeRef = React.useRef(onCloseAutoFocus);
    closeRef.current = onCloseAutoFocus;

    React.useEffect(() => {
        const host = ref.current;
        if (!host) return;
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const items = () => Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE));
        (items()[0] ?? host).focus();

        function onKeyDown(event: KeyboardEvent) {
            if (event.key !== "Tab") return;
            const list = items();
            const first = list[0];
            const last = list[list.length - 1];
            if (!first || !last) return event.preventDefault();
            const active = document.activeElement;
            if (event.shiftKey && (active === first || active === host)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        }
        host.addEventListener("keydown", onKeyDown);
        return () => {
            host.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            const event = new Event("closeautofocus", { cancelable: true });
            closeRef.current?.(event);
            if (!event.defaultPrevented) previous?.focus?.();
        };
    }, [ref]);
}
