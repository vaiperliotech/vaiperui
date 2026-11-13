import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import type { AccordionColors, AccordionItemProps, AccordionProps } from "./types";

const focusRing: Record<AccordionColors, string> = {
    primary: "focus-visible:ring-primary-500/40",
    success: "focus-visible:ring-success-500/40",
    warning: "focus-visible:ring-warning-500/40",
    danger: "focus-visible:ring-danger-500/40",
};
const customFocusRing = "focus-visible:ring-[var(--vpd-accent-ring)]";

type Ctx = {
    open: string[];
    toggle: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    ring: string;
    animation: string;
    baseId: string;
};
const AccordionContext = React.createContext<Ctx | null>(null);

const toArray = (v: string | string[] | undefined): string[] =>
    Array.isArray(v) ? v : v ? [v] : [];

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    function Accordion(props, forwardedRef) {
        const {
            type,
            value,
            defaultValue,
            onValueChange,
            variantColor = "primary",
            customColor,
            animation = "smooth",
            className,
            style,
            ...rest
        } = props as AccordionProps & { collapsible?: boolean };
        const collapsible = "collapsible" in props ? Boolean(props.collapsible) : false;
        delete (rest as { collapsible?: boolean }).collapsible;

        const [inner, setInner] = React.useState<string[]>(toArray(defaultValue));
        const open = value !== undefined ? toArray(value) : inner;
        const baseId = React.useId();
        const rootRef = React.useRef<HTMLDivElement | null>(null);

        const toggle = (item: string) => {
            const isOpen = open.includes(item);
            let next: string[];
            if (type === "multiple")
                next = isOpen ? open.filter((v) => v !== item) : [...open, item];
            else if (isOpen) next = collapsible ? [] : open;
            else next = [item];
            if (value === undefined) setInner(next);
            if (type === "multiple") (onValueChange as ((v: string[]) => void) | undefined)?.(next);
            else (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? "");
        };

        const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
            if (!keys.includes(e.key)) return;
            const triggers = Array.from(
                rootRef.current?.querySelectorAll<HTMLButtonElement>(
                    "button[data-vpd-accordion-trigger]:not(:disabled)",
                ) ?? [],
            );
            const i = triggers.indexOf(e.target as HTMLButtonElement);
            if (i < 0) return;
            e.preventDefault();
            const last = triggers.length - 1;
            const next =
                e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? last
                      : e.key === "ArrowDown"
                        ? (i + 1) % triggers.length
                        : (i - 1 + triggers.length) % triggers.length;
            triggers[next]?.focus();
        };

        return (
            <AccordionContext.Provider
                value={{
                    open,
                    toggle,
                    onKeyDown,
                    ring: customColor ? customFocusRing : focusRing[variantColor],
                    animation: controlAnimations[animation],
                    baseId,
                }}
            >
                <div
                    {...rest}
                    ref={(node) => {
                        rootRef.current = node;
                        if (typeof forwardedRef === "function") forwardedRef(node);
                        else if (forwardedRef) forwardedRef.current = node;
                    }}
                    style={customColor ? { ...customColorVars(customColor), ...style } : style}
                    className={cn(
                        "divide-y divide-[var(--vpd-border)] rounded-lg border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-[var(--vpd-text)]",
                        className,
                    )}
                />
            </AccordionContext.Provider>
        );
    },
);

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    function AccordionItem({ className, value, title, disabled, children, ...props }, ref) {
        const ctx = React.useContext(AccordionContext);
        if (!ctx) throw new Error("AccordionItem must be used inside <Accordion>");
        const isOpen = ctx.open.includes(value);
        const triggerId = `${ctx.baseId}-t-${value}`;
        const panelId = `${ctx.baseId}-p-${value}`;

        return (
            <div {...props} ref={ref} className={className}>
                <h3 className="m-0">
                    <button
                        type="button"
                        id={triggerId}
                        data-vpd-accordion-trigger=""
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        disabled={disabled}
                        onClick={() => ctx.toggle(value)}
                        onKeyDown={ctx.onKeyDown}
                        className={cn(
                            "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium outline-none hover:bg-[var(--vpd-surface-hover)] focus-visible:ring-4 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50",
                            ctx.ring,
                        )}
                    >
                        {title}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className={cn(
                                "h-4 w-4 shrink-0 text-[var(--vpd-text-muted)]",
                                ctx.animation,
                                isOpen && "rotate-180",
                            )}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 6l4 4 4-4" />
                        </svg>
                    </button>
                </h3>
                <section
                    id={panelId}
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="px-4 pb-4 text-sm text-[var(--vpd-text-secondary)]"
                >
                    {children}
                </section>
            </div>
        );
    },
);
