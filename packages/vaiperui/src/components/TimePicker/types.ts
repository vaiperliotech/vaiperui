import type { PickerBaseProps } from "../DatePicker/types";
import type { TimeLabels } from "../shared/TimeColumns";

export type { TimeLabels };

export interface TimePickerProps extends PickerBaseProps {
    /** Time of day as `"HH:mm"` (24h), e.g. `"14:30"`. */
    value?: string;
    defaultValue?: string;
    /** Called with `"HH:mm"` whenever the hour, minute or period changes. */
    onValueChange?: (time: string) => void;
    /** Form field name: sends `HH:mm`. */
    name?: string;
    /** Show and pick the hour in 12h with an AM/PM column. The value stays `"HH:mm"` in 24h. Defaults to false. */
    hour12?: boolean;
    /** Granularity of the minutes column, in minutes. Defaults to 1. */
    minuteStep?: number;
    /** Texts of the columns. */
    labels?: Partial<TimeLabels>;
}
