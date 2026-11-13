import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import type { ControlSize } from "../../lib/controlStyles";

const textSize: Record<ControlSize, string> = { sm: "text-sm", md: "text-sm", lg: "text-base" };

export function describedById(id: string, helperText?: string, errorMessage?: string) {
    return errorMessage ? `${id}-error` : helperText ? `${id}-helper` : undefined;
}

/** Label, helper and error text around a checkbox, radio or switch. The label wraps the control, so the whole row is clickable. */
export function ToggleField({
    id,
    size,
    label,
    helperText,
    errorMessage,
    disabled,
    className,
    children,
}: {
    id: string;
    size: ControlSize;
    label?: ReactNode;
    helperText?: string;
    errorMessage?: string;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: the input is passed in as children */}
            <label
                className={cn(
                    "inline-flex items-start gap-2.5 self-start",
                    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                )}
            >
                {children}
                {label || (helperText && !errorMessage) ? (
                    <span className="flex flex-col">
                        {label ? (
                            <span
                                className={cn("font-medium text-[var(--vpd-text)]", textSize[size])}
                            >
                                {label}
                            </span>
                        ) : null}
                        {helperText && !errorMessage ? (
                            <span
                                id={`${id}-helper`}
                                className="text-xs text-[var(--vpd-text-muted)]"
                            >
                                {helperText}
                            </span>
                        ) : null}
                    </span>
                ) : null}
            </label>
            {errorMessage ? (
                <span id={`${id}-error`} className="text-xs text-danger-600 dark:text-danger-400">
                    {errorMessage}
                </span>
            ) : null}
        </div>
    );
}
