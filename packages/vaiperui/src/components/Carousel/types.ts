import type * as React from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type CarouselColors = ControlColors;
export type CarouselSize = ControlSize;
export type CarouselRadius = ControlRadius;
export type CarouselAnimation = ControlAnimation;

export interface CarouselProps {
    /** One slide per child. */
    children: React.ReactNode;
    /** Accessible name of the carousel. */
    "aria-label": string;
    /** Controlled index of the first visible slide. */
    index?: number;
    /** Initial index when uncontrolled. Defaults to 0. */
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    /** Slides visible at once. Defaults to 1. */
    slidesPerView?: number;
    /** Past the last position, next goes back to the first (and previous to the last). */
    loop?: boolean;
    /** Advances by itself every N ms (`true` = 5000). Pauses on hover and focus, and never runs with `prefers-reduced-motion`. */
    autoplay?: boolean | number;
    /** Defaults to `true`. */
    showArrows?: boolean;
    /** Defaults to `true`. */
    showDots?: boolean;
    /** Defaults to "Previous slide". */
    previousLabel?: string;
    /** Defaults to "Next slide". */
    nextLabel?: string;
    /** Accessible name of each dot. Defaults to `Go to slide N`. */
    dotLabel?: (index: number) => string;
    /** Accessible name of each slide. Defaults to `N of total`. */
    slideLabel?: (index: number, total: number) => string;
    variantColor?: CarouselColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: CarouselSize;
    radius?: CarouselRadius;
    animation?: CarouselAnimation;
    className?: string;
}
