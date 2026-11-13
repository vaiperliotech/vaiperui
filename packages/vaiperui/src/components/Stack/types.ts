import type { HTMLAttributes, ReactNode } from "react";

export type StackDirection = "vertical" | "horizontal";
export type StackBreakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type StackGap = 0 | 1 | 2 | 3 | 4 | 6 | 8;
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface StackProps extends HTMLAttributes<HTMLElement> {
    /** Element to render. Defaults to `div`. */
    as?: React.ElementType;
    /** Main axis, or one value per breakpoint, e.g. `{ base: "vertical", md: "horizontal" }`. */
    direction?: StackDirection | Partial<Record<StackBreakpoint, StackDirection>>;
    /** Space between children on the Tailwind scale (4px steps). */
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
    /** Element rendered between every pair of children. */
    divider?: ReactNode;
}
