import type { ButtonAnimation, ButtonColors } from "../types";

export const animations: Record<ButtonAnimation, string> = {
    none: "",
    float: "motion-safe:animate-float",
    pulse: "motion-safe:animate-pulse-soft",
    wiggle: "motion-safe:animate-wiggle",
    wobble: "motion-safe:animate-wobble",
    nudge: "motion-safe:animate-nudge",
    jelly: "motion-safe:animate-jelly",
    heartbeat: "motion-safe:animate-heartbeat",
    jump: "motion-safe:animate-jump",
    glow: "motion-safe:animate-glow",
    gradient: "bg-gradient-to-r bg-[length:200%_200%] motion-safe:animate-gradient",
    shine: "relative overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:bg-gradient-to-r before:from-transparent before:via-current/20 before:to-transparent before:opacity-0 before:content-[''] motion-safe:before:animate-shine",
};

export const gradientColorStyles: Record<ButtonColors, string> = {
    primary: "from-primary-400 via-primary-500 to-primary-600",
    success: "from-success-400 via-success-500 to-success-600",
    warning: "from-warning-400 via-warning-500 to-warning-600",
    danger: "from-danger-400 via-danger-500 to-danger-600",
};

export const glowColorStyles: Record<ButtonColors, string> = {
    primary: "[--btn-glow:var(--color-primary-500)]",
    success: "[--btn-glow:var(--color-success-500)]",
    warning: "[--btn-glow:var(--color-warning-500)]",
    danger: "[--btn-glow:var(--color-danger-500)]",
};

export function animationColors(
    animation: ButtonAnimation,
    variantColor: ButtonColors,
): string | false {
    if (animation === "gradient") return gradientColorStyles[variantColor];
    if (animation === "glow") return glowColorStyles[variantColor];
    return false;
}
