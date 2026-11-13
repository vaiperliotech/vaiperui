import type { ReactElement, ReactNode } from "react";

import type { ControlAnimation, ControlRadius } from "../../lib/controlStyles";
import type { OverlayAlign, OverlaySide } from "../shared/overlayHooks";

export type PopoverSide = OverlaySide;
export type PopoverAlign = OverlayAlign;
export type PopoverRadius = ControlRadius;
export type PopoverAnimation = ControlAnimation;

export interface PopoverProps {
    /** Element that toggles the panel (must accept a ref, focus and `onClick`). */
    trigger: ReactElement;
    /** Accessible name of the panel. */
    label: string;
    children?: ReactNode;
    /** Side of the trigger; flips when there is no room. */
    side?: PopoverSide;
    /** Alignment along the other axis. */
    align?: PopoverAlign;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    radius?: PopoverRadius;
    animation?: PopoverAnimation;
    className?: string;
}
