import * as React from "react";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import type { SkeletonProps, SkeletonVariant } from "./types";

const variants: Record<SkeletonVariant, string> = {
    text: "h-3 w-full rounded",
    title: "h-5 w-full rounded",
    avatar: "h-10 w-10 shrink-0 rounded-full",
    rectangle: "h-6 w-full rounded-lg",
    card: "h-[120px] w-full rounded-lg",
};

/** Decorative placeholder (`aria-hidden`): set `aria-busy` on the container that holds it while loading. */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
    {
        className,
        variant = "text",
        lines = 1,
        width,
        height,
        radius,
        animation = "pulse",
        style,
        ...props
    },
    ref,
) {
    const shape = cn(
        "bg-[var(--vpd-surface-hover)]",
        variants[variant],
        radius && controlRadius[radius],
        animation === "pulse" && "animate-pulse motion-reduce:animate-none",
    );

    if (variant === "text" && lines > 1) {
        return (
            <div
                {...props}
                ref={ref}
                aria-hidden="true"
                className={cn("flex flex-col gap-2", className)}
                style={style}
            >
                {Array.from({ length: lines }, (_, i) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder lines never reorder
                        key={i}
                        className={shape}
                        style={{ width: width ?? (i === lines - 1 ? "60%" : undefined), height }}
                    />
                ))}
            </div>
        );
    }
    return (
        <div
            {...props}
            ref={ref}
            aria-hidden="true"
            className={cn(shape, className)}
            style={{ width, height, ...style }}
        />
    );
});
