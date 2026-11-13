import * as React from "react";

/** Controlled when `value` is defined, otherwise keeps its own state starting at `defaultValue`. */
export function useMediaControlled<T>(
    value: T | undefined,
    defaultValue: T,
    onChange?: (value: T) => void,
) {
    const [inner, setInner] = React.useState(defaultValue);
    const current = value ?? inner;
    const set = (next: T) => {
        if (value === undefined) setInner(next);
        if (next !== current) onChange?.(next);
    };
    return [current, set] as const;
}
