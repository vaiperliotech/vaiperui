import * as React from "react";

import { cn } from "../../lib/cn";
import { alignClasses, directionClasses, gapClasses, justifyClasses } from "./consts/classes";
import type { StackBreakpoint, StackProps } from "./types";

export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(
    {
        as: Component = "div",
        direction = "vertical",
        gap = 4,
        align,
        justify,
        wrap,
        divider,
        className,
        children,
        ...props
    },
    ref,
) {
    const dirs = typeof direction === "string" ? { base: direction } : direction;
    const dirClass = (Object.keys(dirs) as StackBreakpoint[]).map((bp) => {
        const d = dirs[bp];
        return d && directionClasses[bp][d];
    });
    const items = divider ? React.Children.toArray(children) : children;

    return (
        <Component
            {...props}
            ref={ref}
            className={cn(
                "flex",
                dirClass,
                gapClasses[gap],
                align && alignClasses[align],
                justify && justifyClasses[justify],
                wrap && "flex-wrap",
                className,
            )}
        >
            {divider && Array.isArray(items)
                ? items.map((child, i) => (
                      <React.Fragment key={React.isValidElement(child) ? child.key : i}>
                          {i > 0 && divider}
                          {child}
                      </React.Fragment>
                  ))
                : items}
        </Component>
    );
});
