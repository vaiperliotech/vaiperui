import * as React from "react";

import { cn } from "../../lib/cn";
import {
    type DateRange,
    datePlaceholder,
    formatDay,
    isAfterDay,
    isBeforeDay,
    isSameDay,
    toISODate,
} from "../../lib/date";
import { Calendar } from "../Calendar/Calendar";
import { PickerField } from "../shared/PickerField";
import { getDatePresets } from "./presets";
import type { DateRangePickerProps } from "./types";

export function DateRangePicker({
    value,
    defaultValue,
    onValueChange,
    presets,
    presetLabels,
    fromName,
    toName,
    minDate,
    maxDate,
    locale = "en-US",
    weekStartsOn,
    placeholder,
    panelLabel = "Choose a period",
    previousMonthLabel,
    nextMonthLabel,
    ...field
}: DateRangePickerProps) {
    const [inner, setInner] = React.useState<DateRange>(defaultValue ?? {});
    const current = value !== undefined ? value : inner;
    const { variantColor, customColor, animation } = field;
    const list = presets === true ? getDatePresets(presetLabels) : presets || undefined;

    function change(next: DateRange) {
        if (value === undefined) setInner(next);
        onValueChange?.(next);
    }

    const sep = " – ";
    const from = current.from ? formatDay(current.from, locale) : undefined;
    const text = from
        ? `${from}${sep}${current.to ? formatDay(current.to, locale) : "…"}`
        : undefined;
    const placeholderText =
        placeholder ?? `${datePlaceholder(locale)}${sep}${datePlaceholder(locale)}`;
    const isOutside = (d: Date) =>
        Boolean((minDate && isBeforeDay(d, minDate)) || (maxDate && isAfterDay(d, maxDate)));

    return (
        <PickerField
            {...field}
            text={text}
            placeholder={placeholderText}
            icon="calendar"
            panelLabel={panelLabel}
            hiddenInputs={[
                { name: fromName, value: current.from ? toISODate(current.from) : "" },
                { name: toName, value: current.to ? toISODate(current.to) : "" },
            ]}
        >
            {({ close }) => (
                <div className="flex flex-col sm:flex-row">
                    {list ? (
                        <div className="flex flex-row flex-wrap gap-1 border-b border-[var(--vpd-border-soft)] p-2 sm:w-40 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0">
                            {list.map((preset) => {
                                const active = Boolean(
                                    current.from &&
                                        current.to &&
                                        isSameDay(current.from, preset.range.from) &&
                                        isSameDay(current.to, preset.range.to),
                                );
                                const disabled =
                                    isOutside(preset.range.from) || isOutside(preset.range.to);
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        disabled={disabled}
                                        aria-pressed={active}
                                        onClick={() => {
                                            change(preset.range);
                                            close();
                                        }}
                                        className={cn(
                                            "rounded-md px-2.5 py-1.5 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vpd-border-strong)] disabled:cursor-not-allowed disabled:opacity-40",
                                            active
                                                ? "bg-[var(--vpd-surface-hover)] font-medium"
                                                : "hover:bg-[var(--vpd-surface-hover)]",
                                        )}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                    <Calendar
                        mode="range"
                        autoFocus
                        value={current}
                        onValueChange={(range) => {
                            change(range);
                            if (range.from && range.to) close();
                        }}
                        minDate={minDate}
                        maxDate={maxDate}
                        locale={locale}
                        weekStartsOn={weekStartsOn}
                        variantColor={variantColor}
                        customColor={customColor}
                        animation={animation}
                        previousMonthLabel={previousMonthLabel}
                        nextMonthLabel={nextMonthLabel}
                    />
                </div>
            )}
        </PickerField>
    );
}
