import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

import type { ControlAnimation, ControlRadius, ControlSize } from "../../lib/controlStyles";
import type { OverlayAlign, OverlaySide } from "../shared/overlayHooks";

export type MenuSide = OverlaySide;
export type MenuAlign = OverlayAlign;
export type MenuSize = ControlSize;
export type MenuRadius = ControlRadius;
export type MenuAnimation = ControlAnimation;

export interface MenuProps {
    /** Button that opens the menu (must accept a ref, focus and `onClick`). */
    trigger: ReactElement;
    /** `MenuItem`, `MenuLabel` and `MenuSeparator`. */
    children?: ReactNode;
    /** Accessible name of the menu. */
    label?: string;
    side?: MenuSide;
    align?: MenuAlign;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: MenuSize;
    radius?: MenuRadius;
    animation?: MenuAnimation;
    className?: string;
}

export interface MenuItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" | "role"> {
    /** Runs on click and on Enter/Space; call `event.preventDefault()` to keep the menu open. */
    onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Decorative icon before the label. */
    icon?: ReactNode;
    /** Red text, for delete/remove actions. */
    destructive?: boolean;
    disabled?: boolean;
}
