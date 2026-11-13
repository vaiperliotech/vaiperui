import * as React from "react";

import { formatTime, parseTime, toTimeString } from "../../lib/date";
import { PickerField } from "../shared/PickerField";
import { DEFAULT_TIME_LABELS, TimeColumns } from "../shared/TimeColumns";
import type { TimePickerProps } from "./types";

export function TimePicker({
    value,
    defaultValue,
    onValueChange,
    name,
    hour12 = false,
    minuteStep = 1,
    labels,
    placeholder,
    panelLabel = "Choose a time",
    ...field
}: TimePickerProps) {
    const [inner, setInner] = React.useState(defaultValue);
    const current = parseTime(value !== undefined ? value : inner);
    const text = { ...DEFAULT_TIME_LABELS, ...labels };

    return (
        <PickerField
            {...field}
            text={
                current
                    ? formatTime(current.h, current.m, hour12, { am: text.am, pm: text.pm })
                    : undefined
            }
            placeholder={placeholder ?? (hour12 ? "--:-- --" : "--:--")}
            icon="clock"
            panelLabel={panelLabel}
            hiddenInputs={[{ name, value: current ? toTimeString(current.h, current.m) : "" }]}
        >
            {() => (
                <TimeColumns
                    value={current}
                    hour12={hour12}
                    minuteStep={minuteStep}
                    labels={text}
                    variantColor={field.variantColor ?? "primary"}
                    hasCustomColor={Boolean(field.customColor)}
                    onChange={({ h, m }) => {
                        const next = toTimeString(h, m);
                        if (value === undefined) setInner(next);
                        onValueChange?.(next);
                    }}
                />
            )}
        </PickerField>
    );
}
