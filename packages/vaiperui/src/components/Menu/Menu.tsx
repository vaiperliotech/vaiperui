import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { OverlayCloseContext } from "../shared/OverlayClose";
import {
    fadeScale,
    isDark,
    useAnchored,
    useControllableOpen,
    useDismiss,
    useEntered,
    useTrigger,
} from "../shared/overlayHooks";
import type { MenuItemProps, MenuProps, MenuSize } from "./types";

const ITEMS = '[role="menuitem"]:not(:disabled)';
const sizes: Record<MenuSize, string> = { sm: "text-xs", md: "text-sm", lg: "text-base" };

const SizeContext = React.createContext<MenuSize>("md");

export function Menu({
    trigger,
    children,
    label,
    side = "bottom",
    align = "start",
    open,
    defaultOpen,
    onOpenChange,
    size = "md",
    radius = "lg",
    animation = "fast",
    className,
}: MenuProps) {
    const [isOpen, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
    const { refs, floatingStyles } = useAnchored(side, align, 4);
    const menuId = React.useId();
    const entered = useEntered(isOpen, animation);
    const typed = React.useRef({ text: "", timer: 0 });

    const triggerEl = useTrigger(trigger, refs.setReference, {
        onClick: () => setOpen(!isOpen),
        onKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === "ArrowDown" && !isOpen) {
                event.preventDefault();
                setOpen(true);
            }
        },
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? menuId : undefined,
    });

    const focusTrigger = () => (refs.reference.current as HTMLElement | null)?.focus();
    useDismiss(
        isOpen,
        (byEscape) => {
            setOpen(false);
            if (byEscape) focusTrigger();
        },
        () => [refs.floating.current, refs.reference.current as Element | null],
    );

    React.useEffect(() => {
        if (!isOpen) return;
        const menu = refs.floating.current;
        (menu?.querySelector<HTMLElement>(ITEMS) ?? menu)?.focus();
    }, [isOpen, refs]);

    function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        const items = [...event.currentTarget.querySelectorAll<HTMLElement>(ITEMS)];
        const current = items.indexOf(document.activeElement as HTMLElement);
        let next = -1;
        if (event.key === "ArrowDown") next = (current + 1) % items.length;
        else if (event.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = items.length - 1;
        else if (event.key === "Tab") return setOpen(false);
        else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== " ") {
            // Typeahead: letters typed within 500ms form a prefix.
            window.clearTimeout(typed.current.timer);
            typed.current.text += event.key.toLowerCase();
            typed.current.timer = window.setTimeout(() => {
                typed.current.text = "";
            }, 500);
            const prefix = typed.current.text;
            const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
            next = items.indexOf(
                ordered.find((el) =>
                    el.textContent?.trim().toLowerCase().startsWith(prefix),
                ) as HTMLElement,
            );
        } else return;
        event.preventDefault();
        items[next]?.focus();
    }

    return (
        <OverlayCloseContext.Provider
            value={() => {
                setOpen(false);
                focusTrigger();
            }}
        >
            <SizeContext.Provider value={size}>
                {triggerEl}
                {isOpen &&
                    createPortal(
                        <div
                            ref={refs.setFloating}
                            id={menuId}
                            role="menu"
                            aria-label={label}
                            tabIndex={-1}
                            style={floatingStyles}
                            onKeyDown={onKeyDown}
                            className={cn(
                                "z-50 outline-none",
                                isDark(refs.reference.current as Element | null) && "dark",
                            )}
                        >
                            <div
                                className={cn(
                                    "min-w-40 border border-[var(--vpd-border)] bg-[var(--vpd-surface)] p-1 text-[var(--vpd-text)] shadow-lg",
                                    sizes[size],
                                    controlRadius[radius],
                                    fadeScale(entered, animation),
                                    className,
                                )}
                            >
                                {children}
                            </div>
                        </div>,
                        document.body,
                    )}
            </SizeContext.Provider>
        </OverlayCloseContext.Provider>
    );
}

export function MenuItem({
    onSelect,
    icon,
    destructive,
    disabled,
    children,
    className,
    onClick,
    ...rest
}: MenuItemProps) {
    const close = React.useContext(OverlayCloseContext);
    return (
        <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            disabled={disabled}
            {...rest}
            onClick={(event) => {
                onClick?.(event);
                onSelect?.(event);
                if (!event.defaultPrevented) close?.();
            }}
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left outline-none transition-colors focus:bg-[var(--vpd-surface-hover)] enabled:hover:bg-[var(--vpd-surface-hover)] disabled:cursor-not-allowed disabled:opacity-50",
                destructive && "text-danger-600",
                className,
            )}
        >
            {icon && (
                <span
                    aria-hidden="true"
                    className="flex h-4 w-4 shrink-0 items-center justify-center"
                >
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
    return (
        <div
            role="presentation"
            className="px-2.5 py-1 text-xs font-medium text-[var(--vpd-text-muted)]"
        >
            {children}
        </div>
    );
}

export function MenuSeparator() {
    // biome-ignore lint/a11y/useSemanticElements: <hr> inside role="menu" is not valid; ARIA separator is the menu pattern
    return <div role="separator" className="my-1 h-px bg-[var(--vpd-border)]" />;
}
