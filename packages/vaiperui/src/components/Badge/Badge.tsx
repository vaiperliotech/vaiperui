import * as React from "react";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { customTint, neutralTint, pillSizes, tints } from "./consts";
import type { BadgeProps, BadgeStatus } from "./types";

const statusClasses: Record<BadgeStatus, string> = {
    success: tints.success,
    error: tints.danger,
    warning: tints.warning,
    info: tints.primary,
    neutral: neutralTint,
    pending: `${neutralTint} border-dashed`,
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
        className,
        status = "neutral",
        dot = false,
        size = "md",
        radius = "full",
        customColor,
        style,
        children,
        ...props
    },
    ref,
) {
    return (
        <span
            {...props}
            ref={ref}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(
                "inline-flex items-center border font-medium whitespace-nowrap",
                pillSizes[size],
                controlRadius[radius],
                customColor ? customTint : statusClasses[status],
                className,
            )}
        >
            {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
});
