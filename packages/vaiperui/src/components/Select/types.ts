import type { CSSProperties, ReactNode } from "react";

import type { CustomColor } from "../../lib/customColorVars";

export type SelectColors = "primary" | "success" | "warning" | "danger";
export type SelectVariant = "default" | "detailed";
export type SelectSize = "sm" | "md" | "lg";
export type SelectRadius = "none" | "sm" | "md" | "lg" | "full";
export type SelectAnimation = "none" | "smooth" | "fast" | "bounce";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    /** Secondary line shown under the label. Only rendered by `variant="detailed"`. */
    description?: string;
    /** Leading visual (avatar, icon...) shown before the text. Only rendered by `variant="detailed"`. */
    leading?: ReactNode;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    /** Shows a filter input inside the menu so the user can type to narrow the options. */
    searchable?: boolean;
    searchPlaceholder?: string;
    /**
     * `boxed`: a padded, rounded input inset in the menu. `full`: the input spans the whole top
     * edge of the menu, borderless, separated from the options by a divider. The `detailed`
     * variant always uses `full`.
     */
    searchStyle?: "boxed" | "full";
    /**
     * `default`: the compact single-line dropdown. `detailed`: a richer combobox with a taller
     * trigger/rows, an optional leading slot and secondary line per option (via
     * `SelectOption.leading`/`description`), a persistent tint on the selected row, and its own
     * fixed indigo accent (overridden by `customColor` when set).
     */
    variant?: SelectVariant;
    variantColor?: SelectColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: SelectSize;
    radius?: SelectRadius;
    animation?: SelectAnimation;
    disabled?: boolean;
    /** Mirrors the value into a hidden input for form submission. */
    name?: string;
    id?: string;
    className?: string;
    style?: CSSProperties;
    label?: string;
}
