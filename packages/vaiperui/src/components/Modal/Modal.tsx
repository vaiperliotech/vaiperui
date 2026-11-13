import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { DialogShell } from "../shared/DialogShell";
import { OverlayClose } from "../shared/OverlayClose";
import { useControllableOpen, useTrigger } from "../shared/overlayHooks";
import type { ModalProps, ModalSize } from "./types";

const sizes: Record<ModalSize, string> = {
    sm: "max-w-[480px]",
    md: "max-w-[640px]",
    lg: "max-w-[800px]",
};

/** Wrap a button in it (inside a Modal) to close the modal on click, e.g. in the footer. */
export const ModalClose = OverlayClose;

export function Modal({
    title,
    children,
    footer,
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    size = "sm",
    radius = "lg",
    animation = "smooth",
    showClose = true,
    showHeaderDivider = true,
    showFooterDivider = true,
    closeLabel = "Close",
    closeOnEscape = true,
    closeOnBackdropClick = true,
    className,
}: ModalProps) {
    const [isOpen, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
    const triggerEl = useTrigger(trigger, undefined, {
        onClick: () => setOpen(true),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
    });

    return (
        <>
            {triggerEl}
            <DialogShell
                open={isOpen}
                onOpenChange={setOpen}
                title={title}
                footer={footer}
                showClose={showClose}
                closeLabel={closeLabel}
                closeOnEscape={closeOnEscape}
                closeOnBackdrop={closeOnBackdropClick}
                showHeaderDivider={showHeaderDivider}
                showFooterDivider={showFooterDivider}
                animation={animation}
                containerClassName="items-center justify-center p-4"
                panelClassName={cn(
                    "max-h-full w-full",
                    sizes[size],
                    controlRadius[radius],
                    className,
                )}
                hiddenClassName="opacity-0 scale-95"
                shownClassName="opacity-100 scale-100"
            >
                {children}
            </DialogShell>
        </>
    );
}
