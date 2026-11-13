import {
    arrow,
    autoUpdate,
    flip,
    type Middleware,
    offset,
    type Placement,
    shift,
    useFloating,
} from "@floating-ui/react-dom";
import * as React from "react";

import { type ControlAnimation, controlAnimations } from "../../lib/controlStyles";

export type OverlaySide = "top" | "right" | "bottom" | "left";
export type OverlayAlign = "start" | "center" | "end";

export const FOCUSABLE =
    'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/** Controlled (`open`) or uncontrolled (`defaultOpen`) open state. */
export function useControllableOpen(
    open: boolean | undefined,
    defaultOpen: boolean | undefined,
    onOpenChange: ((open: boolean) => void) | undefined,
) {
    const [inner, setInner] = React.useState(defaultOpen ?? false);
    const current = open ?? inner;
    const onChangeRef = React.useRef(onOpenChange);
    onChangeRef.current = onOpenChange;
    const setOpen = React.useCallback((next: boolean) => {
        setInner(next);
        onChangeRef.current?.(next);
    }, []);
    return [current, setOpen] as const;
}

/** Floating-ui anchored to a side/align with flip + shift; `arrowRef` adds the arrow middleware. */
export function useAnchored(
    side: OverlaySide,
    align: OverlayAlign,
    distance = 8,
    arrowRef?: React.RefObject<HTMLElement | null>,
) {
    const placement = (align === "center" ? side : `${side}-${align}`) as Placement;
    const middleware: Middleware[] = [offset(distance), flip(), shift({ padding: 8 })];
    if (arrowRef) middleware.push(arrow({ element: arrowRef }));
    return useFloating({
        placement,
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        middleware,
    });
}

/** Closes on a pointerdown outside every ref and on Escape (`escape` tells which one). */
export function useDismiss(
    open: boolean,
    onDismiss: (byEscape: boolean) => void,
    getInside: () => (Element | null | undefined)[],
) {
    const dismissRef = React.useRef(onDismiss);
    dismissRef.current = onDismiss;
    const insideRef = React.useRef(getInside);
    insideRef.current = getInside;
    React.useEffect(() => {
        if (!open) return;
        function onPointerDown(event: Event) {
            const target = event.target as Node;
            if (insideRef.current().some((el) => el?.contains(target))) return;
            dismissRef.current(false);
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") dismissRef.current(true);
        }
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);
}

type AnyFn = (...args: unknown[]) => void;
type TriggerProps = { ref?: React.Ref<HTMLElement>; [key: string]: unknown };

/** Clones `trigger` adding a ref and props; handlers already on the element still run. */
export function useTrigger(
    trigger: React.ReactElement | undefined,
    setRef: React.RefCallback<HTMLElement> | undefined,
    props: Record<string, unknown>,
) {
    const own = (trigger?.props as TriggerProps | undefined)?.ref;
    const ref = React.useMemo(
        () => (node: HTMLElement | null) => {
            for (const r of [own, setRef]) {
                if (typeof r === "function") r(node);
                else if (r) (r as React.RefObject<HTMLElement | null>).current = node;
            }
        },
        [own, setRef],
    );
    if (!trigger) return null;
    const ownProps = trigger.props as TriggerProps;
    const merged: Record<string, unknown> = { ref };
    for (const [key, value] of Object.entries(props)) {
        const original = ownProps[key];
        merged[key] =
            typeof value === "function" && typeof original === "function"
                ? (...args: unknown[]) => {
                      (original as AnyFn)(...args);
                      (value as AnyFn)(...args);
                  }
                : value;
    }
    return React.cloneElement(trigger, merged);
}

/** True one frame after `open` becomes true, to drive enter transitions. */
export function useEntered(open: boolean, animation: ControlAnimation) {
    const [entered, setEntered] = React.useState(false);
    React.useEffect(() => {
        if (!open) return setEntered(false);
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, [open]);
    return animation === "none" || entered;
}

export function fadeScale(entered: boolean, animation: ControlAnimation) {
    return [
        controlAnimations[animation],
        entered ? "opacity-100 scale-100" : "opacity-0 scale-95",
    ].join(" ");
}

/** The portal is outside the trigger's `.dark` wrapper, so the class is copied over. */
export function isDark(el: Element | null | undefined) {
    return !!(el ?? document.body).closest(".dark");
}
