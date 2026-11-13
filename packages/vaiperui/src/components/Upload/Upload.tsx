import * as React from "react";

import { cn } from "../../lib/cn";
import {
    type ControlColors,
    type ControlSize,
    controlAnimations,
    controlRadius,
    focusColors,
} from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import type { UploadProps } from "./types";

const activeColors: Record<ControlColors, string> = {
    primary: "border-primary-500 bg-primary-500/5",
    success: "border-success-500 bg-success-500/5",
    warning: "border-warning-500 bg-warning-500/5",
    danger: "border-danger-500 bg-danger-500/5",
};
const hoverColors: Record<ControlColors, string> = {
    primary: "hover:border-primary-500 hover:bg-primary-500/5",
    success: "hover:border-success-500 hover:bg-success-500/5",
    warning: "hover:border-warning-500 hover:bg-warning-500/5",
    danger: "hover:border-danger-500 hover:bg-danger-500/5",
};
const customActive = "border-[var(--vpd-accent)] bg-[var(--vpd-accent-tint)]";
const customHover = "hover:border-[var(--vpd-accent)] hover:bg-[var(--vpd-accent-tint)]";
const customFocus = "peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--vpd-accent-ring)]";

const paddings: Record<ControlSize, string> = {
    sm: "gap-1 p-4",
    md: "gap-1.5 p-6",
    lg: "gap-2 p-10",
};
const iconSizes: Record<ControlSize, string> = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };

/** Does `file` match an `accept` string (`.pdf`, `image/*`, `image/png`, comma-separated)? */
function matchesAccept(file: File, accept?: string): boolean {
    const tokens = accept
        ?.split(",")
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);
    if (!tokens?.length) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return tokens.some((token) => {
        if (token.startsWith(".")) return name.endsWith(token);
        if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
        return type === token;
    });
}

export const Upload = React.forwardRef<HTMLInputElement, UploadProps>(function Upload(
    {
        onFilesChange,
        title = "Drag files here or click to choose",
        description,
        accept,
        multiple = false,
        label,
        helperText,
        errorMessage,
        variantColor = "primary",
        customColor,
        size = "md",
        radius = "lg",
        animation = "smooth",
        disabled = false,
        id,
        className,
        style,
        ...props
    },
    ref,
) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(errorMessage);
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const [dragging, setDragging] = React.useState(false);
    // dragenter/dragleave also fire for the children of the area: count them to know when it really left.
    const depth = React.useRef(0);

    const describedBy = errorMessage
        ? `${inputId}-error`
        : helperText
          ? `${inputId}-helper`
          : undefined;
    const color = hasError ? "danger" : variantColor;
    const useCustom = Boolean(customColor) && !hasError;

    function emit(files: File[]) {
        const accepted = files.filter((file) => matchesAccept(file, accept));
        const kept = multiple ? accepted : accepted.slice(0, 1);
        if (kept.length > 0) onFilesChange(kept);
        return kept;
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        emit(Array.from(event.target.files ?? []));
        // Clear it so choosing the same file again fires a change.
        event.target.value = "";
    }

    function handleDrop(event: React.DragEvent) {
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        if (disabled) return;
        const kept = emit(Array.from(event.dataTransfer.files));
        // Mirror the dropped files into the input so a native <form> submits them too.
        if (kept.length > 0 && inputRef.current && typeof DataTransfer !== "undefined") {
            const transfer = new DataTransfer();
            for (const file of kept) transfer.items.add(file);
            inputRef.current.files = transfer.files;
        }
    }

    return (
        <div className={cn("flex w-full flex-col gap-1.5", className)}>
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
            <div
                className="relative"
                style={customColor ? { ...customColorVars(customColor), ...style } : style}
            >
                <input
                    {...props}
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    name={props.name}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                    className="peer sr-only"
                />
                <label
                    htmlFor={inputId}
                    data-dragging={dragging || undefined}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        depth.current += 1;
                        if (!disabled) setDragging(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => {
                        depth.current -= 1;
                        if (depth.current <= 0) setDragging(false);
                    }}
                    onDrop={handleDrop}
                    className={cn(
                        "flex flex-col items-center justify-center border-2 border-dashed text-center text-[var(--vpd-text)]",
                        paddings[size],
                        controlRadius[radius],
                        controlAnimations[animation],
                        disabled
                            ? "cursor-not-allowed opacity-50"
                            : cn("cursor-pointer", useCustom ? customHover : hoverColors[color]),
                        dragging && !disabled
                            ? useCustom
                                ? customActive
                                : activeColors[color]
                            : hasError
                              ? "border-danger-500"
                              : "border-[var(--vpd-border-strong)]",
                        useCustom ? customFocus : focusColors[color],
                    )}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={cn("text-[var(--vpd-text-placeholder)]", iconSizes[size])}
                    >
                        <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
                    </svg>
                    <span className={cn("font-medium", size === "lg" ? "text-base" : "text-sm")}>
                        {title}
                    </span>
                    {description ? (
                        <span className="text-xs text-[var(--vpd-text-muted)]">{description}</span>
                    ) : null}
                </label>
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
