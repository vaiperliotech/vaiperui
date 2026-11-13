import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { accentOf } from "../Tabs/consts/accent";
import type { SegmentedControlProps, SegmentedItemProps } from "./types";

type Ctx = {
    value: string | undefined;
    select: (value: string) => void;
    disabled: boolean;
    activeText: string;
    ring: string;
    size: "sm" | "md" | "lg";
    radius: string;
    animation: string;
};

const SegmentedContext = React.createContext<Ctx | null>(null);

const sizes = { sm: "px-2.5 py-1 text-xs", md: "px-3 py-1.5 text-sm", lg: "px-4 py-2 text-base" };

export function SegmentedControl({
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    variantColor,
    customColor,
    size = "md",
    radius = "md",
    animation = "smooth",
    className,
    style,
    onKeyDown,
    ...props
}: SegmentedControlProps) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const current = value !== undefined ? value : uncontrolled;
    const accent =
        variantColor || customColor
            ? accentOf(variantColor ?? "primary", Boolean(customColor))
            : null;

    function select(next: string) {
        if (next === current) return;
        if (value === undefined) setUncontrolled(next);
        onValueChange?.(next);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const step =
            event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                  ? -1
                  : 0;
        if (!step) return;
        const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="radio"]:not(:disabled)',
            ),
        );
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        if (index < 0) return;
        event.preventDefault();
        const target = items[(index + step + items.length) % items.length];
        target?.focus();
        target?.click();
    }

    return (
        <SegmentedContext.Provider
            value={{
                value: current,
                select,
                disabled,
                activeText: accent?.text ?? "text-[var(--vpd-text)]",
                ring: accentOf(variantColor ?? "primary", Boolean(customColor)).ring,
                size,
                radius: controlRadius[radius],
                animation: controlAnimations[animation],
            }}
        >
            <div
                role="radiogroup"
                aria-disabled={disabled || undefined}
                {...props}
                onKeyDown={handleKeyDown}
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
                className={cn(
                    "inline-flex gap-0.5 bg-[var(--vpd-surface-muted)] p-0.5",
                    controlRadius[radius],
                    className,
                )}
            />
        </SegmentedContext.Provider>
    );
}

export function SegmentedItem({
    value,
    className,
    disabled,
    onClick,
    ...props
}: SegmentedItemProps) {
    const ctx = React.useContext(SegmentedContext);
    if (!ctx) throw new Error("SegmentedItem must be used inside <SegmentedControl>");
    const checked = ctx.value === value;
    const off = disabled || ctx.disabled;

    return (
        // biome-ignore lint/a11y/useSemanticElements: see the radiogroup above
        <button
            {...props}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            disabled={off}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) ctx.select(value);
            }}
            className={cn(
                "cursor-pointer whitespace-nowrap font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50",
                sizes[ctx.size],
                ctx.radius,
                ctx.animation,
                ctx.ring,
                checked
                    ? cn("bg-[var(--vpd-surface)] shadow-sm", ctx.activeText)
                    : "text-[var(--vpd-text-muted)] enabled:hover:text-[var(--vpd-text)]",
                className,
            )}
        />
    );
}
