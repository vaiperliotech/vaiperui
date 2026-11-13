import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import {
    addDays,
    addMonths,
    clampDay,
    type DateRange,
    endOfMonth,
    fullDayLabel,
    isAfterDay,
    isBeforeDay,
    isSameDay,
    monthTitle,
    monthWeeks,
    startOfDay,
    startOfMonth,
    toISODate,
    weekdayNames,
} from "../../lib/date";
import { customDateColor, dateColors } from "../../lib/dateStyles";
import type { CalendarProps } from "./types";

const chevron = (direction: "left" | "right") => (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
            d={direction === "left" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"}
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const navButton =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--vpd-text-secondary)] hover:bg-[var(--vpd-surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vpd-border-strong)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export function Calendar(props: CalendarProps) {
    const {
        minDate,
        maxDate,
        locale = "en-US",
        weekStartsOn = 0,
        variantColor = "primary",
        customColor,
        animation = "smooth",
        autoFocus = false,
        previousMonthLabel = "Previous month",
        nextMonthLabel = "Next month",
        className,
    } = props;
    const isRange = props.mode === "range";

    const [inner, setInner] = React.useState<Date | DateRange | undefined>(props.defaultValue);
    const current = props.value !== undefined ? props.value : inner;
    const selectedDay = isRange ? undefined : (current as Date | undefined);
    const range = isRange ? ((current as DateRange | undefined) ?? {}) : undefined;

    const [focused, setFocused] = React.useState(() =>
        clampDay(startOfDay(selectedDay ?? range?.from ?? new Date()), minDate, maxDate),
    );
    const gridRef = React.useRef<HTMLTableElement>(null);
    // Focus moves to the day buttons only after a key press (or on mount with autoFocus).
    const pendingFocus = React.useRef(autoFocus);

    React.useEffect(() => {
        if (!pendingFocus.current) return;
        pendingFocus.current = false;
        gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISODate(focused)}"]`)?.focus();
    }, [focused]);

    function select(day: Date) {
        let next: Date | DateRange;
        if (!range) next = day;
        else if (!range.from || range.to || isBeforeDay(day, range.from)) next = { from: day };
        else next = { from: range.from, to: day };
        if (props.value === undefined) setInner(next);
        (props.onValueChange as ((v: Date | DateRange) => void) | undefined)?.(next);
    }

    function move(next: Date) {
        pendingFocus.current = true;
        setFocused(clampDay(next, minDate, maxDate));
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        const moves: Record<string, Date> = {
            ArrowLeft: addDays(focused, -1),
            ArrowRight: addDays(focused, 1),
            ArrowUp: addDays(focused, -7),
            ArrowDown: addDays(focused, 7),
            Home: addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
            End: addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
            PageUp: addMonths(focused, event.shiftKey ? -12 : -1),
            PageDown: addMonths(focused, event.shiftKey ? 12 : 1),
        };
        const next = moves[event.key];
        if (!next) return;
        event.preventDefault();
        move(next);
    }

    const color = customColor ? customDateColor : dateColors[variantColor];
    const outOfRange = (day: Date) =>
        Boolean((minDate && isBeforeDay(day, minDate)) || (maxDate && isAfterDay(day, maxDate)));
    const prevDisabled = Boolean(minDate && !isAfterDay(startOfMonth(focused), minDate));
    const nextDisabled = Boolean(maxDate && !isBeforeDay(endOfMonth(focused), maxDate));
    const title = monthTitle(focused, locale);
    const today = new Date();

    return (
        <div
            className={cn("w-[17rem] select-none p-3", className)}
            style={customColor ? customColorVars(customColor) : undefined}
        >
            <div className="mb-2 flex items-center justify-between">
                <button
                    type="button"
                    aria-label={previousMonthLabel}
                    disabled={prevDisabled}
                    onClick={() => setFocused(clampDay(addMonths(focused, -1), minDate, maxDate))}
                    className={navButton}
                >
                    {chevron("left")}
                </button>
                <div aria-live="polite" className="text-sm font-medium capitalize">
                    {title}
                </div>
                <button
                    type="button"
                    aria-label={nextMonthLabel}
                    disabled={nextDisabled}
                    onClick={() => setFocused(clampDay(addMonths(focused, 1), minDate, maxDate))}
                    className={navButton}
                >
                    {chevron("right")}
                </button>
            </div>
            <table
                ref={gridRef}
                // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: an APG date grid; the day buttons inside are the focusable items
                role="grid"
                aria-label={title}
                className="w-full border-collapse"
            >
                <thead>
                    <tr>
                        {weekdayNames(locale, weekStartsOn).map((name) => (
                            <th
                                key={name}
                                scope="col"
                                className="h-8 text-center text-xs font-normal text-[var(--vpd-text-muted)]"
                            >
                                {name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {monthWeeks(focused, weekStartsOn).map((week) => (
                        <tr key={toISODate(week[0] as Date)}>
                            {week.map((day) => {
                                const isFrom = Boolean(range?.from && isSameDay(day, range.from));
                                const isTo = Boolean(range?.to && isSameDay(day, range.to));
                                const inBand = Boolean(
                                    range?.from &&
                                        range.to &&
                                        !isBeforeDay(day, range.from) &&
                                        !isAfterDay(day, range.to),
                                );
                                const isSelected = selectedDay
                                    ? isSameDay(day, selectedDay)
                                    : isFrom || isTo;
                                const disabled = outOfRange(day);
                                const outside = day.getMonth() !== focused.getMonth();
                                return (
                                    // biome-ignore lint/a11y/useFocusableInteractive: the day button inside the cell takes the focus
                                    <td
                                        key={toISODate(day)}
                                        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: gridcell of the date grid
                                        role="gridcell"
                                        aria-selected={isSelected || inBand || undefined}
                                        className={cn(
                                            "p-0 text-center",
                                            inBand && color.band,
                                            isFrom && inBand && "rounded-l-md",
                                            isTo && inBand && "rounded-r-md",
                                        )}
                                    >
                                        <button
                                            type="button"
                                            data-date={toISODate(day)}
                                            tabIndex={isSameDay(day, focused) ? 0 : -1}
                                            disabled={disabled}
                                            aria-label={fullDayLabel(day, locale)}
                                            aria-current={
                                                isSameDay(day, today) ? "date" : undefined
                                            }
                                            onClick={() => select(day)}
                                            onKeyDown={handleKeyDown}
                                            className={cn(
                                                "h-9 w-9 rounded-md text-sm focus:outline-none",
                                                color.focus,
                                                controlAnimations[animation],
                                                disabled
                                                    ? "cursor-not-allowed opacity-40"
                                                    : "cursor-pointer",
                                                outside &&
                                                    !isSelected &&
                                                    "text-[var(--vpd-text-muted)]",
                                                isSelected
                                                    ? color.selected
                                                    : !disabled &&
                                                          "hover:bg-[var(--vpd-surface-hover)]",
                                                inBand &&
                                                    !isSelected &&
                                                    "rounded-none hover:bg-transparent",
                                                isSameDay(day, today) &&
                                                    !isSelected &&
                                                    "border border-[var(--vpd-border-strong)] font-semibold",
                                            )}
                                        >
                                            {day.getDate()}
                                        </button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
