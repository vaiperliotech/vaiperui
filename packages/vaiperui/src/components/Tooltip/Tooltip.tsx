import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { isDark, useAnchored, useControllableOpen, useTrigger } from "../shared/overlayHooks";
import type { TooltipColors, TooltipProps } from "./types";

const colors: Record<TooltipColors, string> = {
    neutral: "bg-[var(--vpd-text)] text-[var(--vpd-surface)]",
    primary: "bg-primary-600 text-white",
    success: "bg-success-600 text-white",
    warning: "bg-warning-500 text-white",
    danger: "bg-danger-600 text-white",
};
const staticSide = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

export function Tooltip({
    children,
    content,
    title,
    side = "top",
    showArrow = true,
    delayDuration = 200,
    open,
    defaultOpen,
    onOpenChange,
    variantColor = "neutral",
    radius = "md",
    customColor,
    className,
}: TooltipProps) {
    const [isOpen, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
    const arrowRef = React.useRef<HTMLDivElement>(null);
    const { refs, floatingStyles, placement, middlewareData } = useAnchored(
        side,
        "center",
        8,
        arrowRef,
    );
    const id = React.useId();
    const timer = React.useRef(0);

    const show = (delay: number) => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setOpen(true), delay);
    };
    const hide = React.useCallback(() => {
        window.clearTimeout(timer.current);
        setOpen(false);
    }, [setOpen]);
    React.useEffect(() => () => window.clearTimeout(timer.current), []);
    React.useEffect(() => {
        if (!isOpen) return;
        const onKey = (event: KeyboardEvent) => event.key === "Escape" && hide();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, hide]);

    const triggerEl = useTrigger(children, refs.setReference, {
        onMouseEnter: () => show(delayDuration),
        onMouseLeave: hide,
        onFocus: () => show(0),
        onBlur: hide,
        "aria-describedby": isOpen ? id : undefined,
    });

    const arrowSide = staticSide[placement.split("-")[0] as keyof typeof staticSide];
    const arrow = middlewareData.arrow;

    return (
        <>
            {triggerEl}
            {isOpen &&
                createPortal(
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            ...(customColor && customColorVars(customColor)),
                        }}
                        className={cn(
                            "pointer-events-none z-50",
                            isDark(refs.reference.current as Element | null) && "dark",
                        )}
                    >
                        <div
                            id={id}
                            role="tooltip"
                            className={cn(
                                "relative max-w-[240px] px-2.5 py-1.5 text-xs shadow-md",
                                customColor
                                    ? "bg-[var(--vpd-accent)] text-white"
                                    : colors[variantColor],
                                controlRadius[radius],
                                className,
                            )}
                        >
                            {title && <div className="mb-0.5 font-semibold">{title}</div>}
                            {content}
                            {showArrow && (
                                <div
                                    ref={arrowRef}
                                    aria-hidden="true"
                                    className="absolute h-2 w-2 rotate-45 bg-inherit"
                                    style={{
                                        left: arrow?.x,
                                        top: arrow?.y,
                                        [arrowSide]: -4,
                                    }}
                                />
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
