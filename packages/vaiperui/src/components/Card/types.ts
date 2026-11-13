import type { HTMLAttributes } from "react";

import type { ControlRadius } from "../../lib/controlStyles";

export type CardPadding = "none" | "md" | "lg";
export type CardRadius = ControlRadius;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Inner spacing: 16px, 24px, or none (edge-to-edge media). */
    padding?: CardPadding;
    radius?: CardRadius;
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;
