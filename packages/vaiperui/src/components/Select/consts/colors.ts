import type { SelectColors } from "../types";

type SelectColorClasses = {
    ring: string;
    borderOpen: string;
    optionActiveBg: string;
    optionSelectedText: string;
};

export const colors: Record<SelectColors, SelectColorClasses> = {
    primary: {
        ring: "focus-visible:ring-primary-500/30",
        borderOpen: "border-primary-600",
        optionActiveBg: "bg-primary-50 dark:bg-primary-900/40",
        optionSelectedText: "text-primary-600 dark:text-primary-400",
    },
    success: {
        ring: "focus-visible:ring-success-500/30",
        borderOpen: "border-success-600",
        optionActiveBg: "bg-success-50 dark:bg-success-900/40",
        optionSelectedText: "text-success-600 dark:text-success-400",
    },
    warning: {
        ring: "focus-visible:ring-warning-500/30",
        borderOpen: "border-warning-500",
        optionActiveBg: "bg-warning-50 dark:bg-warning-900/40",
        optionSelectedText: "text-warning-600 dark:text-warning-400",
    },
    danger: {
        ring: "focus-visible:ring-danger-500/30",
        borderOpen: "border-danger-600",
        optionActiveBg: "bg-danger-50 dark:bg-danger-900/40",
        optionSelectedText: "text-danger-600 dark:text-danger-400",
    },
};

/** Same shape as `colors`, driven by the `--vpd-accent*` custom properties. */
export const customColorClasses: SelectColorClasses = {
    ring: "focus-visible:ring-[var(--vpd-accent-ring)]",
    borderOpen: "border-[var(--vpd-accent)]",
    optionActiveBg: "bg-[var(--vpd-accent-tint)]",
    optionSelectedText: "text-[var(--vpd-accent)]",
};

/**
 * Fixed accent for `variant="detailed"` — this style has no `variantColor` axis, so it always
 * uses indigo unless `customColor` overrides it.
 */
export const detailedAccent: SelectColorClasses = {
    ring: "focus-visible:ring-indigo-500/30",
    borderOpen: "border-indigo-500",
    optionActiveBg: "bg-indigo-50 dark:bg-indigo-950",
    optionSelectedText: "text-indigo-500 dark:text-indigo-400",
};
