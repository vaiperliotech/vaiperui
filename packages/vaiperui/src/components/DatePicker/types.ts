import type { CalendarOptions } from "../Calendar/types";
import type { PickerStyleProps } from "../shared/PickerField";

export type { DateRange } from "../Calendar/types";

/** Props shared by every field-like date/time picker. */
export interface PickerBaseProps extends PickerStyleProps {
    id?: string;
    label?: string;
    helperText?: string;
    /** Error text; its presence alone forces the error state. */
    errorMessage?: string;
    /** Does not open the panel and grays the field. */
    disabled?: boolean;
    /** Does not open the panel but still shows the value. */
    readOnly?: boolean;
    /** Text shown when nothing is chosen. */
    placeholder?: string;
    /** Accessible name when there is no `label`. */
    "aria-label"?: string;
    /** Accessible name of the panel. */
    panelLabel?: string;
    className?: string;
}

export interface DatePickerProps extends PickerBaseProps, CalendarOptions {
    value?: Date;
    defaultValue?: Date;
    /** Called when a day is chosen. */
    onValueChange?: (date: Date) => void;
    /** Form field name: sends `yyyy-mm-dd`. */
    name?: string;
    /** Accessible names of the month buttons. */
    previousMonthLabel?: string;
    nextMonthLabel?: string;
}
