import * as React from "react";

import { cn } from "../../lib/cn";
import { customColorVars } from "../../lib/customColorVars";
import { animations } from "./consts/animations";
import { radiusStyles } from "./consts/radius";
import { sizeStyles } from "./consts/sizes";
import { customVariantStyles, errorStyles, variantStyles } from "./consts/variants";
import { applyMask, filterByRegex, MASK_DIGIT_LIMIT, MASK_PLACEHOLDER, onlyDigits } from "./mask";
import type { InputProps } from "./types";

const baseStyles =
    "w-full border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-[var(--vpd-text)] placeholder:text-[var(--vpd-text-placeholder)] disabled:cursor-not-allowed disabled:bg-[var(--vpd-surface-muted)] disabled:text-[var(--vpd-text-muted)]";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        className,
        variant = "ring",
        variantColor = "primary",
        customColor,
        size = "md",
        radius = "md",
        animation = "smooth",
        label,
        helperText,
        errorMessage,
        leadingIcon,
        trailingIcon,
        mask,
        maskRegex,
        maskFormat,
        id,
        disabled,
        value,
        defaultValue,
        onChange,
        placeholder,
        style,
        ...props
    },
    ref,
) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(errorMessage);
    const focusStyles = hasError
        ? errorStyles[variant]
        : customColor
          ? customVariantStyles[variant]
          : variantStyles[variant][variantColor];
    const describedBy = errorMessage
        ? `${inputId}-error`
        : helperText
          ? `${inputId}-helper`
          : undefined;

    const isMaskControlled = mask !== undefined && value !== undefined;
    // `raw` is what the mask keeps from the text (digits, or regex-matching chars for "custom").
    const sanitize = (text: string) =>
        mask === "custom"
            ? maskRegex
                ? filterByRegex(text, maskRegex)
                : text
            : mask
              ? onlyDigits(text)
              : "";
    const format = (raw: string) =>
        mask === "custom" ? (maskFormat?.(raw) ?? raw) : mask ? applyMask(raw, mask) : raw;
    const [rawState, setRawState] = React.useState(() =>
        mask ? sanitize(String(defaultValue ?? value ?? "")) : "",
    );
    const raw = mask ? (isMaskControlled ? sanitize(String(value)) : rawState) : "";
    const maskedValue = mask ? format(raw) : undefined;

    function handleMaskedChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!mask) return;
        const input = event.target;
        const cursorFromEnd = input.value.length - (input.selectionEnd ?? input.value.length);
        const sanitized = sanitize(input.value);
        const nextRaw = mask === "custom" ? sanitized : sanitized.slice(0, MASK_DIGIT_LIMIT[mask]);
        const nextMasked = format(nextRaw);
        input.value = nextMasked;
        const nextPos = Math.max(0, nextMasked.length - cursorFromEnd);
        input.setSelectionRange(nextPos, nextPos);
        if (!isMaskControlled) setRawState(nextRaw);
        onChange?.(event);
    }

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label ? (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium text-[var(--vpd-text-secondary)]",
                        disabled && "cursor-not-allowed opacity-50",
                    )}
                >
                    {label}
                </label>
            ) : null}
            <div className="relative flex items-center">
                {leadingIcon ? (
                    <span className="pointer-events-none absolute left-3 flex items-center text-[var(--vpd-text-placeholder)]">
                        {leadingIcon}
                    </span>
                ) : null}
                <input
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                    style={customColor ? { ...customColorVars(customColor), ...style } : style}
                    className={cn(
                        baseStyles,
                        focusStyles,
                        sizeStyles[size],
                        radiusStyles[radius],
                        animations[animation],
                        leadingIcon && "pl-9",
                        trailingIcon && "pr-9",
                        className,
                    )}
                    placeholder={
                        placeholder ??
                        (mask && mask !== "custom" ? MASK_PLACEHOLDER[mask] : undefined)
                    }
                    inputMode={mask && mask !== "custom" ? "numeric" : undefined}
                    value={mask ? maskedValue : value}
                    defaultValue={mask ? undefined : defaultValue}
                    onChange={mask ? handleMaskedChange : onChange}
                    {...props}
                />
                {trailingIcon ? (
                    <span className="pointer-events-none absolute right-3 flex items-center text-[var(--vpd-text-placeholder)]">
                        {trailingIcon}
                    </span>
                ) : null}
            </div>
            {errorMessage ? (
                <span
                    id={`${inputId}-error`}
                    className="text-xs text-danger-600 dark:text-danger-400"
                >
                    {errorMessage}
                </span>
            ) : helperText ? (
                <span id={`${inputId}-helper`} className="text-xs text-[var(--vpd-text-muted)]">
                    {helperText}
                </span>
            ) : null}
        </div>
    );
});
