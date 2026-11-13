import type { HTMLAttributes } from "react";

import type { StackBreakpoint, StackGap } from "../Stack/types";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridBreakpoint = StackBreakpoint;

export interface GridProps extends HTMLAttributes<HTMLElement> {
    /** Element to render. Defaults to `div`. */
    as?: React.ElementType;
    /** Number of columns, or one value per breakpoint, e.g. `{ base: 1, md: 2, lg: 4 }`. */
    columns?: GridColumns | Partial<Record<GridBreakpoint, GridColumns>>;
    /** Space between cells on the Tailwind scale (4px steps). */
    gap?: StackGap;
}

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
    /** Element to render. Defaults to `div`. */
    as?: React.ElementType;
    /** Columns this item spans (1 to 12). */
    colSpan?: GridColumns;
    /** Rows this item spans (1 to 6). */
    rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
}
