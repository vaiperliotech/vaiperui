import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { ControlColors } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type BreadcrumbColors = ControlColors;
export type BreadcrumbSize = "sm" | "md" | "lg";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    /** Drawn between items, hidden from screen readers. */
    separator?: ReactNode;
    /** Longer trails collapse into the first item, an ellipsis button and the last `maxItems - 1` items. */
    maxItems?: number;
    /** Accessible name of the ellipsis button that reveals the hidden items. */
    expandLabel?: string;
    variantColor?: BreadcrumbColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: BreadcrumbSize;
}

export interface BreadcrumbItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Marks the current page: rendered as text with `aria-current="page"`. */
    current?: boolean;
    /** Uses the only child element (e.g. a router `Link`) as the link instead of an `<a>`. */
    asChild?: boolean;
}
