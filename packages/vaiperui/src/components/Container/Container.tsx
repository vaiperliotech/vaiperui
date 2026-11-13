import * as React from "react";

import { cn } from "../../lib/cn";
import type { ContainerProps, ContainerSize } from "./types";

const sizes: Record<ContainerSize, string> = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
};

export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container(
    { as: Component = "div", size = "lg", padded = true, className, ...props },
    ref,
) {
    return (
        <Component
            {...props}
            ref={ref}
            className={cn(
                "mx-auto w-full",
                sizes[size],
                padded && "px-4 sm:px-6 lg:px-8",
                className,
            )}
        />
    );
});
