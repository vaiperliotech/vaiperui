import * as React from "react";

import { cn } from "../../lib/cn";
import { gapClasses } from "../Stack/consts/classes";
import { colSpan, gridColumns, rowSpan } from "./consts/classes";
import type { GridBreakpoint, GridItemProps, GridProps } from "./types";

export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(
    { as: Component = "div", columns = 1, gap = 4, className, ...props },
    ref,
) {
    const cols = typeof columns === "number" ? { base: columns } : columns;
    const colClass = (Object.keys(cols) as GridBreakpoint[]).map((bp) => {
        const n = cols[bp];
        return n && gridColumns[bp][n];
    });

    return (
        <Component
            {...props}
            ref={ref}
            className={cn("grid", colClass, gapClasses[gap], className)}
        />
    );
});

export const GridItem = React.forwardRef<HTMLElement, GridItemProps>(function GridItem(
    { as: Component = "div", colSpan: cs, rowSpan: rs, className, ...props },
    ref,
) {
    return (
        <Component
            {...props}
            ref={ref}
            className={cn(cs && colSpan[cs], rs && rowSpan[rs], className)}
        />
    );
});
