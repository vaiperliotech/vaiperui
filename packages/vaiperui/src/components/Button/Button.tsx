import * as React from "react";

import { cn } from "../../lib/cn";

export type ButtonVariant = "default" | "primary" | "success" | "warning" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
    default: "bg-default-500 text-white hover:bg-default-600 focus-visible:ring-default-500",
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
    success: "bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500",
    warning: "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500",
    danger: "bg-danger-500 text-white hover:bg-danger-700 focus-visible:ring-danger-500",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
) {
    const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    return <button ref={ref} type={type} className={classes} {...props} />;
});
