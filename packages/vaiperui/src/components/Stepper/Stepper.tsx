import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { accentOf } from "../Tabs/consts/accent";
import type { StepProps, StepperProps } from "./types";

const dot = { sm: "h-6 w-6 text-xs", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" };
// Vertical connector: starts under the dot and sits on its center line.
const line = { sm: "left-3 top-7", md: "left-4 top-9", lg: "left-5 top-11" };

const Check = () => (
    <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-1/2 w-1/2"
    >
        <path d="m4 10.5 4 4 8-9" />
    </svg>
);

/** Label (and description) of one step; the `Stepper` supplies the number, state and connector. */
export function Step({ children, description, className }: StepProps) {
    return (
        <span className={cn("flex flex-col text-left", className)}>
            <span className="font-medium">{children}</span>
            {description ? (
                <span className="text-xs font-normal text-[var(--vpd-text-muted)]">
                    {description}
                </span>
            ) : null}
        </span>
    );
}

export function Stepper({
    current,
    orientation = "horizontal",
    onStepClick,
    completedLabel = "Completed",
    variantColor = "primary",
    customColor,
    size = "md",
    animation = "smooth",
    className,
    style,
    children,
    ...props
}: StepperProps) {
    const accent = accentOf(variantColor, Boolean(customColor));
    const vertical = orientation === "vertical";
    const steps = React.Children.toArray(children);
    const anim = controlAnimations[animation];

    return (
        <ol
            {...props}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={cn(vertical ? "flex flex-col" : "flex items-center", className)}
        >
            {steps.map((step, index) => {
                const done = index < current;
                const active = index === current;
                const last = index === steps.length - 1;
                const content = (
                    <>
                        <span
                            aria-hidden="true"
                            className={cn(
                                "inline-flex shrink-0 items-center justify-center rounded-full border-2 font-semibold",
                                dot[size],
                                anim,
                                done
                                    ? accent.solid
                                    : active
                                      ? cn(accent.border, accent.text)
                                      : "border-[var(--vpd-border-strong)] text-[var(--vpd-text-muted)]",
                            )}
                        >
                            {done ? <Check /> : index + 1}
                        </span>
                        <span
                            className={
                                active || done
                                    ? "text-[var(--vpd-text)]"
                                    : "text-[var(--vpd-text-muted)]"
                            }
                        >
                            {step}
                        </span>
                        {done ? <span className="sr-only">{completedLabel}</span> : null}
                    </>
                );
                const row = "inline-flex items-center gap-3 text-sm";
                return (
                    <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional
                        key={index}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                            "relative",
                            vertical
                                ? "pb-6 last:pb-0"
                                : "flex flex-1 items-center gap-3 last:flex-none",
                        )}
                    >
                        {done && onStepClick ? (
                            <button
                                type="button"
                                onClick={() => onStepClick(index)}
                                className={cn(
                                    row,
                                    "cursor-pointer rounded-full outline-none",
                                    accent.ring,
                                )}
                            >
                                {content}
                            </button>
                        ) : (
                            <span className={row}>{content}</span>
                        )}
                        {last ? null : (
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "bg-[var(--vpd-border-strong)]",
                                    vertical
                                        ? cn("absolute bottom-1 w-0.5 -translate-x-1/2", line[size])
                                        : "mx-1 h-0.5 min-w-6 flex-1",
                                    anim,
                                    done && "bg-[var(--vpd-text-muted)]",
                                )}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
