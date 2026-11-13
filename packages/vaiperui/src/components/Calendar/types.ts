import type { ControlAnimation, ControlColors } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";
import type { DateRange } from "../../lib/date";

export type { DateRange };
export type CalendarColors = ControlColors;
export type CalendarAnimation = ControlAnimation;

/** Options shared by the Calendar and by the pickers that embed it. */
export interface CalendarOptions {
    /** First allowed day. Earlier days (and month arrows leading there) are disabled. */
    minDate?: Date;
    /** Last allowed day. */
    maxDate?: Date;
    /** Language of month and day names, BCP 47. Defaults to `en-US`. */
    locale?: string;
    /** First weekday, 0 (Sunday, default) to 6. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    variantColor?: CalendarColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    animation?: CalendarAnimation;
}

interface CalendarBaseProps extends CalendarOptions {
    /** Focuses the day on mount: use it when the calendar opens inside a panel. */
    autoFocus?: boolean;
    /** Accessible names of the month buttons. */
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    className?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
    mode?: "single";
    value?: Date;
    defaultValue?: Date;
    onValueChange?: (date: Date) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
    mode: "range";
    value?: DateRange;
    defaultValue?: DateRange;
    onValueChange?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;
