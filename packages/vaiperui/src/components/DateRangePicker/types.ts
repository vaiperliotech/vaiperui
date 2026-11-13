import type { CalendarOptions, DateRange } from "../Calendar/types";
import type { PickerBaseProps } from "../DatePicker/types";
import type { PresetLabels } from "./presets";

export interface DatePreset {
    label: string;
    range: { from: Date; to: Date };
}

export interface DateRangePickerProps extends PickerBaseProps, CalendarOptions {
    value?: DateRange;
    defaultValue?: DateRange;
    /** Called on every click: first with only `from`, then with `from` and `to`. */
    onValueChange?: (range: DateRange) => void;
    /** Shortcut column beside the calendar. `true` uses `getDatePresets()`; or pass your own list. */
    presets?: boolean | DatePreset[];
    /** Translates the default presets (`presets={true}`). Ignored when you pass your own list. */
    presetLabels?: Partial<PresetLabels>;
    /** Form field names for start and end; each sends `yyyy-mm-dd`. */
    fromName?: string;
    toName?: string;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
}
