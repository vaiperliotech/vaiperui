import type { ReactElement, ReactNode } from "react";

import type { ControlAnimation } from "../../lib/controlStyles";

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerAnimation = ControlAnimation;

export interface DrawerProps {
    /** Heading and accessible name of the panel. */
    title: ReactNode;
    children?: ReactNode;
    /** Footer actions; without it no footer renders. */
    footer?: ReactNode;
    /** Element that opens the drawer (must accept a ref and `onClick`). Not needed when controlled. */
    trigger?: ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Edge where the panel sits. Left/right max out at 400px wide; top/bottom span the width up to 80% of the height. */
    side?: DrawerSide;
    /** Slide-in transition. */
    animation?: DrawerAnimation;
    showClose?: boolean;
    /** Accessible name of the × button. */
    closeLabel?: string;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    className?: string;
}
