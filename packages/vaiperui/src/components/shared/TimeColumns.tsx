import * as React from "react";

import { cn } from "../../lib/cn";
import type { ControlColors } from "../../lib/controlStyles";
import { customDateColor, dateColors } from "../../lib/dateStyles";

export interface TimeLabels {
    hours: string;
    minutes: string;
    period: string;
    am: string;
    pm: string;
}

export const DEFAULT_TIME_LABELS: TimeLabels = {
    hours: "Hours",
    minutes: "Minutes",
    period: "AM/PM",
    am: "AM",
    pm: "PM",
};

const pad = (n: number) => String(n).padStart(2, "0");

function Column({
    label,
    items,
    selected,
    onSelect,
    color,
}: {
    label: string;
    items: Array<{ key: string; text: string; value: number }>;
    selected?: number;
    onSelect: (value: number) => void;
    color: string;
}) {
    const ref = React.useRef<HTMLDivElement>(null);

    // Open on the selected item so the user does not have to scroll to it.
    React.useEffect(() => {
        ref.current
            ?.querySelector<HTMLElement>("[aria-pressed='true']")
            ?.scrollIntoView?.({ block: "center" });
    }, []);

    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const buttons = Array.from(ref.current?.querySelectorAll<HTMLElement>("button") ?? []);
        const index = buttons.indexOf(document.activeElement as HTMLElement);
        const next = buttons[index + (event.key === "ArrowDown" ? 1 : -1)];
        if (!next) return;
        event.preventDefault();
        next.focus();
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: a column of toggle buttons, grouped by name
        <div
            ref={ref}
            role="group"
            aria-label={label}
            onKeyDown={onKeyDown}
            className="flex max-h-56 w-16 flex-col gap-0.5 overflow-y-auto p-1"
        >
            {items.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    aria-pressed={item.value === selected}
                    onClick={() => onSelect(item.value)}
                    className={cn(
                        "h-8 shrink-0 rounded-md text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vpd-border-strong)]",
                        item.value === selected ? color : "hover:bg-[var(--vpd-surface-hover)]",
                    )}
                >
                    {item.text}
                </button>
            ))}
        </div>
    );
}

/** Hour / minute (/ AM-PM) columns. `value` is in 24h; picking a hour or minute with no value starts at 0. */
export function TimeColumns({
    value,
    onChange,
    hour12,
    minuteStep,
    labels,
    variantColor,
    hasCustomColor,
}: {
    value?: { h: number; m: number };
    onChange: (next: { h: number; m: number }) => void;
    hour12: boolean;
    minuteStep: number;
    labels: TimeLabels;
    variantColor: ControlColors;
    hasCustomColor: boolean;
}) {
    const selectedColor = (hasCustomColor ? customDateColor : dateColors[variantColor]).selected;
    const h = value?.h;
    const m = value?.m;
    const isPm = (h ?? 0) >= 12;

    const hours = hour12
        ? Array.from({ length: 12 }, (_, i) => ({
              key: `h${i}`,
              text: String(i + 1),
              value: i + 1,
          }))
        : Array.from({ length: 24 }, (_, i) => ({ key: `h${i}`, text: pad(i), value: i }));
    const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => ({
        key: `m${i}`,
        text: pad(i * minuteStep),
        value: i * minuteStep,
    }));

    // 12h hour (1-12) + period -> 24h hour.
    const to24 = (hour12Value: number, pm: boolean) => (hour12Value % 12) + (pm ? 12 : 0);

    return (
        <div className="flex divide-x divide-[var(--vpd-border-soft)]">
            <Column
                label={labels.hours}
                items={hours}
                selected={h === undefined ? undefined : hour12 ? h % 12 || 12 : h}
                onSelect={(v) => onChange({ h: hour12 ? to24(v, isPm) : v, m: m ?? 0 })}
                color={selectedColor}
            />
            <Column
                label={labels.minutes}
                items={minutes}
                selected={m}
                onSelect={(v) => onChange({ h: h ?? 0, m: v })}
                color={selectedColor}
            />
            {hour12 ? (
                <Column
                    label={labels.period}
                    items={[
                        { key: "am", text: labels.am, value: 0 },
                        { key: "pm", text: labels.pm, value: 1 },
                    ]}
                    selected={h === undefined ? undefined : isPm ? 1 : 0}
                    onSelect={(v) => onChange({ h: to24((h ?? 0) % 12 || 12, v === 1), m: m ?? 0 })}
                    color={selectedColor}
                />
            ) : null}
        </div>
    );
}
