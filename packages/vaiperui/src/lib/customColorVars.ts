import type { CSSProperties } from "react";

/**
 * A single CSS color (hex, rgb, hsl...) applied as-is in both themes, or an
 * explicit `{ light, dark }` pair when the two themes need different colors.
 */
export type CustomColor = string | { light: string; dark: string };

/**
 * CSS custom properties consumed by every component's `customColor` prop.
 * A string color is used verbatim in both themes; an explicit `{ light, dark }`
 * pair is resolved via `light-dark()`. Hover/tint/ring shades are derived from
 * the accent color via `color-mix`.
 */
export function customColorVars(color: CustomColor): CSSProperties {
    const accent = typeof color === "string" ? color : `light-dark(${color.light}, ${color.dark})`;

    return {
        "--vpd-accent": accent,
        "--vpd-accent-hover": `color-mix(in oklab, ${accent} 85%, black)`,
        "--vpd-accent-tint": `color-mix(in oklab, ${accent} 12%, var(--vpd-surface))`,
        "--vpd-accent-ring": `color-mix(in oklab, ${accent} 30%, transparent)`,
    } as CSSProperties;
}
