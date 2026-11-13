import type { HTMLAttributes } from "react";

import type { ControlRadius, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type BadgeStatus = "success" | "error" | "warning" | "info" | "neutral" | "pending";
export type BadgeSize = ControlSize;
export type BadgeRadius = ControlRadius;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic color. */
    status?: BadgeStatus;
    /** Shows a decorative dot before the text. */
    dot?: boolean;
    size?: BadgeSize;
    radius?: BadgeRadius;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `status` colors when set. */
    customColor?: CustomColor;
}
