import * as React from "react";

import { cn } from "../../lib/cn";
import {
    type ControlSize,
    controlAnimations,
    controlColorClasses,
    controlRadius,
} from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { describedById, ToggleField } from "../shared/ToggleField";
import type { CheckboxProps } from "./types";

const boxSize: Record<ControlSize, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
        className,
        variantColor = "primary",
        customColor,
        size = "md",
        radius = "sm",
        animation = "smooth",
        label,
        helperText,
        errorMessage,
        indeterminate = false,
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
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
        if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

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
                    ref={innerRef}
                    id={inputId}
                    type="checkbox"
                    disabled={disabled}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedById(inputId, helperText, errorMessage)}
                    className="peer absolute inset-0 m-0 h-full w-full cursor-[inherit] opacity-0"
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 border border-[var(--vpd-border-strong)] bg-[var(--vpd-surface)]",
                        controlRadius[radius],
                        controlAnimations[animation],
                        controlColorClasses(variantColor, Boolean(customColor), hasError),
                    )}
                />
                <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
                >
                    <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 text-white opacity-0 peer-indeterminate:opacity-100"
                >
                    <path d="M4 8h8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
            </span>
        </ToggleField>
    );
});
