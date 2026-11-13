import * as React from "react";

import { cn } from "../../lib/cn";
import { type ControlSize, controlAnimations, controlColorClasses } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { describedById, ToggleField } from "../shared/ToggleField";
import type { RadioProps } from "./types";

const boxSize: Record<ControlSize, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
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
    const hasError =
        Boolean(errorMessage) || props["aria-invalid"] === true || props["aria-invalid"] === "true";

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
                className={cn("relative mt-0.5 inline-flex shrink-0", boxSize[size])}
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
            >
                <input
                    {...props}
                    aria-invalid={hasError || undefined}
                    ref={ref}
                    id={inputId}
                    type="radio"
                    disabled={disabled}
                    aria-describedby={describedById(inputId, helperText, errorMessage)}
                    className="peer absolute inset-0 m-0 h-full w-full cursor-[inherit] opacity-0"
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-full border border-[var(--vpd-border-strong)] bg-[var(--vpd-surface)]",
                        controlAnimations[animation],
                        controlColorClasses(variantColor, Boolean(customColor), hasError),
                    )}
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 m-auto h-2/5 w-2/5 scale-0 rounded-full bg-white peer-checked:scale-100",
                        controlAnimations[animation],
                    )}
                />
            </span>
        </ToggleField>
    );
});
