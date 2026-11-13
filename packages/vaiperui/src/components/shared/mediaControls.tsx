import type * as React from "react";

import { cn } from "../../lib/cn";
import type { ControlColors, ControlSize } from "../../lib/controlStyles";
import { type CustomColor, customColorVars } from "../../lib/customColorVars";

export function formatTime(seconds: number) {
    const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    const s = String(total % 60).padStart(2, "0");
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

const accentColors: Record<ControlColors, string> = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-500",
    danger: "text-danger-600",
};

/** Text-color class + inline vars that make `currentColor` the accent of the player. */
export function accent(variantColor: ControlColors, customColor?: CustomColor) {
    return customColor
        ? { className: "text-[var(--vpd-accent)]", style: customColorVars(customColor) }
        : { className: accentColors[variantColor], style: undefined };
}

export const buttonSizes: Record<ControlSize, string> = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
};

export const textSizes: Record<ControlSize, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
};

/** Round icon button. `primary` paints it with the accent color. */
export function MediaButton({
    primary,
    size,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; size: ControlSize }) {
    return (
        <button
            type="button"
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30",
                buttonSizes[size],
                primary
                    ? "bg-current [&>svg]:text-white"
                    : "text-[var(--vpd-text)] hover:bg-[var(--vpd-surface-hover)]",
                className,
            )}
            {...props}
        />
    );
}

const Svg = ({ d }: { d: string }) => (
    <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        className="h-[1.1em] w-[1.1em]"
    >
        <path d={d} />
    </svg>
);

export const PlayIcon = () => <Svg d="M8 5v14l11-7z" />;
export const PauseIcon = () => <Svg d="M6 5h4v14H6zm8 0h4v14h-4z" />;
export const VolumeIcon = () => (
    <Svg d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z" />
);
export const MutedIcon = () => (
    <Svg d="M3 9v6h4l5 5V4L7 9zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
);
export const FullscreenIcon = () => (
    <Svg d="M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zM5 14h2v3h3v2H5zm12 0h2v5h-5v-2h3z" />
);
export const ExitFullscreenIcon = () => (
    <Svg d="M8 5h2v5H5V8h3zm6 0h2v3h3v2h-5zM5 14h5v5H8v-3H5zm9 0h5v2h-3v3h-2z" />
);
export const CaptionsIcon = () => (
    <Svg d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1z" />
);
export const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
    <Svg
        d={
            dir === "left"
                ? "M15.4 6 14 4.6 6.6 12 14 19.4 15.4 18 9.4 12z"
                : "M8.6 6 10 4.6 17.4 12 10 19.4 8.6 18 14.6 12z"
        }
    />
);
export const CloseIcon = () => (
    <Svg d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z" />
);
