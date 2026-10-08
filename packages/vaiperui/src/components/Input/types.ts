import type { InputHTMLAttributes, ReactNode } from "react";

import type { CustomColor } from "../../lib/customColorVars";

export type InputColors = "primary" | "success" | "warning" | "danger";
export type InputVariant = "ring" | "outline";
export type InputSize = "sm" | "md" | "lg";
export type InputRadius = "none" | "sm" | "md" | "lg" | "full";
export type InputAnimation = "none" | "smooth" | "fast" | "bounce";
export type InputMask = "cpf" | "cnpj" | "cei" | "cep" | "telefone";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color"> {
    variant?: InputVariant;
    variantColor?: InputColors;
    size?: InputSize;
    radius?: InputRadius;
    animation?: InputAnimation;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    mask?: InputMask;
}
