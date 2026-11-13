import type { HTMLAttributes } from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type PaginationColors = ControlColors;
export type PaginationSize = ControlSize;
export type PaginationRadius = ControlRadius;
export type PaginationAnimation = ControlAnimation;

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
    /** Current page, starting at 1. */
    page: number;
    /** Total number of pages. */
    pageCount: number;
    onPageChange: (page: number) => void;
    /** Pages shown on each side of the current one. */
    siblingCount?: number;
    /** Accessible name of the previous button. */
    previousLabel?: string;
    /** Accessible name of the next button. */
    nextLabel?: string;
    /** Accessible name of a page button, e.g. "Page 3". */
    pageLabel?: (page: number) => string;
    disabled?: boolean;
    variantColor?: PaginationColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: PaginationSize;
    radius?: PaginationRadius;
    animation?: PaginationAnimation;
}
