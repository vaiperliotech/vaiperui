import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { accentOf } from "./consts/accent";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./types";

type TabsContextValue = {
    base: string;
    value: string | undefined;
    select: (value: string) => void;
    orientation: "horizontal" | "vertical";
    activation: "auto" | "manual";
    accent: ReturnType<typeof accentOf>;
    size: "sm" | "md" | "lg";
    animation: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("Tab, TabList and TabPanel must be used inside <Tabs>");
    return ctx;
}

const safeId = (value: string) => value.replace(/\s+/g, "-");
const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };

export function Tabs({
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activation = "auto",
    variantColor = "primary",
    customColor,
    size = "md",
    animation = "smooth",
    className,
    style,
    ...props
}: TabsProps) {
    const base = React.useId();
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const current = value !== undefined ? value : uncontrolled;
    const select = React.useCallback(
        (next: string) => {
            if (value === undefined) setUncontrolled(next);
            onValueChange?.(next);
        },
        [value, onValueChange],
    );

    return (
        <TabsContext.Provider
            value={{
                base,
                value: current,
                select,
                orientation,
                activation,
                accent: accentOf(variantColor, Boolean(customColor)),
                size,
                animation: controlAnimations[animation],
            }}
        >
            <div
                {...props}
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
                className={cn(
                    "flex",
                    orientation === "vertical" ? "flex-row gap-4" : "flex-col",
                    className,
                )}
            />
        </TabsContext.Provider>
    );
}

export function TabList({ className, onKeyDown, ...props }: TabListProps) {
    const { orientation, activation } = useTabs();
    const vertical = orientation === "vertical";

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const prev = vertical ? "ArrowUp" : "ArrowLeft";
        const next = vertical ? "ArrowDown" : "ArrowRight";
        const tabs = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
        );
        const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
        if (index < 0 || tabs.length === 0) return;
        let target: HTMLButtonElement | undefined;
        if (event.key === next) target = tabs[(index + 1) % tabs.length];
        else if (event.key === prev) target = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === "Home") target = tabs[0];
        else if (event.key === "End") target = tabs[tabs.length - 1];
        if (!target) return;
        event.preventDefault();
        target.focus();
        if (activation === "auto") target.click();
    }

    return (
        <div
            role="tablist"
            aria-orientation={orientation}
            {...props}
            onKeyDown={handleKeyDown}
            className={cn(
                "flex shrink-0 border-[var(--vpd-border)]",
                vertical ? "flex-col border-r" : "flex-row border-b",
                className,
            )}
        />
    );
}

export function Tab({ value, icon, className, children, onClick, disabled, ...props }: TabProps) {
    const ctx = useTabs();
    const selected = ctx.value === value;
    const vertical = ctx.orientation === "vertical";

    return (
        <button
            {...props}
            type="button"
            role="tab"
            id={`${ctx.base}-tab-${safeId(value)}`}
            aria-selected={selected}
            aria-controls={`${ctx.base}-panel-${safeId(value)}`}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={(event) => {
                onClick?.(event);
                if (!event.defaultPrevented) ctx.select(value);
            }}
            className={cn(
                "inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border-transparent font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50",
                vertical ? "-mr-px border-r-2 text-left" : "-mb-px border-b-2",
                sizes[ctx.size],
                ctx.animation,
                ctx.accent.ring,
                selected
                    ? cn(ctx.accent.border, ctx.accent.text)
                    : "text-[var(--vpd-text-muted)] enabled:hover:text-[var(--vpd-text)]",
                className,
            )}
        >
            {icon ? (
                <span className="inline-flex shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}

export function TabPanel({ value, className, ...props }: TabPanelProps) {
    const ctx = useTabs();
    return (
        <div
            // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tabs pattern makes the panel tabbable when it has no focusable content
            tabIndex={0}
            {...props}
            role="tabpanel"
            id={`${ctx.base}-panel-${safeId(value)}`}
            aria-labelledby={`${ctx.base}-tab-${safeId(value)}`}
            hidden={ctx.value !== value}
            className={cn(
                "flex-1 p-4 text-[var(--vpd-text)] outline-none",
                ctx.accent.ring,
                className,
            )}
        />
    );
}
