export type ControlColors = "primary" | "success" | "warning" | "danger";
export type ControlSize = "sm" | "md" | "lg";
export type ControlRadius = "none" | "sm" | "md" | "lg" | "full";
export type ControlAnimation = "none" | "smooth" | "fast" | "bounce";

export const controlAnimations: Record<ControlAnimation, string> = {
    none: "",
    smooth: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-100 ease-out",
    bounce: "transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
};

export const controlRadius: Record<ControlRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
};

// The visual box/track is a sibling after a visually hidden native input with class `peer`,
// so the checked and focus states are driven with `peer-*` variants.
export const checkedColors: Record<ControlColors, string> = {
    primary:
        "peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-indeterminate:border-primary-600 peer-indeterminate:bg-primary-600",
    success:
        "peer-checked:border-success-600 peer-checked:bg-success-600 peer-indeterminate:border-success-600 peer-indeterminate:bg-success-600",
    warning:
        "peer-checked:border-warning-500 peer-checked:bg-warning-500 peer-indeterminate:border-warning-500 peer-indeterminate:bg-warning-500",
    danger: "peer-checked:border-danger-600 peer-checked:bg-danger-600 peer-indeterminate:border-danger-600 peer-indeterminate:bg-danger-600",
};

export const focusColors: Record<ControlColors, string> = {
    primary: "peer-focus-visible:ring-4 peer-focus-visible:ring-primary-500/30",
    success: "peer-focus-visible:ring-4 peer-focus-visible:ring-success-500/30",
    warning: "peer-focus-visible:ring-4 peer-focus-visible:ring-warning-500/30",
    danger: "peer-focus-visible:ring-4 peer-focus-visible:ring-danger-500/30",
};

/** Checked/focus treatment when `customColor` is set, driven by `--vpd-accent*`. */
export const customChecked =
    "peer-checked:border-[var(--vpd-accent)] peer-checked:bg-[var(--vpd-accent)] peer-indeterminate:border-[var(--vpd-accent)] peer-indeterminate:bg-[var(--vpd-accent)] peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--vpd-accent-ring)]";

/** Colors for a control: an error forces `danger` and ignores `customColor`. */
export function controlColorClasses(
    color: ControlColors,
    hasCustomColor: boolean,
    hasError: boolean,
): string {
    if (hasError) return `border-danger-500 ${checkedColors.danger} ${focusColors.danger}`;
    if (hasCustomColor) return customChecked;
    return `${checkedColors[color]} ${focusColors[color]}`;
}
