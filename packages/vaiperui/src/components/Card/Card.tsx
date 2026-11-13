import * as React from "react";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import type {
    CardBodyProps,
    CardFooterProps,
    CardHeaderProps,
    CardPadding,
    CardProps,
} from "./types";

const paddings: Record<CardPadding, string> = { none: "p-0", md: "p-4", lg: "p-6" };

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
    { className, padding = "md", radius = "lg", ...props },
    ref,
) {
    return (
        <div
            {...props}
            ref={ref}
            className={cn(
                "border border-[var(--vpd-border)] bg-[var(--vpd-surface)] text-[var(--vpd-text)] shadow-sm",
                paddings[padding],
                controlRadius[radius],
                className,
            )}
        />
    );
});

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
    { className, ...props },
    ref,
) {
    return (
        <div
            {...props}
            ref={ref}
            className={cn(
                "mb-3 border-b border-[var(--vpd-border-soft)] pb-3 font-semibold",
                className,
            )}
        />
    );
});

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
    { className, ...props },
    ref,
) {
    return (
        <div
            {...props}
            ref={ref}
            className={cn("text-sm text-[var(--vpd-text-secondary)]", className)}
        />
    );
});

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
    { className, ...props },
    ref,
) {
    return (
        <div
            {...props}
            ref={ref}
            className={cn(
                "mt-3 flex items-center gap-2 border-t border-[var(--vpd-border-soft)] pt-3",
                className,
            )}
        />
    );
});
