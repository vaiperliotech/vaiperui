import type { ReactElement, ReactNode } from "react";

import type { ControlColors, ControlRadius } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";
import type { OverlaySide } from "../shared/overlayHooks";

export type TooltipSide = OverlaySide;
export type TooltipColors = ControlColors | "neutral";
export type TooltipRadius = ControlRadius;

export interface TooltipProps {
    /** The element described by the tooltip (must accept a ref and focus). */
    children: ReactElement;
    /** Text of the tooltip; never put interactive content here. */
    content: ReactNode;
    /** Highlighted heading above the text. */
    title?: ReactNode;
    side?: TooltipSide;
    showArrow?: boolean;
    /** Milliseconds before opening on hover (focus opens immediately). */
    delayDuration?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** `neutral` is an inverted surface color. */
    variantColor?: TooltipColors;
    radius?: TooltipRadius;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    className?: string;
}
