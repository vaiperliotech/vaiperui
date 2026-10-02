import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonColors = "primary" | "success" | "warning" | "danger";
export type ButtonVariant = "solid" | "solid-inverse" | "outlined" | "outlined2" | "transparent";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonHover = "none" | "lift" | "scale" | "glow";
export type ButtonAnimation =
    | "none"
    | "float"
    | "pulse"
    | "shine"
    | "wiggle"
    | "wobble"
    | "nudge"
    | "jelly"
    | "heartbeat"
    | "jump"
    | "gradient"
    | "glow";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variantColor?: ButtonColors;
    variant?: ButtonVariant;
    size?: ButtonSize;
    hover?: ButtonHover;
    animation?: ButtonAnimation;
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
}
