import * as React from "react";

import { cn } from "../../lib/cn";
import type { ControlSize } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { CloseButton, iconNode, roleOf, toneOf } from "../Alert/shared";
import type { BannerProps } from "./types";

const sizes: Record<ControlSize, string> = {
    sm: "gap-2 px-3 py-1.5 text-xs",
    md: "gap-3 px-4 py-2.5 text-sm",
    lg: "gap-3 px-5 py-3 text-base",
};

/** Full-width page-level message: no radius and only a bottom border. Place it at the top of the page. */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner(
    {
        className,
        variantColor = "primary",
        customColor,
        size = "md",
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
                "flex w-full items-center border-0 border-b text-[var(--vpd-text)]",
                sizes[size],
                tone.box,
                className,
            )}
        >
            {iconNode(icon, variantColor, tone.icon)}
            <div className="min-w-0 flex-1">{children}</div>
            {action ? <div className="shrink-0">{action}</div> : null}
            {onDismiss ? <CloseButton label={dismissLabel} onClick={onDismiss} /> : null}
        </div>
    );
});
