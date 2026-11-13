import type { ReactElement, ReactNode } from "react";

import type { ControlAnimation, ControlRadius } from "../../lib/controlStyles";

export type ModalSize = "sm" | "md" | "lg";
export type ModalRadius = ControlRadius;
export type ModalAnimation = ControlAnimation;

export interface ModalProps {
    /** Heading and accessible name of the dialog. */
    title: ReactNode;
    children?: ReactNode;
    /** Action buttons; without it neither the footer nor its divider render. */
    footer?: ReactNode;
    /** Element that opens the modal (must accept a ref and `onClick`). Not needed when controlled. */
    trigger?: ReactElement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Max width: 480px, 640px or 800px. */
    size?: ModalSize;
    radius?: ModalRadius;
    /** Enter transition. */
    animation?: ModalAnimation;
    showClose?: boolean;
    showHeaderDivider?: boolean;
    showFooterDivider?: boolean;
    /** Accessible name of the × button. */
    closeLabel?: string;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    className?: string;
}
