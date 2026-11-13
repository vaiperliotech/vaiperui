import type { HTMLAttributes } from "react";

import type { ControlColors, ControlRadius, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type AvatarSize = ControlSize;
export type AvatarColors = ControlColors;
export type AvatarRadius = ControlRadius;

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
    /** Full name: gives the initials (first and last words) and the accessible label. */
    name: string;
    /** Image URL. Initials are shown when missing or when it fails to load. */
    src?: string;
    /** 32, 40 or 56px. */
    size?: AvatarSize;
    radius?: AvatarRadius;
    /** Tints the initials fallback; neutral when omitted. */
    variantColor?: AvatarColors;
    /** A CSS color, or a `{ light, dark }` pair for the initials fallback. */
    customColor?: CustomColor;
}
