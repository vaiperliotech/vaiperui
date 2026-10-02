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
        type = "button",
        iconStart,
        iconEnd,
        ...props
    },
    ref,
) {
    const classes = cn(
        baseStyles,
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
        <button ref={ref} type={type} className={classes} {...props}>
            {iconStart}
            {children}
            {iconEnd}
        </button>
    );
});
