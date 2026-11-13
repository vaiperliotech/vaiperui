import type { HTMLAttributes } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
    /** Element to render. Defaults to `div`. */
    as?: React.ElementType;
    /** Max width: sm 672px, md 896px, lg 1152px, xl 1280px, full none. */
    size?: ContainerSize;
    /** Responsive horizontal padding (16 / 24 / 32px). Set `false` to remove it. */
    padded?: boolean;
}
