import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import type { ControlColors } from "../../lib/controlStyles";

/** Box tint and icon color per `variantColor`; `customColor` uses the `--vpd-accent*` vars. */
export const tones: Record<ControlColors, { box: string; icon: string }> = {
    primary: { box: "border-primary-500/40 bg-primary-500/10", icon: "text-primary-600" },
    success: { box: "border-success-500/40 bg-success-500/10", icon: "text-success-600" },
    warning: { box: "border-warning-500/40 bg-warning-500/10", icon: "text-warning-600" },
    danger: { box: "border-danger-500/40 bg-danger-500/10", icon: "text-danger-600" },
};
export const customTone = {
    box: "border-[var(--vpd-accent)] bg-[var(--vpd-accent-tint)]",
    icon: "text-[var(--vpd-accent)]",
};

export function toneOf(color: ControlColors, custom: boolean) {
    return custom ? customTone : tones[color];
}

/** Warning and danger interrupt screen readers; the rest are polite. */
export function roleOf(color: ControlColors) {
    return color === "danger" || color === "warning" ? "alert" : "status";
}

const paths: Record<ControlColors, string> = {
    primary: "M12 16v-4M12 8h.01",
    success: "m8 12 3 3 5-6",
    warning: "M12 8v5M12 16.5h.01",
    danger: "m9 9 6 6M15 9l-6 6",
};

export function StatusIcon({ color, className }: { color: ControlColors; className?: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-5 w-5 shrink-0", className)}
        >
            <circle cx="12" cy="12" r="9" />
            <path d={paths[color]} />
        </svg>
    );
}

export function CloseButton({
    label,
    onClick,
    className,
}: {
    label: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={cn(
                "inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--vpd-text-muted)] outline-none hover:bg-[var(--vpd-surface-hover)] hover:text-[var(--vpd-text)] focus-visible:ring-2 focus-visible:ring-primary-500/50",
                className,
            )}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4 w-4"
            >
                <path d="M6 6l12 12M18 6 6 18" />
            </svg>
        </button>
    );
}

/** `undefined` shows the default status icon, `false` hides it, any node replaces it. */
export function iconNode(icon: ReactNode | undefined, color: ControlColors, tone: string) {
    if (icon === false) return null;
    return icon === undefined ? (
        <StatusIcon color={color} className={tone} />
    ) : (
        <span className={cn("shrink-0", tone)}>{icon}</span>
    );
}
