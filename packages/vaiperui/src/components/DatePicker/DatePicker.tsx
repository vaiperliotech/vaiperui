import * as React from "react";

import { datePlaceholder, formatDay, toISODate } from "../../lib/date";
import { Calendar } from "../Calendar/Calendar";
import { PickerField } from "../shared/PickerField";
import type { DatePickerProps } from "./types";

export function DatePicker({
    value,
    defaultValue,
    onValueChange,
    name,
    minDate,
    maxDate,
    locale = "en-US",
    weekStartsOn,
    placeholder,
    panelLabel = "Choose a date",
    previousMonthLabel,
    nextMonthLabel,
    ...field
}: DatePickerProps) {
    const [inner, setInner] = React.useState(defaultValue);
    const current = value !== undefined ? value : inner;
    const { variantColor, customColor, animation } = field;

    return (
        <PickerField
            {...field}
            text={current ? formatDay(current, locale) : undefined}
            placeholder={placeholder ?? datePlaceholder(locale)}
            icon="calendar"
            panelLabel={panelLabel}
            hiddenInputs={[{ name, value: current ? toISODate(current) : "" }]}
        >
            {({ close }) => (
                <Calendar
                    autoFocus
                    value={current}
                    onValueChange={(date) => {
                        if (value === undefined) setInner(date);
                        onValueChange?.(date);
                        close();
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
            )}
        </PickerField>
    );
}
