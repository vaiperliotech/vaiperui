import type { ReactNode } from "react";

import type { ControlColors, ControlRadius } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type ToastColors = ControlColors;
export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export interface ToastAction {
    label: string;
    /** Runs on click; the toast closes afterwards. */
    onClick: () => void;
}

export interface ToastOptions {
    /** Passing the id of a visible toast replaces it. Generated when omitted. */
    id?: string;
    title?: ReactNode;
    description?: ReactNode;
    /** `warning` and `danger` are announced assertively, the rest politely. */
    variantColor?: ToastColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    /** Omit for the default status icon, `false` to hide it, or pass your own. */
    icon?: ReactNode;
    action?: ToastAction;
    /** Milliseconds before auto-close; `0` or `Infinity` keeps it until dismissed. Pauses on hover and focus. */
    duration?: number;
    /** Show the close button. Default `true`. */
    dismissible?: boolean;
    /** Runs once when the toast closes, however it closed. */
    onClose?: () => void;
}

export interface ToasterProps {
    position?: ToastPosition;
    /** Most toasts shown at once; older ones are dropped. */
    limit?: number;
    /** Default `duration` for toasts that do not set one. */
    duration?: number;
    radius?: ControlRadius;
    /** Accessible name of the notifications region. */
    label?: string;
    /** Accessible name of each close button. */
    dismissLabel?: string;
}
