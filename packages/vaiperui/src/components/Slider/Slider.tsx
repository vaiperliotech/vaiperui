import * as React from "react";

import { cn } from "../../lib/cn";
import { type ControlColors, type ControlSize, controlAnimations } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import type { SliderProps } from "./types";

const colorStyles: Record<ControlColors, string> = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-500",
    danger: "text-danger-600",
};

const sizes: Record<ControlSize, { thumb: number; thumbClass: string; track: string }> = {
    sm: { thumb: 16, thumbClass: "h-4 w-4", track: "h-1" },
    md: { thumb: 20, thumbClass: "h-5 w-5", track: "h-1.5" },
    lg: { thumb: 24, thumbClass: "h-6 w-6", track: "h-2" },
};

const PAGE_STEPS = 10;

export function Slider({
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    disabled = false,
    name,
    "aria-label": ariaLabel,
    thumbLabels,
    variantColor = "primary",
    customColor,
    size = "md",
    animation = "smooth",
    className,
}: SliderProps) {
    const clamp = (n: number) => Math.min(max, Math.max(min, n));
    const [inner, setInner] = React.useState(() => defaultValue ?? [min]);
    const values = (value ?? inner).map(clamp).sort((a, b) => a - b);
    // Updated synchronously on every change so fast pointer moves never read a stale value.
    const valuesRef = React.useRef(values);
    valuesRef.current = values;

    const [dragging, setDragging] = React.useState(false);
    const activeThumb = React.useRef<number | null>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRefs = React.useRef<Array<HTMLDivElement | null>>([]);

    const { thumb, thumbClass, track } = sizes[size];
    const gap = minStepsBetweenThumbs * step;
    const decimals = String(step).split(".")[1]?.length ?? 0;
    const pct = (n: number) => (max === min ? 0 : ((n - min) / (max - min)) * 100);

    function snap(raw: number) {
        return Number((Math.round((raw - min) / step) * step + min).toFixed(decimals));
    }

    function setThumb(index: number, raw: number) {
        const current = valuesRef.current;
        const lower = index > 0 ? (current[index - 1] ?? min) + gap : min;
        const upper = index < current.length - 1 ? (current[index + 1] ?? max) - gap : max;
        if (lower > upper) return;
        const next = Math.min(upper, Math.max(lower, snap(raw)));
        if (next === current[index]) return;
        const updated = current.map((v, i) => (i === index ? next : v));
        valuesRef.current = updated;
        if (value === undefined) setInner(updated);
        onValueChange?.(updated);
    }

    function rawFromPointer(clientX: number) {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return min;
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        return min + ratio * (max - min);
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        if (disabled || event.button !== 0) return;
        const raw = rawFromPointer(event.clientX);
        // The thumb nearest to the pointer moves; on a tie, the one the pointer is past.
        let nearest = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        valuesRef.current.forEach((v, i) => {
            const distance = Math.abs(v - raw);
            if (distance < nearestDistance || (distance === nearestDistance && raw > v)) {
                nearest = i;
                nearestDistance = distance;
            }
        });
        activeThumb.current = nearest;
        setDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        thumbRefs.current[nearest]?.focus();
        event.preventDefault();
        setThumb(nearest, raw);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (activeThumb.current === null) return;
        setThumb(activeThumb.current, rawFromPointer(event.clientX));
    }

    function endDrag() {
        if (activeThumb.current === null) return;
        activeThumb.current = null;
        setDragging(false);
        onValueCommit?.(valuesRef.current);
    }

    function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLDivElement>) {
        if (disabled) return;
        const current = valuesRef.current[index] ?? min;
        const delta: Record<string, number> = {
            ArrowRight: step,
            ArrowUp: step,
            ArrowLeft: -step,
            ArrowDown: -step,
            PageUp: step * PAGE_STEPS,
            PageDown: -step * PAGE_STEPS,
        };
        let target: number | undefined;
        if (event.key in delta) target = current + (delta[event.key] ?? 0);
        else if (event.key === "Home") target = min;
        else if (event.key === "End") target = max;
        if (target === undefined) return;
        event.preventDefault();
        setThumb(index, target);
        onValueCommit?.(valuesRef.current);
    }

    const color = customColor ? "text-[var(--vpd-accent)]" : colorStyles[variantColor];
    const fillStart = values.length > 1 ? pct(values[0] ?? min) : 0;
    const fillEnd = pct(values[values.length - 1] ?? min);
    // While dragging the thumb must follow the pointer 1:1, so transitions only run for keys/props.
    const motion = dragging ? "" : controlAnimations[animation];

    return (
        <div
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                color,
                disabled ? "pointer-events-none opacity-50" : "cursor-pointer",
                className,
            )}
            style={{
                height: thumb,
                ...(customColor ? customColorVars(customColor) : undefined),
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
        >
            <div
                ref={trackRef}
                className="absolute inset-y-0"
                style={{ left: thumb / 2, right: thumb / 2 }}
            >
                <div
                    className={cn(
                        "absolute top-1/2 w-full -translate-y-1/2 rounded-full bg-[var(--vpd-border)]",
                        track,
                    )}
                />
                <div
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 rounded-full bg-current",
                        track,
                        motion,
                    )}
                    style={{ left: `${fillStart}%`, width: `${fillEnd - fillStart}%` }}
                />
                {values.map((v, i) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional, their order never changes
                        key={i}
                        ref={(node) => {
                            thumbRefs.current[i] = node;
                        }}
                        role="slider"
                        tabIndex={disabled ? -1 : 0}
                        aria-label={
                            thumbLabels?.[i] ??
                            (values.length > 1 ? `${ariaLabel} ${i + 1}` : ariaLabel)
                        }
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuenow={v}
                        aria-disabled={disabled || undefined}
                        aria-orientation="horizontal"
                        onKeyDown={(event) => handleKeyDown(i, event)}
                        className={cn(
                            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-current bg-white shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30",
                            thumbClass,
                            motion,
                        )}
                        style={{ left: `${pct(v)}%` }}
                    />
                ))}
            </div>
            {name
                ? values.map((v, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: positional, same as the thumbs
                      <input key={i} type="hidden" name={name} value={v} />
                  ))
                : null}
        </div>
    );
}
