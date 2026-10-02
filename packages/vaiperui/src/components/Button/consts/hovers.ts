import type { ButtonColors, ButtonHover } from "../types";

export const hovers: Record<ButtonHover, string> = {
    none: "",
    lift: "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
    scale: "hover:scale-105 active:scale-100",
    glow: "hover:shadow-lg",
};

export const glowColors: Record<ButtonColors, string> = {
    primary: "hover:shadow-primary-500/60",
    success: "hover:shadow-success-500/60",
    warning: "hover:shadow-warning-500/60",
    danger: "hover:shadow-danger-500/60",
};
