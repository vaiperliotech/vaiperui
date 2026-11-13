import * as React from "react";

import { cn } from "../../lib/cn";
import { type ControlSize, controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { CloseButton, iconNode, roleOf, toneOf } from "./shared";
import type { AlertProps } from "./types";

const sizes: Record<ControlSize, string> = {
    sm: "gap-2 p-3 text-xs",
    md: "gap-3 p-4 text-sm",
    lg: "gap-3 p-5 text-base",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    {
        className,
        variantColor = "primary",
        customColor,
        size = "md",
        radius = "lg",
        title,
        icon,
        action,
        onDismiss,
        dismissLabel = "Dismiss",
        children,
        style,
        ...props
    },
    ref,
) {
    const tone = toneOf(variantColor, Boolean(customColor));

    return (
        <div
            role={roleOf(variantColor)}
            {...props}
            ref={ref}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(
                "flex items-start border text-[var(--vpd-text)]",
                sizes[size],
                controlRadius[radius],
                tone.box,
                className,
            )}
        >
            {iconNode(icon, variantColor, tone.icon)}
            <div className="min-w-0 flex-1">
                {title ? <div className="font-semibold">{title}</div> : null}
                {children ? (
                    <div className={cn(title && "text-[var(--vpd-text-secondary)]")}>
                        {children}
                    </div>
                ) : null}
                {action ? <div className="mt-2">{action}</div> : null}
            </div>
            {onDismiss ? <CloseButton label={dismissLabel} onClick={onDismiss} /> : null}
        </div>
    );
});
