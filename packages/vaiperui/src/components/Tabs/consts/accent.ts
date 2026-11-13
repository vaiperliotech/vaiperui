import type { ControlColors } from "../../../lib/controlStyles";

type Accent = {
    /** Accent-colored text. */
    text: string;
    /** Accent-colored border. */
    border: string;
    /** Solid accent background with readable text. */
    solid: string;
    /** Keyboard focus ring. */
    ring: string;
};

const accents: Record<ControlColors, Accent> = {
    primary: {
        text: "text-primary-600 dark:text-primary-400",
        border: "border-primary-600 dark:border-primary-400",
        solid: "border-primary-600 bg-primary-600 text-white",
        ring: "focus-visible:ring-2 focus-visible:ring-primary-500/40",
    },
    success: {
        text: "text-success-600 dark:text-success-400",
        border: "border-success-600 dark:border-success-400",
        solid: "border-success-600 bg-success-600 text-white",
        ring: "focus-visible:ring-2 focus-visible:ring-success-500/40",
    },
    warning: {
        text: "text-warning-600 dark:text-warning-400",
        border: "border-warning-500",
        solid: "border-warning-500 bg-warning-500 text-white",
        ring: "focus-visible:ring-2 focus-visible:ring-warning-500/40",
    },
    danger: {
        text: "text-danger-600 dark:text-danger-400",
        border: "border-danger-600 dark:border-danger-400",
        solid: "border-danger-600 bg-danger-600 text-white",
        ring: "focus-visible:ring-2 focus-visible:ring-danger-500/40",
    },
};

const customAccent: Accent = {
    text: "text-[var(--vpd-accent)]",
    border: "border-[var(--vpd-accent)]",
    solid: "border-[var(--vpd-accent)] bg-[var(--vpd-accent)] text-white",
    ring: "focus-visible:ring-2 focus-visible:ring-[var(--vpd-accent-ring)]",
};

/** Class sets shared by the navigation components; `customColor` wins over the named color. */
export function accentOf(color: ControlColors, hasCustomColor: boolean): Accent {
    return hasCustomColor ? customAccent : accents[color];
}
