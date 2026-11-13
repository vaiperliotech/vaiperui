import type { HTMLAttributes, ReactNode } from "react";

import type { ControlColors, ControlRadius, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type AlertColors = ControlColors;
export type AlertSize = ControlSize;
export type AlertRadius = ControlRadius;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "color"> {
    /** `primary` is the neutral/info look. `warning` and `danger` use `role="alert"`, the rest `role="status"`. */
    variantColor?: AlertColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: AlertSize;
    radius?: AlertRadius;
    /** Bold summary line above the description (the children). */
    title?: ReactNode;
    /** Leading icon: omit for the default status icon, `false` to hide it, or pass your own. */
    icon?: ReactNode;
    /** Slot under the description, e.g. a small ghost Button or a link. */
    action?: ReactNode;
    /** When set, a close button appears and this runs on click. The parent decides whether to unmount. */
    onDismiss?: () => void;
    /** Accessible name of the close button. */
    dismissLabel?: string;
}
