import { cn } from "../../lib/cn";
import { DialogShell } from "../shared/DialogShell";
import { OverlayClose } from "../shared/OverlayClose";
import { useControllableOpen, useTrigger } from "../shared/overlayHooks";
import type { DrawerProps, DrawerSide } from "./types";

const sides: Record<
    DrawerSide,
    { container: string; panel: string; hidden: string; shown: string }
> = {
    right: {
        container: "justify-end",
        panel: "h-full w-full max-w-[400px]",
        hidden: "translate-x-full",
        shown: "translate-x-0",
    },
    left: {
        container: "justify-start",
        panel: "h-full w-full max-w-[400px]",
        hidden: "-translate-x-full",
        shown: "translate-x-0",
    },
    top: {
        container: "items-start",
        panel: "max-h-[80%] w-full",
        hidden: "-translate-y-full",
        shown: "translate-y-0",
    },
    bottom: {
        container: "items-end",
        panel: "max-h-[80%] w-full",
        hidden: "translate-y-full",
        shown: "translate-y-0",
    },
};

/** Wrap a button in it (inside a Drawer) to close the drawer on click. */
export const DrawerClose = OverlayClose;

export function Drawer({
    title,
    children,
    footer,
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    side = "right",
    animation = "smooth",
    showClose = true,
    closeLabel = "Close",
    closeOnEscape = true,
    closeOnBackdropClick = true,
    className,
}: DrawerProps) {
    const [isOpen, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
    const triggerEl = useTrigger(trigger, undefined, {
        onClick: () => setOpen(true),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
    });
    const s = sides[side];

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
                showHeaderDivider
                showFooterDivider
                animation={animation}
                containerClassName={s.container}
                panelClassName={cn(s.panel, className)}
                hiddenClassName={s.hidden}
                shownClassName={s.shown}
            >
                {children}
            </DialogShell>
        </>
    );
}
