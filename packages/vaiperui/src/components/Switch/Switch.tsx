import * as React from "react";

import { cn } from "../../lib/cn";
import { type ControlSize, controlAnimations, controlColorClasses } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { describedById, ToggleField } from "../shared/ToggleField";
import type { SwitchProps } from "./types";

const sizes: Record<ControlSize, { track: string; thumb: string }> = {
    sm: { track: "h-5 w-9", thumb: "h-4 w-4 peer-checked:translate-x-4" },
    md: { track: "h-6 w-11", thumb: "h-5 w-5 peer-checked:translate-x-5" },
    lg: { track: "h-7 w-14", thumb: "h-6 w-6 peer-checked:translate-x-7" },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
    {
        className,
        variantColor = "primary",
        customColor,
        size = "md",
        animation = "smooth",
        label,
        helperText,
        errorMessage,
        id,
        disabled,
        style,
        ...props
    },
    ref,
) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(errorMessage);

    return (
        <ToggleField
            id={inputId}
            size={size}
            label={label}
            helperText={helperText}
            errorMessage={errorMessage}
            disabled={disabled}
            className={className}
        >
            <span
                className={cn("relative mt-0.5 inline-flex shrink-0", sizes[size].track)}
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
            >
                <input
                    {...props}
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    // biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox already exposes its checked state to role="switch"
                    role="switch"
                    disabled={disabled}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedById(inputId, helperText, errorMessage)}
                    className="peer absolute inset-0 m-0 h-full w-full cursor-[inherit] opacity-0"
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-full border border-transparent bg-[var(--vpd-border-strong)]",
                        controlAnimations[animation],
                        controlColorClasses(variantColor, Boolean(customColor), hasError),
                        hasError && "bg-danger-500/40",
                    )}
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm",
                        controlAnimations[animation],
                        sizes[size].thumb,
                    )}
                />
            </span>
        </ToggleField>
    );
});
