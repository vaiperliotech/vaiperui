"use client";

import { useRef, useState } from "react";
import { Select } from "vaiperui";

const ALL = Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: `Item ${i + 1}` }));
const PAGE = 10;
const DELAY = 700;

// Fake API: resolves a slice of ALL after DELAY ms.
export function SelectAsyncDemo({
    mode,
    label,
    loadingMessage,
    searchPlaceholder,
}: {
    mode: "scroll" | "search";
    label: string;
    loadingMessage: string;
    searchPlaceholder: string;
}) {
    const [options, setOptions] = useState(() => ALL.slice(0, PAGE));
    const [loading, setLoading] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    if (mode === "scroll") {
        return (
            <Select
                label={label}
                options={options}
                loading={loading}
                loadingMessage={loadingMessage}
                hasMore={options.length < ALL.length}
                onReachEnd={() => {
                    setLoading(true);
                    window.setTimeout(() => {
                        setOptions((prev) => ALL.slice(0, prev.length + PAGE));
                        setLoading(false);
                    }, DELAY);
                }}
            />
        );
    }

    return (
        <Select
            label={label}
            searchable
            searchPlaceholder={searchPlaceholder}
            options={options}
            loading={loading}
            loadingMessage={loadingMessage}
            onSearchChange={(query) => {
                setLoading(true);
                window.clearTimeout(timer.current);
                timer.current = window.setTimeout(() => {
                    const q = query.trim().toLowerCase();
                    setOptions(ALL.filter((o) => o.label.toLowerCase().includes(q)).slice(0, PAGE));
                    setLoading(false);
                }, DELAY);
            }}
        />
    );
}
