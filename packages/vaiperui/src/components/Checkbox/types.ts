import type { InputHTMLAttributes, ReactNode } from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type CheckboxColors = ControlColors;
export type CheckboxSize = ControlSize;
export type CheckboxRadius = ControlRadius;
export type CheckboxAnimation = ControlAnimation;

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "type"> {
    variantColor?: CheckboxColors;
    size?: CheckboxSize;
    radius?: CheckboxRadius;
    animation?: CheckboxAnimation;
    /** Text next to the box. Clicking it toggles the checkbox. */
    label?: ReactNode;
    /** Secondary line under the label. */
    helperText?: string;
    /** Error text under the control; its presence alone forces the error state. */
    errorMessage?: string;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    /** Shows a dash instead of the check, for a "some selected" parent checkbox. */
    indeterminate?: boolean;
}
