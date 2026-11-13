import * as React from "react";

import { cn } from "../../lib/cn";
import { type ControlSize, controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { customTint, neutralTint, tints } from "../Badge/consts";
import type { AvatarProps } from "./types";

const sizes: Record<ControlSize, string> = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
};

function initials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] ?? "";
    const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
    {
        className,
        name,
        src,
        size = "md",
        radius = "full",
        variantColor,
        customColor,
        style,
        ...props
    },
    ref,
) {
    const [failed, setFailed] = React.useState<string | undefined>();
    const showImage = Boolean(src) && failed !== src;
    const tint = customColor ? customTint : variantColor ? tints[variantColor] : neutralTint;

    return (
        <span
            {...props}
            ref={ref}
            role="img"
            aria-label={name}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(
                "inline-flex shrink-0 items-center justify-center overflow-hidden border font-semibold select-none",
                sizes[size],
                controlRadius[radius],
                tint,
                className,
            )}
        >
            {showImage ? (
                // biome-ignore lint/performance/noImgElement: framework-agnostic library, no next/image available
                <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setFailed(src)}
                />
            ) : (
                <span aria-hidden="true">{initials(name)}</span>
            )}
        </span>
    );
});
