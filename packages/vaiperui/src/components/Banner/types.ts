import type { HTMLAttributes, ReactNode } from "react";

import type { ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type BannerColors = ControlColors;
export type BannerSize = ControlSize;

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
    /** `primary` is the neutral/info look. `warning` and `danger` use `role="alert"`, the rest `role="status"`. */
    variantColor?: BannerColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: BannerSize;
    /** Leading icon: omit for the default status icon, `false` to hide it, or pass your own. */
    icon?: ReactNode;
    /** Slot beside the message, e.g. a small ghost Button or a link. */
    action?: ReactNode;
    /** When set, a close button appears and this runs on click. The parent decides whether to unmount. */
    onDismiss?: () => void;
    /** Accessible name of the close button. */
    dismissLabel?: string;
}
