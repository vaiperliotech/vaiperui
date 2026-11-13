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
    /** Leading visual (flag, avatar, icon...) shown before the text. Larger slot in `variant="detailed"`. */
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
    /** Shows a spinner row at the end of the list (and instead of the empty message) while options load. */
    loading?: boolean;
    loadingMessage?: string;
    /**
     * Fires when the user scrolls near the end of the list and `loading` is false: fetch the next
     * page, append it to `options` and set `loading` meanwhile.
     */
    onReachEnd?: () => void;
    /**
     * Set to false when the last page was loaded. While true, `onReachEnd` also fires when the
     * options don't fill the menu (no scrollbar), until they do.
     */
    hasMore?: boolean;
    /**
     * Server-side search: called with the typed text (not debounced: debounce it yourself) and
     * the local filter is turned off, so `options` should already be the matching ones. Also
     * called with "" when the search is cleared or the menu reopens with a leftover query.
     * Needs `searchable`.
     */
    onSearchChange?: (query: string) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Message for a search with no matches. Receives the trimmed query. */
    noResultsMessage?: (query: string) => string;
    /** Accessible name of the button that clears the search field. */
    clearSearchLabel?: string;
    /** Accessible name for the combobox when there is no visible `label`. */
    "aria-label"?: string;
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
