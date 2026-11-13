import type { InputHTMLAttributes, ReactNode } from "react";

import type { ControlAnimation, ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type RadioColors = ControlColors;
export type RadioSize = ControlSize;
export type RadioAnimation = ControlAnimation;

export interface RadioProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "type"> {
    variantColor?: RadioColors;
    size?: RadioSize;
    animation?: RadioAnimation;
    /** Text next to the radio. Clicking it selects the radio. */
    label?: ReactNode;
    /** Secondary line under the label. */
    helperText?: string;
    /** Error text under the control; its presence alone forces the error state. */
    errorMessage?: string;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
}

export interface RadioOption {
    value: string;
    label: ReactNode;
    /** Secondary line under the label. */
    description?: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    options: RadioOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Shared `name` of the radios, so they submit with a `<form>`. Generated when omitted. */
    name?: string;
    /** Title of the group, rendered as a `<legend>`. */
    label?: string;
    helperText?: string;
    /** Error text under the group; its presence alone forces the error state on every radio. */
    errorMessage?: string;
    orientation?: "vertical" | "horizontal";
    variantColor?: RadioColors;
    customColor?: CustomColor;
    size?: RadioSize;
    animation?: RadioAnimation;
    disabled?: boolean;
    className?: string;
}
