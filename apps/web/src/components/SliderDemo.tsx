"use client";

import { useState } from "react";
import { Slider } from "vaiperui";

// The Slider never prints its value, so the demos show it next to the control.
export function SliderDemo({
    mode,
    label,
    format,
    thumbLabels,
}: {
    mode: "single" | "interval";
    label: string;
    /** Receives the values and returns the text shown above the slider. */
    format: "percent" | "price";
    thumbLabels?: [string, string];
}) {
    const [value, setValue] = useState(mode === "single" ? [40] : [200, 800]);
    const text = format === "percent" ? `${value[0]}%` : `$${value[0]} – $${value[1]}`;

    return (
        <div className="flex w-full max-w-sm flex-col gap-2">
            <span className="text-sm text-[var(--vpd-text-secondary)]">
                {label}: {text}
            </span>
            <Slider
                aria-label={label}
                thumbLabels={thumbLabels}
                value={value}
                onValueChange={setValue}
                {...(mode === "interval" ? { min: 0, max: 1000, step: 10 } : {})}
            />
        </div>
    );
}
