import type { HTMLAttributes, ReactNode } from "react";

import type { CustomColor } from "../../lib/customColorVars";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted";
export type DividerSpacing = "none" | "sm" | "md" | "lg";
export type DividerColor = "default" | "strong" | "soft";
export type DividerLabelAlign = "start" | "center" | "end";

export interface DividerProps extends Omit<HTMLAttributes<HTMLElement>, "role"> {
    orientation?: DividerOrientation;
    /** Line style. */
    variant?: DividerVariant;
    /** Margin around the line, on the axis it separates. */
    spacing?: DividerSpacing;
    /** Theme border token. Ignored when `customColor` is set. */
    color?: DividerColor;
    /** A CSS color, or a `{ light, dark }` pair. */
    customColor?: CustomColor;
    /** Text shown inside the line. */
    label?: ReactNode;
    labelAlign?: DividerLabelAlign;
    /** Purely visual: hidden from assistive technology instead of announced as a separator. */
    decorative?: boolean;
}
