import type { InputHTMLAttributes, ReactNode } from "react";

import type { ControlAnimation, ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type SwitchColors = ControlColors;
export type SwitchSize = ControlSize;
export type SwitchAnimation = ControlAnimation;

export interface SwitchProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "type" | "role"> {
    variantColor?: SwitchColors;
    size?: SwitchSize;
    animation?: SwitchAnimation;
    /** Text next to the switch. Clicking it toggles the switch. */
    label?: ReactNode;
    /** Secondary line under the label. */
    helperText?: string;
    /** Error text under the control; its presence alone forces the error state. */
    errorMessage?: string;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
}
