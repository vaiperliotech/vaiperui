import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type SegmentedControlColors = ControlColors;
export type SegmentedControlSize = ControlSize;
export type SegmentedControlRadius = ControlRadius;
export type SegmentedControlAnimation = ControlAnimation;

export interface SegmentedControlProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "aria-label"> {
    /** Names what the control selects. Required. */
    "aria-label": string;
    /** Selected item (controlled). */
    value?: string;
    /** Initial item (uncontrolled). Set it, or no item is reachable by keyboard. */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    /** Color of the selected item's text. Neutral when neither this nor `customColor` is set. */
    variantColor?: SegmentedControlColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: SegmentedControlSize;
    radius?: SegmentedControlRadius;
    animation?: SegmentedControlAnimation;
}

export interface SegmentedItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
    value: string;
}
