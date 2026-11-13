import * as React from "react";

import { datePlaceholder, formatDay, formatTime, startOfDay, toISODateTime } from "../../lib/date";
import { Calendar } from "../Calendar/Calendar";
import { PickerField } from "../shared/PickerField";
import { DEFAULT_TIME_LABELS, TimeColumns } from "../shared/TimeColumns";
import type { DateTimePickerProps } from "./types";

export function DateTimePicker({
    value,
    defaultValue,
    onValueChange,
    name,
    minDate,
    maxDate,
    locale = "en-US",
    weekStartsOn,
    hour12 = false,
    minuteStep = 1,
    labels,
    confirmLabel = "OK",
    placeholder,
    panelLabel = "Choose a date and time",
    previousMonthLabel,
    nextMonthLabel,
    ...field
}: DateTimePickerProps) {
    const [inner, setInner] = React.useState(defaultValue);
    const current = value !== undefined ? value : inner;
    const text = { ...DEFAULT_TIME_LABELS, ...labels };
    const { variantColor = "primary", customColor, animation } = field;

    function change(next: Date) {
        if (value === undefined) setInner(next);
        onValueChange?.(next);
    }

    const display = current
        ? `${formatDay(current, locale)} ${formatTime(current.getHours(), current.getMinutes(), hour12, text)}`
        : undefined;

    return (
        <PickerField
            {...field}
            text={display}
            placeholder={
                placeholder ?? `${datePlaceholder(locale)} ${hour12 ? "--:-- --" : "--:--"}`
            }
            icon="calendar"
            panelLabel={panelLabel}
            hiddenInputs={[{ name, value: current ? toISODateTime(current) : "" }]}
        >
            {({ close }) => (
                <div>
                    <div className="flex flex-col sm:flex-row">
                        <Calendar
                            autoFocus
                            value={current}
                            onValueChange={(day) =>
                                // Picking a day keeps the time already chosen (or 00:00).
                                change(
                                    new Date(
                                        day.getFullYear(),
                                        day.getMonth(),
                                        day.getDate(),
                                        current?.getHours() ?? 0,
                                        current?.getMinutes() ?? 0,
                                    ),
                                )
                            }
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
                        <div className="border-t border-[var(--vpd-border-soft)] sm:border-t-0 sm:border-l">
                            <TimeColumns
                                value={
                                    current
                                        ? { h: current.getHours(), m: current.getMinutes() }
                                        : undefined
                                }
                                hour12={hour12}
                                minuteStep={minuteStep}
                                labels={text}
                                variantColor={variantColor}
                                hasCustomColor={Boolean(customColor)}
                                onChange={({ h, m }) => {
                                    // Choosing a time before a day uses today.
                                    const base = startOfDay(current ?? new Date());
                                    change(
                                        new Date(
                                            base.getFullYear(),
                                            base.getMonth(),
                                            base.getDate(),
                                            h,
                                            m,
                                        ),
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end border-t border-[var(--vpd-border-soft)] p-2">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-[var(--vpd-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vpd-border-strong)]"
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            )}
        </PickerField>
    );
}
