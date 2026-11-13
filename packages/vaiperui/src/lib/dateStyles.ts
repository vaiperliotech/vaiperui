import type { ControlColors } from "./controlStyles";

type DateColor = { selected: string; band: string; focus: string };

export const dateColors: Record<ControlColors, DateColor> = {
    primary: {
        selected: "bg-primary-600 text-white hover:bg-primary-600",
        band: "bg-primary-500/15",
        focus: "focus-visible:ring-2 focus-visible:ring-primary-500",
    },
    success: {
        selected: "bg-success-600 text-white hover:bg-success-600",
        band: "bg-success-500/15",
        focus: "focus-visible:ring-2 focus-visible:ring-success-500",
    },
    warning: {
        selected: "bg-warning-500 text-white hover:bg-warning-500",
        band: "bg-warning-500/15",
        focus: "focus-visible:ring-2 focus-visible:ring-warning-500",
    },
    danger: {
        selected: "bg-danger-600 text-white hover:bg-danger-600",
        band: "bg-danger-500/15",
        focus: "focus-visible:ring-2 focus-visible:ring-danger-500",
    },
};

/** When `customColor` is set, driven by `--vpd-accent*`. */
export const customDateColor: DateColor = {
    selected: "bg-[var(--vpd-accent)] text-white hover:bg-[var(--vpd-accent)]",
    band: "bg-[var(--vpd-accent-tint)]",
    focus: "focus-visible:ring-2 focus-visible:ring-[var(--vpd-accent)]",
};
