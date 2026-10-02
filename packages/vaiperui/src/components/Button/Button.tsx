import * as React from "react";

import { cn } from "../../lib/cn";

export type ButtonColors = "primary" | "success" | "warning" | "danger";
export type ButtonVariant = "solid" | "solid-inverse" | "outlined" | "outlined2" | "transparent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variantColor?: ButtonColors;
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const baseStyles =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, Record<ButtonColors, string>> = {
    solid: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
        success: "bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500",
        warning: "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500",
        danger: "bg-danger-500 text-white hover:bg-danger-700 focus-visible:ring-danger-500",
    },
    "solid-inverse": {
        primary: "bg-primary-500 text-white hover:bg-primary-400 focus-visible:ring-primary-500",
        success: "bg-success-500 text-white hover:bg-success-400 focus-visible:ring-success-500",
        warning: "bg-warning-500 text-white hover:bg-warning-400 focus-visible:ring-warning-500",
        danger: "bg-danger-500 text-white hover:bg-danger-400 focus-visible:ring-danger-500",
    },
    outlined: {
        primary:
            "border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500",
        success:
            "border border-success-300 bg-transparent text-success-700 hover:bg-success-50 focus-visible:ring-success-500",
        warning:
            "border border-warning-300 bg-transparent text-warning-700 hover:bg-warning-50 focus-visible:ring-warning-500",
        danger: "border border-danger-300 bg-transparent text-danger-700 hover:bg-danger-50 focus-visible:ring-danger-500",
    },
    outlined2: {
        primary:
            "border border-primary-500 bg-transparent text-primary-700 hover:bg-primary-500 hover:text-white focus-visible:ring-primary-500",
        success:
            "border border-success-500 bg-transparent text-success-700 hover:bg-success-500 hover:text-white focus-visible:ring-success-500",
        warning:
            "border border-warning-500 bg-transparent text-warning-700 hover:bg-warning-500 hover:text-white focus-visible:ring-warning-500",
        danger: "border border-danger-500 bg-transparent text-danger-700 hover:bg-danger-500 hover:text-white focus-visible:ring-danger-500",
    },
    transparent: {
        primary:
            "bg-transparent text-primary-700 hover:bg-primary-500/20 focus-visible:ring-primary-500",
        success:
            "bg-transparent text-success-700 hover:bg-success-500/20 focus-visible:ring-success-500",
        warning:
            "bg-transparent text-warning-700 hover:bg-warning-500/20 focus-visible:ring-warning-500",
        danger: "bg-transparent text-danger-700 hover:bg-danger-500/20 focus-visible:ring-danger-500",
    },
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        className,
        variant = "solid",
        variantColor = "primary",
        size = "md",
        type = "button",
        ...props
    },
    ref,
) {
    const classes = cn(baseStyles, variants[variant][variantColor], sizeStyles[size], className);

    return <button ref={ref} type={type} className={classes} {...props} />;
});
