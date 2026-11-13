import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { customVariantStyles, errorStyles, variantStyles } from "../Input/consts/variants";
import type { TextareaProps, TextareaSize } from "./types";

const baseStyles =
    "w-full border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-[var(--vpd-text)] placeholder:text-[var(--vpd-text-placeholder)] disabled:cursor-not-allowed disabled:bg-[var(--vpd-surface-muted)] disabled:text-[var(--vpd-text-muted)]";

const sizeStyles: Record<TextareaSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    {
        className,
        variant = "ring",
        variantColor = "primary",
        customColor,
        size = "md",
        radius = "md",
        animation = "smooth",
        resize = "vertical",
        label,
        helperText,
        errorMessage,
        id,
        rows = 3,
        style,
        ...props
    },
    ref,
) {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const hasError = Boolean(errorMessage);
    const focusStyles = hasError
        ? errorStyles[variant]
        : customColor
          ? customVariantStyles[variant]
          : variantStyles[variant][variantColor];
    const describedBy = errorMessage
        ? `${textareaId}-error`
        : helperText
          ? `${textareaId}-helper`
          : undefined;

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label ? (
                <label
                    htmlFor={textareaId}
                    className={cn(
                        "text-sm font-medium text-[var(--vpd-text-secondary)]",
                        props.disabled && "cursor-not-allowed opacity-50",
                    )}
                >
                    {label}
                </label>
            ) : null}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                aria-invalid={hasError || undefined}
                aria-describedby={describedBy}
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
                className={cn(
                    baseStyles,
                    focusStyles,
                    sizeStyles[size],
                    controlRadius[radius],
                    controlAnimations[animation],
                    resizeStyles[resize],
                    className,
                )}
                {...props}
            />
            {errorMessage ? (
                <span
                    id={`${textareaId}-error`}
                    className="text-xs text-danger-600 dark:text-danger-400"
                >
                    {errorMessage}
                </span>
            ) : helperText ? (
                <span id={`${textareaId}-helper`} className="text-xs text-[var(--vpd-text-muted)]">
                    {helperText}
                </span>
            ) : null}
        </div>
    );
});
