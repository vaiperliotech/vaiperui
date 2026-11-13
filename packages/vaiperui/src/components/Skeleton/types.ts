import type { HTMLAttributes } from "react";

import type { ControlRadius } from "../../lib/controlStyles";

export type SkeletonVariant = "text" | "title" | "avatar" | "rectangle" | "card";
export type SkeletonAnimation = "pulse" | "none";
export type SkeletonRadius = ControlRadius;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    /** Shape and default size. `text` is a 12px line, `title` 20px, `avatar` a 40px circle, `rectangle` 24px, `card` 120px. */
    variant?: SkeletonVariant;
    /** `text` only: how many lines to draw. The last of several is shorter. */
    lines?: number;
    /** CSS width (number = px). Defaults to the variant's. */
    width?: number | string;
    /** CSS height (number = px). Defaults to the variant's. */
    height?: number | string;
    /** Overrides the variant's corner rounding. */
    radius?: SkeletonRadius;
    /** `pulse` fades in and out (off with `prefers-reduced-motion`); `none` is static. */
    animation?: SkeletonAnimation;
}
