import * as React from "react";

import { cn } from "../../lib/cn";
import { customColorVars } from "../../lib/customColorVars";
import { accentOf } from "../Tabs/consts/accent";
import type { BreadcrumbItemProps, BreadcrumbProps } from "./types";

const AccentContext = React.createContext({ link: "", ring: "" });

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

export function Breadcrumb({
    separator = "/",
    maxItems,
    expandLabel = "Show hidden items",
    variantColor = "primary",
    customColor,
    size = "md",
    className,
    style,
    children,
    "aria-label": ariaLabel = "Breadcrumb",
    ...props
}: BreadcrumbProps) {
    const [expanded, setExpanded] = React.useState(false);
    const accent = accentOf(variantColor, Boolean(customColor));
    const items = React.Children.toArray(children);
    const collapsed =
        !expanded && maxItems !== undefined && maxItems >= 2 && items.length > maxItems;
    // First item, then an ellipsis standing in for the middle, then the last `maxItems - 1`.
    const visible: React.ReactNode[] = collapsed
        ? [
              items[0],
              <button
                  key="ellipsis"
                  type="button"
                  aria-label={expandLabel}
                  onClick={() => setExpanded(true)}
                  className={cn(
                      "cursor-pointer rounded px-1 text-[var(--vpd-text-muted)] outline-none hover:text-[var(--vpd-text)]",
                      accent.ring,
                  )}
              >
                  …
              </button>,
              ...items.slice(items.length - (maxItems - 1)),
          ]
        : items;

    return (
        <nav
            aria-label={ariaLabel}
            {...props}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(textSize[size], className)}
        >
            <AccentContext.Provider
                value={{
                    link: cn(
                        "rounded text-[var(--vpd-text-muted)] outline-none transition-colors",
                        customColor
                            ? "hover:text-[var(--vpd-accent)]"
                            : "hover:text-[var(--vpd-text)]",
                        "hover:underline",
                    ),
                    ring: accent.ring,
                }}
            >
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {visible.map((item, index) => (
                        <li
                            key={React.isValidElement(item) && item.key !== null ? item.key : index}
                            className="inline-flex items-center gap-2"
                        >
                            {item}
                            {index < visible.length - 1 ? (
                                <span
                                    aria-hidden="true"
                                    className="text-[var(--vpd-text-placeholder)]"
                                >
                                    {separator}
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </AccentContext.Provider>
        </nav>
    );
}

export function BreadcrumbItem({
    current = false,
    asChild = false,
    className,
    children,
    ...props
}: BreadcrumbItemProps) {
    const { link, ring } = React.useContext(AccentContext);

    if (current) {
        return (
            <span
                aria-current="page"
                className={cn("font-medium text-[var(--vpd-text)]", className)}
            >
                {children}
            </span>
        );
    }
    if (asChild && React.isValidElement<{ className?: string }>(children)) {
        return React.cloneElement(children, {
            className: cn(link, ring, className, children.props.className),
        });
    }
    if (!props.href)
        return <span className={cn("text-[var(--vpd-text-muted)]", className)}>{children}</span>;
    return (
        <a {...props} className={cn(link, ring, className)}>
            {children}
        </a>
    );
}
