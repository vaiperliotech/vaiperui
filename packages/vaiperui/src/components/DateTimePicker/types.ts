import type { CalendarOptions } from "../Calendar/types";
import type { PickerBaseProps } from "../DatePicker/types";
import type { TimeLabels } from "../shared/TimeColumns";

export interface DateTimePickerProps extends PickerBaseProps, CalendarOptions {
    /** A `Date` with the day and the time of day. Seconds are ignored. */
    value?: Date;
    defaultValue?: Date;
    /** Called whenever the day, hour, minute or period changes. */
    onValueChange?: (date: Date) => void;
    /** Form field name: sends `yyyy-mm-ddTHH:mm`. */
    name?: string;
    /** Show and pick the hour in 12h with an AM/PM column. Defaults to false. */
    hour12?: boolean;
    /** Granularity of the minutes column, in minutes. Defaults to 1. */
    minuteStep?: number;
    /** Texts of the time columns. */
    labels?: Partial<TimeLabels>;
    /** Text of the button that closes the panel. */
    confirmLabel?: string;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
}
