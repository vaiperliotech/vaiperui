import type { InputColors, InputVariant } from "../types";

export const variantStyles: Record<InputVariant, Record<InputColors, string>> = {
    ring: {
        primary:
            "focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
        success:
            "focus:outline-none focus:border-success-500 focus:ring-4 focus:ring-success-500/20",
        warning:
            "focus:outline-none focus:border-warning-500 focus:ring-4 focus:ring-warning-500/20",
        danger: "focus:outline-none focus:border-danger-500 focus:ring-4 focus:ring-danger-500/20",
    },
    outline: {
        primary: "focus:outline-2 focus:outline-offset-2 focus:outline-primary-500",
        success: "focus:outline-2 focus:outline-offset-2 focus:outline-success-500",
        warning: "focus:outline-2 focus:outline-offset-2 focus:outline-warning-500",
        danger: "focus:outline-2 focus:outline-offset-2 focus:outline-danger-500",
    },
};

/** Focus treatment when `customColor` is set, driven by `--vpd-accent*`. */
export const customVariantStyles: Record<InputVariant, string> = {
    ring: "focus:outline-none focus:border-[var(--vpd-accent)] focus:ring-4 focus:ring-[var(--vpd-accent-ring)]",
    outline: "focus:outline-2 focus:outline-offset-2 focus:outline-[var(--vpd-accent)]",
};

export const errorStyles: Record<InputVariant, string> = {
    ring: "border-danger-500 focus:outline-none focus:border-danger-600 focus:ring-4 focus:ring-danger-500/20",
    outline: "border-danger-500 focus:outline-2 focus:outline-offset-2 focus:outline-danger-500",
};
