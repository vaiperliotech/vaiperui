import type { ControlAnimation, ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type SliderColors = ControlColors;
export type SliderSize = ControlSize;
export type SliderAnimation = ControlAnimation;

export interface SliderProps {
    /** Values, one per thumb: `[40]` for a single value, `[20, 80]` for an interval. Always sorted. */
    value?: number[];
    /** Initial values when uncontrolled. Defaults to `[min]`. */
    defaultValue?: number[];
    /** Called while a thumb moves. */
    onValueChange?: (value: number[]) => void;
    /** Called when the user releases a thumb or finishes a key press. Use it to fetch data only at the end. */
    onValueCommit?: (value: number[]) => void;
    /** Defaults to 0. */
    min?: number;
    /** Defaults to 100. */
    max?: number;
    /** Granularity of the value. Defaults to 1. */
    step?: number;
    /** In an interval, the minimum distance between two thumbs, in steps. Defaults to 0. */
    minStepsBetweenThumbs?: number;
    disabled?: boolean;
    /** Name of the form field. Every thumb submits its value under it. */
    name?: string;
    /** Accessible name. Required: with several thumbs a number is appended (see `thumbLabels`). */
    "aria-label": string;
    /** Accessible name of each thumb, replacing the numbered `aria-label`. */
    thumbLabels?: string[];
    variantColor?: SliderColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: SliderSize;
    animation?: SliderAnimation;
    className?: string;
}
