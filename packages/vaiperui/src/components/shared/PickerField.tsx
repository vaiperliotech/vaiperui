import * as React from "react";

import { cn } from "../../lib/cn";
import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { type CustomColor, customColorVars } from "../../lib/customColorVars";
import { sizeStyles } from "../Input/consts/sizes";
import { customVariantStyles, errorStyles, variantStyles } from "../Input/consts/variants";
import { Popover } from "./Popover";

export interface PickerStyleProps {
    variant?: "ring" | "outline";
    variantColor?: ControlColors;
    customColor?: CustomColor;
    size?: ControlSize;
    radius?: ControlRadius;
    animation?: ControlAnimation;
}

export interface PickerFieldProps extends PickerStyleProps {
    id?: string;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    "aria-label"?: string;
    /** What the trigger shows; the placeholder is shown when empty. */
    text?: string;
    placeholder: string;
    icon: "calendar" | "clock";
    /** One hidden `<input>` per entry, so the value is submitted with a `<form>`. */
    hiddenInputs?: Array<{ name?: string; value: string }>;
    /** Accessible name of the panel. */
    panelLabel: string;
    children: (api: { close: () => void }) => React.ReactNode;
}

const icons = {
    calendar: (
        <>
            <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
            <path d="M3 8.5h14M7 3v3M13 3v3" />
        </>
    ),
    clock: (
        <>
            <circle cx="10" cy="10" r="7" />
            <path d="M10 6v4l2.5 1.5" />
        </>
    ),
};

/** Label + trigger button that looks like an Input + popover, shared by every date/time picker. */
export function PickerField({
    id,
    label,
    helperText,
    errorMessage,
    disabled = false,
    readOnly = false,
    className,
    "aria-label": ariaLabel,
    text,
    placeholder,
    icon,
    hiddenInputs,
    panelLabel,
    children,
    variant = "ring",
    variantColor = "primary",
    customColor,
    size = "md",
    radius = "md",
    animation = "smooth",
}: PickerFieldProps) {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const hasError = Boolean(errorMessage);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    const close = React.useCallback((restoreFocus: boolean) => {
        setOpen(false);
        if (restoreFocus) triggerRef.current?.focus();
    }, []);

    const focusStyles = hasError
        ? errorStyles[variant]
        : customColor
          ? customVariantStyles[variant]
          : variantStyles[variant][variantColor];
    const describedBy = errorMessage
        ? `${fieldId}-error`
        : helperText
          ? `${fieldId}-helper`
          : undefined;

    return (
        <div
            className={cn("flex w-full flex-col gap-1.5", className)}
            style={customColor ? customColorVars(customColor) : undefined}
        >
            {label ? (
                <label
                    htmlFor={fieldId}
                    className={cn(
                        "text-sm font-medium text-[var(--vpd-text-secondary)]",
                        disabled && "cursor-not-allowed opacity-50",
                    )}
                >
                    {label}
                </label>
            ) : null}
            <button
                ref={triggerRef}
                id={fieldId}
                type="button"
                disabled={disabled}
                aria-label={label ? undefined : ariaLabel}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-invalid={hasError || undefined}
                aria-describedby={describedBy}
                onClick={() => !readOnly && setOpen((o) => !o)}
                className={cn(
                    "flex w-full items-center justify-between gap-2 border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-left text-[var(--vpd-text)] disabled:cursor-not-allowed disabled:bg-[var(--vpd-surface-muted)] disabled:text-[var(--vpd-text-muted)]",
                    focusStyles,
                    sizeStyles[size],
                    controlRadius[radius],
                    controlAnimations[animation],
                    !readOnly && !disabled && "cursor-pointer",
                )}
            >
                <span className={cn("truncate", !text && "text-[var(--vpd-text-placeholder)]")}>
                    {text || placeholder}
                </span>
                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--vpd-text-placeholder)]"
                >
                    {icons[icon]}
                </svg>
            </button>
            {hiddenInputs?.map((input, i) =>
                input.name ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional and fixed per picker
                    <input key={i} type="hidden" name={input.name} value={input.value} />
                ) : null,
            )}
            <Popover open={open} onClose={close} anchorRef={triggerRef} label={panelLabel}>
                {children({ close: () => close(true) })}
            </Popover>
            {errorMessage ? (
                <span
                    id={`${fieldId}-error`}
                    className="text-xs text-danger-600 dark:text-danger-400"
                >
                    {errorMessage}
                </span>
            ) : helperText ? (
                <span id={`${fieldId}-helper`} className="text-xs text-[var(--vpd-text-muted)]">
                    {helperText}
                </span>
            ) : null}
        </div>
    );
}
