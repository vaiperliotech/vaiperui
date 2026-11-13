import type { TextareaHTMLAttributes } from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type TextareaColors = ControlColors;
export type TextareaVariant = "ring" | "outline";
export type TextareaSize = ControlSize;
export type TextareaRadius = ControlRadius;
export type TextareaAnimation = ControlAnimation;

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color"> {
    variant?: TextareaVariant;
    variantColor?: TextareaColors;
    size?: TextareaSize;
    radius?: TextareaRadius;
    animation?: TextareaAnimation;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    /** Which directions the user can drag to resize. Defaults to `vertical`. */
    resize?: "none" | "vertical" | "horizontal" | "both";
}
