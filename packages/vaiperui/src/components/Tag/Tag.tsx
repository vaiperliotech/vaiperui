import * as React from "react";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { customTint, neutralTint, pillSizes, tints } from "../Badge/consts";
import type { TagProps } from "./types";

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
    {
        className,
        variant = "filled",
        variantColor,
        size = "md",
        radius = "md",
        customColor,
        onDismiss,
        dismissLabel = "Remove",
        style,
        children,
        ...props
    },
    ref,
) {
    const tint = customColor ? customTint : variantColor ? tints[variantColor] : neutralTint;

    return (
        <span
            {...props}
            ref={ref}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(
                "inline-flex items-center border font-medium",
                pillSizes[size],
                controlRadius[radius],
                tint,
                variant === "outline" && "bg-transparent",
                className,
            )}
        >
            {children}
            {onDismiss && (
                <button
                    type="button"
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                    className="-mr-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-current"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                </button>
            )}
        </span>
    );
});
