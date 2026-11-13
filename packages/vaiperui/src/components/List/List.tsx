import * as React from "react";

import { cn } from "../../lib/cn";
import type { ListItemProps, ListProps } from "./types";

export const List = React.forwardRef<HTMLUListElement, ListProps>(function List(
    { className, divided = false, ...props },
    ref,
) {
    return (
        <ul
            {...props}
            ref={ref}
            className={cn(
                "m-0 list-none p-0",
                divided && "divide-y divide-[var(--vpd-border-soft)]",
                className,
            )}
        />
    );
});

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
    { className, title, description, leading, trailing, children, ...props },
    ref,
) {
    return (
        <li
            {...props}
            ref={ref}
            className={cn("flex items-center gap-3 py-3 text-[var(--vpd-text)]", className)}
        >
            {leading && <div className="shrink-0">{leading}</div>}
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{title}</div>
                {description && (
                    <div className="text-sm text-[var(--vpd-text-muted)]">{description}</div>
                )}
                {children}
            </div>
            {trailing && <div className="shrink-0">{trailing}</div>}
        </li>
    );
});
