import * as React from "react";

import { cn } from "../../lib/cn";
import { animationColors, animations } from "./consts/animations";
import { glowColors, hovers } from "./consts/hovers";
import { radiusStyles } from "./consts/radius";
import { sizeStyles } from "./consts/sizes";
import { variants } from "./consts/variants";
import type { ButtonProps } from "./types";

const baseStyles =
    "inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const RIPPLE_DURATION = 600;

interface Ripple {
    id: number;
    x: number;
    y: number;
    size: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        className,
        children,
        variant = "solid",
        variantColor = "primary",
        size = "md",
        radius = "md",
        hover = "none",
        animation = "none",
        ripple = false,
        type = "button",
        iconStart,
        iconEnd,
        onPointerDown,
        onClick,
        ...props
    },
    ref,
) {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const nextRippleId = React.useRef(0);

    function addRipple(button: HTMLButtonElement, clientX: number | null, clientY: number | null) {
        const rect = button.getBoundingClientRect();
        // keyboard activation has no pointer position, so the ripple starts at the center
        const x = clientX === null ? rect.width / 2 : clientX - rect.left;
        const y = clientY === null ? rect.height / 2 : clientY - rect.top;
        // diameter reaches the farthest corner so the ripple always covers the whole button
        const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
        const id = nextRippleId.current++;
        setRipples((current) => [...current, { id, x, y, size: radius * 2 }]);
        window.setTimeout(
            () => setRipples((current) => current.filter((item) => item.id !== id)),
            RIPPLE_DURATION,
        );
    }

    function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
        onPointerDown?.(event);
        if (ripple && event.button === 0) {
            addRipple(event.currentTarget, event.clientX, event.clientY);
        }
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        onClick?.(event);
        // detail 0 = click fired by the keyboard (Enter/Space), not a pointer press
        if (ripple && event.detail === 0) addRipple(event.currentTarget, null, null);
    }

    const classes = cn(
        baseStyles,
        ripple && "relative overflow-hidden",
        variants[variant][variantColor],
        sizeStyles[size],
        radiusStyles[radius],
        hovers[hover],
        hover === "glow" && glowColors[variantColor],
        animations[animation],
        animationColors(animation, variantColor),
        className,
    );

    return (
        <button
            ref={ref}
            type={type}
            className={classes}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            {...props}
        >
            {iconStart}
            {children}
            {iconEnd}
            {ripples.map((item) => (
                <span
                    key={item.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full bg-current motion-safe:animate-ripple motion-reduce:hidden"
                    style={{
                        left: item.x - item.size / 2,
                        top: item.y - item.size / 2,
                        width: item.size,
                        height: item.size,
                    }}
                />
            ))}
        </button>
    );
});
