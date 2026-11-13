import type { ControlColors, ControlSize } from "../../lib/controlStyles";

/** Soft tinted look (background + text + border) per color. */
export const tints: Record<ControlColors, string> = {
    primary: "border-primary-500/30 bg-primary-500/15 text-primary-600",
    success: "border-success-500/30 bg-success-500/15 text-success-600",
    warning: "border-warning-500/30 bg-warning-500/15 text-warning-600",
    danger: "border-danger-500/30 bg-danger-500/15 text-danger-600",
};

export const neutralTint =
    "border-[var(--vpd-border)] bg-[var(--vpd-surface-muted)] text-[var(--vpd-text-secondary)]";

/** Tint when `customColor` is set, driven by `--vpd-accent*`. */
export const customTint =
    "border-[var(--vpd-accent-ring)] bg-[var(--vpd-accent-tint)] text-[var(--vpd-accent)]";

export const pillSizes: Record<ControlSize, string> = {
    sm: "gap-1 px-2 py-0.5 text-[11px]",
    md: "gap-1.5 px-2.5 py-0.5 text-xs",
    lg: "gap-1.5 px-3 py-1 text-sm",
};
