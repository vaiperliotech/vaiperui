import type { HTMLAttributes } from "react";

import type { ControlColors, ControlRadius, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type TagVariant = "filled" | "outline";
export type TagColors = ControlColors;
export type TagSize = ControlSize;
export type TagRadius = ControlRadius;

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: TagVariant;
    /** Neutral when omitted. */
    variantColor?: TagColors;
    size?: TagSize;
    radius?: TagRadius;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    /** When set, a remove button is rendered and calls this on click. */
    onDismiss?: () => void;
    /** Accessible name of the remove button. */
    dismissLabel?: string;
}
