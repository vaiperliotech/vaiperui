import * as React from "react";

import { cn } from "../../lib/cn";
import type { DividerColor, DividerProps, DividerSpacing, DividerVariant } from "./types";

const tokens: Record<DividerColor, string> = {
    default: "var(--vpd-border)",
    strong: "var(--vpd-border-strong)",
    soft: "var(--vpd-border-soft)",
};
const styles: Record<DividerVariant, string> = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
};
const spacings: Record<"horizontal" | "vertical", Record<DividerSpacing, string>> = {
    horizontal: { none: "my-0", sm: "my-2", md: "my-4", lg: "my-6" },
    vertical: { none: "mx-0", sm: "mx-2", md: "mx-4", lg: "mx-6" },
};

export const Divider = React.forwardRef<HTMLElement, DividerProps>(function Divider(
    {
        orientation = "horizontal",
        variant = "solid",
        spacing = "none",
        color = "default",
        customColor,
        label,
        labelAlign = "center",
        decorative,
        className,
        style,
        ...props
    },
    ref,
) {
    const vertical = orientation === "vertical";
    const accent = customColor
        ? typeof customColor === "string"
            ? customColor
            : `light-dark(${customColor.light}, ${customColor.dark})`
        : tokens[color];
    const a11y = decorative
        ? { role: "presentation" }
        : { role: "separator", "aria-orientation": orientation };
    const lineStyle = cn("border-[color:var(--vpd-divider)]", styles[variant]);
    const line = cn(lineStyle, vertical ? "self-stretch border-l" : "w-full border-t");
    const rootStyle = { "--vpd-divider": accent, ...style } as React.CSSProperties;
    const hasLabel = label !== undefined && label !== null && label !== false && label !== "";

    if (!hasLabel) {
        return (
            <hr
                {...props}
                {...a11y}
                ref={ref as React.Ref<HTMLHRElement>}
                style={rootStyle}
                className={cn(
                    "m-0 border-0",
                    line,
                    vertical && "h-auto w-0",
                    spacings[orientation][spacing],
                    className,
                )}
            />
        );
    }

    const grow = cn(lineStyle, "flex-1", vertical ? "border-l" : "border-t");
    return (
        <div
            {...props}
            {...a11y}
            ref={ref as React.Ref<HTMLDivElement>}
            style={rootStyle}
            className={cn(
                "flex items-center gap-3 text-sm text-[var(--vpd-text-muted)]",
                vertical ? "flex-col self-stretch" : "w-full",
                spacings[orientation][spacing],
                className,
            )}
        >
            {labelAlign !== "start" && <span aria-hidden="true" className={grow} />}
            <span className="shrink-0">{label}</span>
            {labelAlign !== "end" && <span aria-hidden="true" className={grow} />}
        </div>
    );
});
