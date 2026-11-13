import * as React from "react";

import { cn } from "../../lib/cn";
import { Radio } from "./Radio";
import type { RadioGroupProps } from "./types";

export function RadioGroup({
    options,
    value,
    defaultValue,
    onValueChange,
    name,
    label,
    helperText,
    errorMessage,
    orientation = "vertical",
    variantColor,
    customColor,
    size,
    animation,
    disabled,
    className,
}: RadioGroupProps) {
    const generatedName = React.useId();
    const groupName = name ?? generatedName;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const current = value !== undefined ? value : uncontrolled;
    const hasError = Boolean(errorMessage);
    const describedBy = errorMessage
        ? `${groupName}-error`
        : helperText
          ? `${groupName}-helper`
          : undefined;

    return (
        <fieldset
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn("flex min-w-0 flex-col gap-2 border-0 p-0", className)}
        >
            {label ? (
                <legend className="mb-1 text-sm font-medium text-[var(--vpd-text-secondary)]">
                    {label}
                </legend>
            ) : null}
            <div
                role="radiogroup"
                aria-label={label}
                className={cn(
                    "flex gap-x-6 gap-y-2",
                    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
                )}
            >
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        name={groupName}
                        value={option.value}
                        label={option.label}
                        helperText={option.description}
                        disabled={option.disabled}
                        checked={current === option.value}
                        onChange={() => {
                            if (value === undefined) setUncontrolled(option.value);
                            onValueChange?.(option.value);
                        }}
                        variantColor={variantColor}
                        customColor={customColor}
                        size={size}
                        animation={animation}
                        // The message shows once under the group; each radio only takes the error color.
                        aria-invalid={hasError || undefined}
                    />
                ))}
            </div>
            {errorMessage ? (
                <span
                    id={`${groupName}-error`}
                    className="text-xs text-danger-600 dark:text-danger-400"
                >
                    {errorMessage}
                </span>
            ) : helperText ? (
                <span id={`${groupName}-helper`} className="text-xs text-[var(--vpd-text-muted)]">
                    {helperText}
                </span>
            ) : null}
        </fieldset>
    );
}
